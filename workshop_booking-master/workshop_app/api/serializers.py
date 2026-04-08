from rest_framework import serializers
from django.contrib.auth.models import User
from workshop_app.models import (
    Profile, WorkshopType, AttachmentFile,
    Workshop, Comment, Testimonial,
    states, department_choices, position_choices, title as title_choices
)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'id', 'title', 'institute', 'department',
            'phone_number', 'position', 'location', 'state',
            'is_email_verified',
        ]
        read_only_fields = ['is_email_verified']


class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'profile']
        read_only_fields = ['id', 'username', 'email']

    def get_role(self, obj):
        if obj.groups.filter(name='instructor').exists():
            return 'instructor'
        return 'coordinator'


class ProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', max_length=30)
    last_name = serializers.CharField(source='user.last_name', max_length=30)

    class Meta:
        model = Profile
        fields = [
            'title', 'institute', 'department',
            'phone_number', 'position', 'location', 'state',
            'first_name', 'last_name',
        ]

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        if user_data:
            user = instance.user
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.save()
        return super().update(instance, validated_data)


class AttachmentFileSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = AttachmentFile
        fields = ['id', 'url', 'workshop_type']
        read_only_fields = ['workshop_type']

    def get_url(self, obj):
        request = self.context.get('request')
        if obj.attachments and request:
            return request.build_absolute_uri(obj.attachments.url)
        return None


class WorkshopTypeSerializer(serializers.ModelSerializer):
    attachments = AttachmentFileSerializer(
        source='attachmentfile_set', many=True, read_only=True
    )

    class Meta:
        model = WorkshopType
        fields = ['id', 'name', 'description', 'duration', 'terms_and_conditions', 'attachments']


class WorkshopTypeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkshopType
        fields = ['id', 'name', 'description', 'duration', 'terms_and_conditions']


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'author_name', 'comment', 'public', 'created_date', 'workshop']
        read_only_fields = ['author', 'created_date', 'workshop']


class WorkshopListSerializer(serializers.ModelSerializer):
    workshop_type_name = serializers.CharField(source='workshop_type.name', read_only=True)
    coordinator_name = serializers.CharField(source='coordinator.get_full_name', read_only=True)
    instructor_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status', read_only=True)

    class Meta:
        model = Workshop
        fields = [
            'id', 'uid', 'date', 'status', 'status_display',
            'workshop_type', 'workshop_type_name',
            'coordinator', 'coordinator_name',
            'instructor', 'instructor_name',
            'tnc_accepted',
        ]
        read_only_fields = ['uid', 'coordinator', 'instructor', 'status']

    def get_instructor_name(self, obj):
        if obj.instructor:
            return obj.instructor.get_full_name()
        return None


class WorkshopDetailSerializer(serializers.ModelSerializer):
    workshop_type_detail = WorkshopTypeSerializer(source='workshop_type', read_only=True)
    coordinator_name = serializers.CharField(source='coordinator.get_full_name', read_only=True)
    coordinator_email = serializers.EmailField(source='coordinator.email', read_only=True)
    instructor_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status', read_only=True)
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Workshop
        fields = [
            'id', 'uid', 'date', 'status', 'status_display',
            'workshop_type', 'workshop_type_detail',
            'coordinator', 'coordinator_name', 'coordinator_email',
            'instructor', 'instructor_name',
            'tnc_accepted', 'comments',
        ]

    def get_instructor_name(self, obj):
        if obj.instructor:
            return obj.instructor.get_full_name()
        return None

    def get_comments(self, obj):
        request = self.context.get('request')
        if request and request.user.groups.filter(name='instructor').exists():
            comments = Comment.objects.filter(workshop=obj)
        else:
            comments = Comment.objects.filter(workshop=obj, public=True)
        return CommentSerializer(comments, many=True).data


class WorkshopCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workshop
        fields = ['workshop_type', 'date', 'tnc_accepted']


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=32)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=32, write_only=True)
    confirm_password = serializers.CharField(max_length=32, write_only=True)
    first_name = serializers.CharField(max_length=32)
    last_name = serializers.CharField(max_length=32)
    title = serializers.ChoiceField(choices=title_choices)
    phone_number = serializers.RegexField(regex=r'^.{10}$')
    institute = serializers.CharField(max_length=128)
    department = serializers.ChoiceField(choices=department_choices)
    location = serializers.CharField(max_length=255)
    state = serializers.ChoiceField(choices=states)
    position = serializers.ChoiceField(choices=position_choices, required=False, default='coordinator')

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value.lower()

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email already exists.")
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data


class StatsSerializer(serializers.Serializer):
    """Serializer for public statistics response"""
    ws_states = serializers.ListField(child=serializers.CharField())
    ws_count = serializers.ListField(child=serializers.IntegerField())
    ws_type = serializers.ListField(child=serializers.CharField())
    ws_type_count = serializers.ListField(child=serializers.IntegerField())
    total_workshops = serializers.IntegerField()
