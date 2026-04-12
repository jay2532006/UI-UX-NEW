import hashlib, logging, random, string

from django.contrib.auth import authenticate
from django.contrib.auth.models import User, Group
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from workshop_app.models import Profile, Workshop, WorkshopType, Comment
from .permissions import IsInstructor, IsCoordinator
from .serializers import (
    RegisterSerializer, LoginSerializer, ProfileSerializer,
    WorkshopListSerializer, WorkshopDetailSerializer,
    WorkshopTypeSerializer, ProposeWorkshopSerializer,
    ChangeDateSerializer, CommentSerializer,
)

logger = logging.getLogger(__name__)


def _get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {'refresh': str(refresh), 'access': str(refresh.access_token)}


def _send_mail_safe(fn_name, *args, **kwargs):
    """
    Call a send_mails function by name. Catches ALL exceptions (not just NameError)
    and logs them — email failure must never break the API response.
    """
    try:
        from workshop_app import send_mails
        fn = getattr(send_mails, fn_name, None)
        if fn:
            fn(*args, **kwargs)
        else:
            logger.warning("send_mails has no function '%s' — email skipped.", fn_name)
    except Exception as e:
        logger.error("Email send failed (%s): %s", fn_name, e)


# ─── Auth ─────────────────────────────────────────────────────────────────────

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        s = RegisterSerializer(data=request.data)
        if not s.is_valid():
            return Response({'success': False, 'errors': s.errors}, status=422)
        d = s.validated_data

        salt = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        key  = hashlib.sha256((salt + d['email']).encode()).hexdigest()

        user = User.objects.create_user(
            username=d['email'], email=d['email'], password=d['password'],
            first_name=d['first_name'], last_name=d['last_name'], is_active=False,
        )
        Profile.objects.create(
            user=user, title=d['title'], institute=d['institute'],
            department=d['department'], phone_number=d['phone'], state=d['state'],
            position=d['position'], activation_key=key, is_email_verified=False,
        )
        # Attempt activation email — failure is logged, never surfaces to client
        _send_mail_safe('send_activation_email', user.email, key)

        return Response(
            {'success': True, 'message': 'Account created. Check your email to activate.'},
            status=201,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        s = LoginSerializer(data=request.data)
        if not s.is_valid():
            return Response({'success': False, 'errors': s.errors}, status=422)

        user = authenticate(request,
                            username=s.validated_data['email'],
                            password=s.validated_data['password'])
        if user is None:
            return Response(
                {'success': False, 'errors': {'non_field_errors': ['Invalid email or password.']}},
                status=401)
        if not user.is_active:
            return Response(
                {'success': False, 'errors': {'non_field_errors':
                    ['Please activate your account via the email link first.']}},
                status=403)

        tokens  = _get_tokens(user)
        profile = ProfileSerializer(user.profile).data
        return Response({'success': True, **tokens, 'user': profile})


class ActivateAccountView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, key):
        try:
            profile = Profile.objects.get(activation_key=key)
        except Profile.DoesNotExist:
            return Response({'success': False, 'errors': 'Invalid or expired link.'}, status=404)
        profile.is_email_verified = True
        profile.user.is_active    = True
        profile.user.save()
        profile.save()
        return Response({'success': True, 'message': 'Account activated. You can now log in.'})


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh = RefreshToken(request.data.get('refresh'))
            return Response({'success': True, 'access': str(refresh.access_token)})
        except Exception:
            return Response({'success': False, 'errors': 'Invalid or expired refresh token.'}, status=401)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'success': True, 'user': ProfileSerializer(request.user.profile).data})


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('id_token')
        if not token:
            return Response({'success': False, 'errors': {'id_token': 'Token is required.'}}, status=422)
            
        try:
            # Verify the token with Google
            # In production, specify your GOOGLE_CLIENT_ID to ensure the token was minted for your app
            from django.conf import settings
            client_id = getattr(settings, 'GOOGLE_CLIENT_ID', None)
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)
            
            email = idinfo.get('email')
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            
            # Check if user exists
            user = User.objects.filter(email=email).first()
            if not user:
                # Create user implicitly
                salt = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
                key = hashlib.sha256((salt + email).encode()).hexdigest()
                user = User.objects.create_user(
                    username=email, email=email, password=User.objects.make_random_password(),
                    first_name=first_name, last_name=last_name, is_active=True,
                )
                Profile.objects.create(
                    user=user, title='Mr.', institute='Google Single Sign-On',
                    department='N/A', phone_number='0000000000', state='MH',
                    position='coordinator', activation_key=key, is_email_verified=True,
                )
            
            # Generate JWT tokens
            if not user.is_active:
                user.is_active = True
                user.save()
            tokens = _get_tokens(user)
            profile_data = ProfileSerializer(user.profile).data
            return Response({'success': True, **tokens, 'user': profile_data})
            
        except ValueError as e:
            # Invalid token
            logger.error(f"Google Token error: {e}")
            return Response({'success': False, 'errors': 'Invalid Google token.'}, status=401)


