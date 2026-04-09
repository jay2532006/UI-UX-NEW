import datetime as dt

from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from workshop_app.models import (
    Profile, Workshop, WorkshopType, Comment, AttachmentFile, states
)
from workshop_app.utils import is_instructor, is_email_checked
from workshop_app.send_mails import send_email, generate_activation_key

from .serializers import (
    UserSerializer, ProfileSerializer, ProfileUpdateSerializer,
    WorkshopTypeSerializer, WorkshopTypeCreateSerializer,
    WorkshopListSerializer, WorkshopDetailSerializer, WorkshopCreateSerializer,
    CommentSerializer, RegisterSerializer,
)


# ─── Pagination ───────────────────────────────────────────────

class StandardPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 50


# ─── Auth Endpoints ──────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    username = request.data.get('username', '')
    password = request.data.get('password', '')
    user = authenticate(username=username, password=password)
    if user is None:
        return Response(
            {'error': 'Invalid username or password.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    if not hasattr(user, 'profile') or not user.profile.is_email_verified:
        return Response(
            {'error': 'Please verify your email before logging in.'},
            status=status.HTTP_403_FORBIDDEN
        )
    login(request, user)
    return Response(UserSerializer(user).data)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_logout(request):
    logout(request)
    return Response({'detail': 'Logged out successfully.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    # Create user
    new_user = User.objects.create_user(
        data['username'], data['email'], data['password']
    )
    new_user.first_name = data['first_name']
    new_user.last_name = data['last_name']
    new_user.save()

    # Create profile
    activation_key = generate_activation_key(new_user.username)
    profile = Profile(
        user=new_user,
        title=data['title'],
        institute=data['institute'],
        department=data['department'],
        phone_number=data['phone_number'],
        location=data['location'],
        state=data['state'],
        position=data.get('position', 'coordinator'),
        activation_key=activation_key,
        key_expiry_time=timezone.now() + timezone.timedelta(days=1),
    )
    profile.save()

    # Authenticate and login
    new_user = authenticate(username=data['username'], password=data['password'])
    login(request, new_user)

    # Send activation email
    try:
        send_email(
            request, call_on='Registration',
            user_position=profile.position,
            key=activation_key
        )
    except Exception:
        pass  # Email sending should not block registration

    return Response(
        {'detail': 'Registration successful. Please check your email to activate your account.'},
        status=status.HTTP_201_CREATED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_me(request):
    return Response(UserSerializer(request.user).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_activate(request, key):
    profile = Profile.objects.filter(activation_key=key).first()
    if not profile:
        return Response(
            {'error': 'Invalid activation key.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    profile.is_email_verified = True
    profile.save()
    return Response({'detail': 'Account activated successfully.'})


# ─── Workshop Endpoints ──────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def api_workshops(request):
    user = request.user

    if request.method == 'GET':
        if is_instructor(user):
            # Instructor sees pending + their upcoming workshops
            today = timezone.now().date()
            workshops = Workshop.objects.filter(
                Q(instructor=user.id, date__gte=today) | Q(status=0)
            ).order_by('-date')
        else:
            # Coordinator sees own workshops
            workshops = Workshop.objects.filter(
                coordinator=user.id
            ).order_by('-date')

        # Optional status filter
        status_filter = request.query_params.get('status')
        if status_filter is not None:
            workshops = workshops.filter(status=int(status_filter))

        paginator = StandardPagination()
        page = paginator.paginate_queryset(workshops, request)
        serializer = WorkshopListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    # POST — coordinator proposes a workshop
    if is_instructor(user):
        return Response(
            {'error': 'Instructors cannot propose workshops.'},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = WorkshopCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    # Check for duplicate
    if Workshop.objects.filter(
        date=data['date'],
        workshop_type=data['workshop_type'],
        coordinator=user
    ).exists():
        return Response(
            {'error': 'You have already proposed this workshop for this date.'},
            status=status.HTTP_409_CONFLICT
        )

    workshop = Workshop.objects.create(
        coordinator=user,
        workshop_type=data['workshop_type'],
        date=data['date'],
        tnc_accepted=data['tnc_accepted'],
    )

    # Email all instructors
    instructors = Profile.objects.filter(position='instructor')
    for i in instructors:
        try:
            send_email(
                request, call_on='Proposed Workshop',
                user_position='instructor',
                workshop_date=str(workshop.date),
                workshop_title=workshop.workshop_type,
                user_name=user.get_full_name(),
                other_email=i.user.email,
                phone_number=user.profile.phone_number,
                institute=user.profile.institute
            )
        except Exception:
            pass

    return Response(
        WorkshopListSerializer(workshop).data,
        status=status.HTTP_201_CREATED
    )


@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def api_workshop_detail(request, workshop_id):
    workshop = Workshop.objects.filter(id=workshop_id).first()
    if not workshop:
        return Response({'error': 'Workshop not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = WorkshopDetailSerializer(workshop, context={'request': request})
        return Response(serializer.data)

    # DELETE
    if not is_instructor(request.user):
        return Response({'error': 'Only instructors can delete workshops.'}, status=status.HTTP_403_FORBIDDEN)

    workshop.status = 2
    workshop.save()

    try:
        send_email(
            request, call_on='Workshop Deleted',
            workshop_date=str(workshop.date),
            workshop_title=workshop.workshop_type.name,
            other_email=workshop.coordinator.email
        )
    except Exception:
        pass

    return Response({'detail': 'Workshop deleted.'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_accept_workshop(request, workshop_id):
    user = request.user
    if not is_instructor(user):
        return Response({'error': 'Only instructors can accept workshops.'}, status=status.HTTP_403_FORBIDDEN)

    workshop = Workshop.objects.filter(id=workshop_id).first()
    if not workshop:
        return Response({'error': 'Workshop not found.'}, status=status.HTTP_404_NOT_FOUND)

    workshop.status = 1
    workshop.instructor = user
    workshop.save()

    coordinator_profile = workshop.coordinator.profile

    # Email instructor
    try:
        send_email(
            request, call_on='Booking Confirmed',
            user_position='instructor',
            workshop_date=str(workshop.date),
            workshop_title=workshop.workshop_type.name,
            user_name=workshop.coordinator.get_full_name(),
            other_email=workshop.coordinator.email,
            phone_number=coordinator_profile.phone_number,
            institute=coordinator_profile.institute
        )
    except Exception:
        pass

    # Email coordinator
    try:
        send_email(
            request, call_on='Booking Confirmed',
            workshop_date=str(workshop.date),
            workshop_title=workshop.workshop_type.name,
            other_email=workshop.coordinator.email,
            phone_number=request.user.profile.phone_number
        )
    except Exception:
        pass

    return Response(WorkshopListSerializer(workshop).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_reject_workshop(request, workshop_id):
    user = request.user
    if not is_instructor(user):
        return Response({'error': 'Only instructors can reject workshops.'}, status=status.HTTP_403_FORBIDDEN)

    workshop = Workshop.objects.filter(id=workshop_id).first()
    if not workshop:
        return Response({'error': 'Workshop not found.'}, status=status.HTTP_404_NOT_FOUND)

    workshop.status = 2  # Rejected maps to Deleted status
    workshop.save()

    try:
        send_email(
            request, call_on='Booking Request Rejected',
            workshop_date=str(workshop.date),
            workshop_title=workshop.workshop_type.name,
            other_email=workshop.coordinator.email
        )
    except Exception:
        pass

    return Response({'detail': 'Workshop rejected.'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_change_workshop_date(request, workshop_id):
    user = request.user
    if not is_instructor(user):
        return Response({'error': 'Only instructors can change workshop dates.'}, status=status.HTTP_403_FORBIDDEN)

    new_date_str = request.data.get('new_date')
    if not new_date_str:
        return Response({'error': 'new_date is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        new_date = dt.datetime.strptime(new_date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

    if new_date <= dt.date.today():
        return Response({'error': 'New date must be in the future.'}, status=status.HTTP_400_BAD_REQUEST)

    workshop = Workshop.objects.filter(id=workshop_id).first()
    if not workshop:
        return Response({'error': 'Workshop not found.'}, status=status.HTTP_404_NOT_FOUND)

    old_date = workshop.date
    workshop.date = new_date
    workshop.save()

    # Email instructor
    try:
        send_email(
            request, call_on='Change Date',
            user_position='instructor',
            workshop_date=str(old_date),
            new_workshop_date=str(new_date)
        )
    except Exception:
        pass

    # Email coordinator
    try:
        send_email(
            request, call_on='Change Date',
            new_workshop_date=str(new_date),
            workshop_date=str(old_date),
            other_email=workshop.coordinator.email
        )
    except Exception:
        pass

    return Response(WorkshopListSerializer(workshop).data)


# ─── Comments ────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_add_comment(request, workshop_id):
    workshop = Workshop.objects.filter(id=workshop_id).first()
    if not workshop:
        return Response({'error': 'Workshop not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CommentSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    comment = Comment(
        author=request.user,
        comment=serializer.validated_data['comment'],
        public=serializer.validated_data.get('public', True) if is_instructor(request.user) else True,
        created_date=timezone.now(),
        workshop=workshop,
    )
    comment.save()
    return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)


# ─── Workshop Types ──────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def api_workshop_types(request):
    if request.method == 'GET':
        types = WorkshopType.objects.all().order_by('id')
        paginator = StandardPagination()
        page = paginator.paginate_queryset(types, request)
        serializer = WorkshopTypeSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    # POST — instructor creates
    if not request.user.is_authenticated or not is_instructor(request.user):
        return Response(
            {'error': 'Only instructors can create workshop types.'},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = WorkshopTypeCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    wt = serializer.save()
    return Response(
        WorkshopTypeSerializer(wt, context={'request': request}).data,
        status=status.HTTP_201_CREATED
    )


@api_view(['GET', 'PUT'])
@permission_classes([AllowAny])
def api_workshop_type_detail(request, workshop_type_id):
    wt = WorkshopType.objects.filter(id=workshop_type_id).first()
    if not wt:
        return Response({'error': 'Workshop type not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = WorkshopTypeSerializer(wt, context={'request': request})
        return Response(serializer.data)

    # PUT — instructor edits
    if not request.user.is_authenticated or not is_instructor(request.user):
        return Response({'error': 'Only instructors can edit workshop types.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = WorkshopTypeCreateSerializer(wt, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    wt = serializer.save()
    return Response(WorkshopTypeSerializer(wt, context={'request': request}).data)


# ─── Profile ─────────────────────────────────────────────────

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def api_own_profile(request):
    profile = request.user.profile

    if request.method == 'GET':
        return Response(UserSerializer(request.user).data)

    serializer = ProfileUpdateSerializer(profile, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    serializer.save()
    return Response(UserSerializer(request.user).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_user_profile(request, user_id):
    if not is_instructor(request.user):
        return Response({'error': 'Only instructors can view other profiles.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        target_user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Get coordinator's workshops
    workshops = Workshop.objects.filter(coordinator=user_id).order_by('date')
    user_data = UserSerializer(target_user).data
    user_data['workshops'] = WorkshopListSerializer(workshops, many=True).data
    return Response(user_data)


# ─── Statistics ──────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def api_public_stats(request):
    from_date = request.query_params.get('from_date')
    to_date = request.query_params.get('to_date')
    state = request.query_params.get('state')
    workshoptype = request.query_params.get('workshop_type')
    show_workshops = request.query_params.get('show_workshops')
    sort = request.query_params.get('sort', 'date')

    if from_date and to_date:
        workshops = Workshop.objects.filter(
            date__range=(from_date, to_date), status=1
        ).order_by(sort)
        if state:
            workshops = workshops.filter(coordinator__profile__state=state)
        if workshoptype:
            workshops = workshops.filter(workshop_type_id=workshoptype)
    else:
        today = timezone.now()
        upto = today + dt.timedelta(days=15)
        workshops = Workshop.objects.filter(
            date__range=(today, upto), status=1
        ).order_by('date')

    if show_workshops and request.user.is_authenticated:
        if is_instructor(request.user):
            workshops = workshops.filter(instructor_id=request.user.id)
        else:
            workshops = workshops.filter(coordinator_id=request.user.id)

    ws_states, ws_count = Workshop.objects.get_workshops_by_state(workshops)
    ws_type, ws_type_count = Workshop.objects.get_workshops_by_type(workshops)

    # Paginate the workshop list — guard against empty results
    paginator = PageNumberPagination()
    paginator.page_size = 30
    page = paginator.paginate_queryset(workshops, request)
    workshops_data = WorkshopListSerializer(page or [], many=True).data

    total_count = workshops.count()
    if paginator.page is not None:
        pagination_meta = {
            'count': paginator.page.paginator.count,
            'next': paginator.get_next_link(),
            'previous': paginator.get_previous_link(),
        }
    else:
        pagination_meta = {'count': total_count, 'next': None, 'previous': None}

    return Response({
        'workshops': workshops_data,
        'ws_states': ws_states,
        'ws_count': ws_count,
        'ws_type': ws_type,
        'ws_type_count': ws_type_count,
        'total_workshops': total_count,
        'pagination': pagination_meta,
        'filters': {
            'states': [{'code': code, 'name': name} for code, name in states if code],
            'workshop_types': list(WorkshopType.objects.values('id', 'name')),
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_team_stats(request, team_id=None):
    from teams.models import Team

    teams = Team.objects.all()
    if team_id:
        team = teams.filter(id=team_id).first()
    else:
        team = teams.first()

    if not team:
        return Response({'error': 'No teams found.'}, status=status.HTTP_404_NOT_FOUND)

    if not team.members.filter(user_id=request.user.id).exists():
        return Response({'error': 'You are not a member of this team.'}, status=status.HTTP_403_FORBIDDEN)

    member_workshop_data = {}
    for member in team.members.all():
        workshop_count = Workshop.objects.filter(instructor_id=member.user.id).count()
        member_workshop_data[member.user.get_full_name()] = workshop_count

    return Response({
        'team_id': team.id,
        'team_labels': list(member_workshop_data.keys()),
        'ws_count': list(member_workshop_data.values()),
        'all_teams': list(teams.values('id')),
    })
