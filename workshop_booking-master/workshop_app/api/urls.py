from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    # Auth
    path('auth/login/', views.api_login, name='login'),
    path('auth/logout/', views.api_logout, name='logout'),
    path('auth/register/', views.api_register, name='register'),
    path('auth/me/', views.api_me, name='me'),
    path('auth/activate/<str:key>/', views.api_activate, name='activate'),

    # Workshops
    path('workshops/', views.api_workshops, name='workshops'),
    path('workshops/<int:workshop_id>/', views.api_workshop_detail, name='workshop-detail'),
    path('workshops/<int:workshop_id>/accept/', views.api_accept_workshop, name='workshop-accept'),
    path('workshops/<int:workshop_id>/reject/', views.api_reject_workshop, name='workshop-reject'),
    path('workshops/<int:workshop_id>/change-date/', views.api_change_workshop_date, name='workshop-change-date'),
    path('workshops/<int:workshop_id>/comments/', views.api_add_comment, name='workshop-comments'),

    # Workshop Types
    path('workshop-types/', views.api_workshop_types, name='workshop-types'),
    path('workshop-types/<int:workshop_type_id>/', views.api_workshop_type_detail, name='workshop-type-detail'),

    # Profile
    path('profile/', views.api_own_profile, name='own-profile'),
    path('profile/<int:user_id>/', views.api_user_profile, name='user-profile'),

    # Statistics
    path('stats/public/', views.api_public_stats, name='public-stats'),
    path('stats/team/', views.api_team_stats, name='team-stats'),
    path('stats/team/<int:team_id>/', views.api_team_stats, name='team-stats-detail'),
]