# ─── Workshop Types ────────────────────────────────────────────────────────────

class WorkshopTypeListView(generics.ListAPIView):
    queryset           = WorkshopType.objects.all()
    serializer_class   = WorkshopTypeSerializer
    permission_classes = [AllowAny]


class WorkshopTypeDetailView(generics.RetrieveAPIView):
    queryset           = WorkshopType.objects.all()
    serializer_class   = WorkshopTypeSerializer
    permission_classes = [AllowAny]


class WorkshopTypeCreateView(generics.CreateAPIView):
    serializer_class   = WorkshopTypeSerializer
    permission_classes = [IsInstructor]


class WorkshopTypeUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = WorkshopType.objects.all()
    serializer_class   = WorkshopTypeSerializer
    permission_classes = [IsInstructor]


# ─── Workshops ─────────────────────────────────────────────────────────────────

class WorkshopListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        is_instructor = request.user.groups.filter(name='instructor').exists()
        qs = (Workshop.objects.select_related('coordinator', 'instructor', 'workshop_type')
              .order_by('-date'))
        if not is_instructor:
            qs = qs.filter(coordinator=request.user)

        status_param = request.query_params.get('status')
        if status_param is not None:
            qs = qs.filter(status=status_param)

        # upcoming=true filter — used by CoordinatorDashboard countdown banner
        if request.query_params.get('upcoming') == 'true':
            from django.utils import timezone
            from datetime import timedelta
            today     = timezone.now().date()
            cutoff    = today + timedelta(days=14)
            qs = qs.filter(
                date__gte=today,
                date__lte=cutoff,
                status=1,
            )

        return Response({'success': True, 'results': WorkshopListSerializer(qs, many=True).data})


class WorkshopDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            w = (Workshop.objects
                 .select_related('coordinator', 'instructor', 'workshop_type')
                 .prefetch_related('comment')
                 .get(pk=pk))
        except Workshop.DoesNotExist:
            return Response({'success': False, 'errors': 'Not found.'}, status=404)
        return Response({'success': True,
                         'workshop': WorkshopDetailSerializer(w, context={'request': request}).data})


class ProposeWorkshopView(APIView):
    permission_classes = [IsAuthenticated, IsCoordinator]

    def post(self, request):
        s = ProposeWorkshopSerializer(data=request.data)
        if not s.is_valid():
            return Response({'success': False, 'errors': s.errors}, status=422)
        d = s.validated_data
        w = Workshop.objects.create(
            coordinator=request.user,
            workshop_type=d['workshop_type'],
            date=d['proposed_workshop_date'],
            status=0,
            tnc_accepted=d.get('terms_accepted', True)
        )
        # Try sending proposal mail — match actual function name in send_mails.py
        _send_mail_safe('send_proposal_mail', w)
        return Response({'success': True, 'workshop_id': w.id}, status=201)


class AcceptWorkshopView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def post(self, request, pk):
        try:
            w = Workshop.objects.get(pk=pk, status=0)
        except Workshop.DoesNotExist:
            return Response({'success': False, 'errors': 'Not found or already processed.'}, status=404)
        w.instructor = request.user
        w.status     = 1
        w.save()
        _send_mail_safe('send_accept_mail', w)
        return Response({'success': True, 'message': 'Workshop accepted.'})


class RejectWorkshopView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def post(self, request, pk):
        try:
            w = Workshop.objects.get(pk=pk, status=0)
        except Workshop.DoesNotExist:
            return Response({'success': False, 'errors': 'Not found or already processed.'}, status=404)
        w.status = 2
        w.save()
        _send_mail_safe('send_reject_mail', w)
        return Response({'success': True, 'message': 'Workshop rejected.'})


