from django.contrib.auth.models import User
from rest_framework import serializers
from workshop_app.models import Profile, Workshop, WorkshopType, Comment, AttachmentFile


class RegisterSerializer(serializers.Serializer):
    first_name       = serializers.CharField(max_length=100)
    last_name        = serializers.CharField(max_length=100)
    email            = serializers.EmailField()
    password         = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    title            = serializers.ChoiceField(choices=Profile.TITLE_CHOICES if hasattr(Profile, 'TITLE_CHOICES') else [])
    institute        = serializers.CharField(max_length=200)
    department       = serializers.CharField(max_length=200)
    phone            = serializers.RegexField(
                           regex=r'^\d{10}$',
                           error_messages={'invalid': 'Phone must be exactly 10 digits.'})
    state            = serializers.ChoiceField(choices=Profile.STATE_CHOICES if hasattr(Profile, 'STATE_CHOICES') else [])
    position         = serializers.ChoiceField(choices=[('coordinator', 'Coordinator')])

    # Hardcoding choices if models don't expose TITLE_CHOICES and STATE_CHOICES properly
    # Models have 'title', 'states', 'department_choices' as global tuples not part of Profile class in some versions.
    # We will override init to fetch the global ones dynamically if missing.

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from workshop_app.models import title, states
        self.fields['title'].choices = title
        self.fields['state'].choices = states

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ProfileSerializer(serializers.ModelSerializer):
    first_name    = serializers.CharField(source='user.first_name', read_only=True)
    last_name     = serializers.CharField(source='user.last_name',  read_only=True)
    email         = serializers.EmailField(source='user.email',     read_only=True)
    is_instructor = serializers.SerializerMethodField()

    class Meta:
        model  = Profile
        fields = ['id', 'first_name', 'last_name', 'email',
                  'title', 'institute', 'department', 'phone_number',
                  'state', 'position', 'is_email_verified', 'is_instructor']

    def get_is_instructor(self, obj):
        return obj.user.groups.filter(name='instructor').exists()


class AttachmentFileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = AttachmentFile
        fields = ['id', 'workshop_type', 'attachments']


class WorkshopTypeSerializer(serializers.ModelSerializer):
    attachments = AttachmentFileSerializer(
        source='attachmentfile_set', many=True, read_only=True)
    class Meta:
        model  = WorkshopType
        fields = ['id', 'name', 'description', 'duration', 'terms_and_conditions', 'attachments']


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    created_time = serializers.DateTimeField(source='created_date', read_only=True)
    class Meta:
        model  = Comment
        fields = ['id', 'author', 'author_name', 'comment', 'is_private', 'created_time']
        read_only_fields = ['author', 'created_date']

    def get_author_name(self, obj):
        u = obj.author
        return f"{u.first_name} {u.last_name}".strip() if u else ''


class WorkshopListSerializer(serializers.ModelSerializer):
    workshop_type_name    = serializers.CharField(source='workshop_type.name', read_only=True)
    coordinator_name      = serializers.SerializerMethodField()
    coordinator_institute = serializers.CharField(
        source='coordinator.profile.institute', read_only=True, default='')
    instructor_name       = serializers.SerializerMethodField()
    status_display        = serializers.SerializerMethodField()
    proposed_workshop_date = serializers.DateField(source='date', read_only=True)

    class Meta:
        model  = Workshop
        fields = ['id', 'uid', 'workshop_type', 'workshop_type_name',
                  'coordinator', 'coordinator_name', 'coordinator_institute',
                  'instructor', 'instructor_name',
                  'proposed_workshop_date', 'date', 'status', 'status_display']

    def get_coordinator_name(self, obj):
        u = obj.coordinator
        return f"{u.first_name} {u.last_name}".strip() if u else ''

    def get_instructor_name(self, obj):
        u = obj.instructor
        return f"{u.first_name} {u.last_name}".strip() if u else ''

    def get_status_display(self, obj):
        return {0: 'Pending', 1: 'Accepted', 2: 'Rejected'}.get(obj.status, 'Unknown')


class WorkshopDetailSerializer(WorkshopListSerializer):
    comments             = serializers.SerializerMethodField()
    workshop_type_detail = WorkshopTypeSerializer(source='workshop_type', read_only=True)

    class Meta(WorkshopListSerializer.Meta):
        fields = WorkshopListSerializer.Meta.fields + ['comments', 'workshop_type_detail']

    def get_comments(self, obj):
        request = self.context.get('request')
        qs = obj.comment.all()
        is_instructor = (request and request.user.is_authenticated and
                         request.user.groups.filter(name='instructor').exists())
        if not is_instructor:
            qs = qs.filter(is_private=False)
        return CommentSerializer(qs, many=True).data


class ProposeWorkshopSerializer(serializers.Serializer):
    workshop_type          = serializers.PrimaryKeyRelatedField(queryset=WorkshopType.objects.all())
    proposed_workshop_date = serializers.DateField()
    terms_accepted         = serializers.BooleanField()

    def validate_terms_accepted(self, value):
        if not value:
            raise serializers.ValidationError("You must accept the terms and conditions.")
        return value


class ChangeDateSerializer(serializers.Serializer):
    new_date = serializers.DateField()