class ChangeDateView(APIView):
    permission_classes = [IsAuthenticated, IsInstructor]

    def post(self, request, pk):
        s = ChangeDateSerializer(data=request.data)
        if not s.is_valid():
            return Response({'success': False, 'errors': s.errors}, status=422)
        try:
            w = Workshop.objects.get(pk=pk)
        except Workshop.DoesNotExist:
            return Response({'success': False, 'errors': 'Not found.'}, status=404)
        w.date = s.validated_data['new_date']
        w.save()
        return Response({'success': True, 'message': 'Date updated.'})


class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            w = Workshop.objects.get(pk=pk)
        except Workshop.DoesNotExist:
            return Response({'success': False, 'errors': 'Not found.'}, status=404)

        is_instructor = request.user.groups.filter(name='instructor').exists()
        # Frontend MUST send field named "is_private" (boolean) — documented here
        is_private    = bool(request.data.get('is_private', False)) and is_instructor
        comment_text  = request.data.get('comment', '').strip()

        if not comment_text:
            return Response({'success': False, 'errors': {'comment': 'Comment cannot be empty.'}}, status=422)

        c = Comment.objects.create(
            author=request.user, comment=comment_text, is_private=is_private)
        w.comment.add(c)
        return Response({'success': True, 'comment': CommentSerializer(c).data}, status=201)


# ─── Statistics (with query param filtering) ─────────────────────────────────

class PublicStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from workshop_app.models import Workshop
        from collections import Counter

        qs = Workshop.objects.filter(status=1).select_related(
            'coordinator__profile', 'workshop_type')

        # Query param filters — matches frontend filter bar (Phase 12)
        state_param = request.query_params.get('state')
        type_param  = request.query_params.get('type')
        from_date   = request.query_params.get('from_date')
        to_date     = request.query_params.get('to_date')

        if state_param:
            qs = qs.filter(coordinator__profile__state=state_param)
        if type_param:
            qs = qs.filter(workshop_type__name=type_param)
        if from_date:
            qs = qs.filter(date__gte=from_date)
        if to_date:
            qs = qs.filter(date__lte=to_date)

        # Try pandas aggregation first (statistics_app already has this logic)
        try:
            from statistics_app.views import get_public_stats_data
            data = get_public_stats_data(request)
            return Response({'success': True, **data})
        except Exception:
            pass

        # Fallback: pure Python aggregation
        records = [
            {
                'state': getattr(getattr(w.coordinator, 'profile', None), 'state', 'Unknown'),
                'type':  w.workshop_type.name if w.workshop_type else 'Unknown',
            }
            for w in qs
        ]
        state_counts = Counter(r['state'] for r in records)
        type_counts  = Counter(r['type']  for r in records)

        return Response({
            'success': True,
            'total_workshops':    len(records),
            'total_states':       len(state_counts),
            'workshops_by_state': dict(state_counts),
            'workshops_by_type':  [{'name': k, 'count': v} for k, v in type_counts.items()],
        })


class StatsCsvView(APIView):
    """CSV export — matches the 'Download CSV' button in Phase 12 StatisticsPage."""
    permission_classes = [AllowAny]

    def get(self, request):
        import csv
        from django.http import HttpResponse
        from workshop_app.models import Workshop

        qs = Workshop.objects.filter(status=1).select_related(
            'coordinator__profile', 'workshop_type')

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="workshops.csv"'
        writer = csv.writer(response)
        writer.writerow(['Date', 'Workshop Type', 'State', 'Institute', 'Coordinator'])
        for w in qs:
            profile = getattr(w.coordinator, 'profile', None)
            writer.writerow([
                str(w.date),
                w.workshop_type.name if w.workshop_type else '',
                getattr(profile, 'state', ''),
                getattr(profile, 'institute', ''),
                f"{w.coordinator.first_name} {w.coordinator.last_name}".strip(),
            ])
        return response


# ─── Profile ──────────────────────────────────────────────────────────────────

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            try:
                profile = Profile.objects.get(pk=pk)
            except Profile.DoesNotExist:
                return Response({'success': False, 'errors': 'Not found.'}, status=404)
        else:
            profile = request.user.profile
        return Response({'success': True, 'profile': ProfileSerializer(profile).data})

    def patch(self, request, pk=None):
        profile = request.user.profile
        for field in ['title', 'institute', 'department', 'phone_number', 'state']:
            if field in request.data:
                setattr(profile, field, request.data[field])
        profile.save()
        return Response({'success': True, 'profile': ProfileSerializer(profile).data})
