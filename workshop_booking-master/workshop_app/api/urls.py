from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('setup-seed/',              views.SeedDataView.as_view()),
    path('auth/register/',           views.RegisterView.as_view()),
    path('auth/login/',              views.LoginView.as_view()),
    path('auth/google/',             views.GoogleLoginView.as_view()),
    path('auth/refresh/',            views.RefreshTokenView.as_view()),
    path('auth/activate/<str:key>/', views.ActivateAccountView.as_view()),
    path('auth/me/',                 views.MeView.as_view()),

    # Workshop Types
    path('workshop-types/',               views.WorkshopTypeListView.as_view()),
    path('workshop-types/create/',        views.WorkshopTypeCreateView.as_view()),
    path('workshop-types/<int:pk>/',      views.WorkshopTypeDetailView.as_view()),
    path('workshop-types/<int:pk>/edit/', views.WorkshopTypeUpdateDeleteView.as_view()),

    # Workshops  ← ORDER MATTERS: specific paths before <int:pk>/
    path('workshops/',                       views.WorkshopListView.as_view()),
    path('workshops/propose/',               views.ProposeWorkshopView.as_view()),
    path('workshops/instructor/',            views.WorkshopListView.as_view()), # Using the same view with IsInstructor implicit check
    path('workshops/<int:pk>/',              views.WorkshopDetailView.as_view()),
    path('workshops/<int:pk>/accept/',       views.AcceptWorkshopView.as_view()),
    path('workshops/<int:pk>/reject/',       views.RejectWorkshopView.as_view()),
    path('workshops/<int:pk>/change-date/',  views.ChangeDateView.as_view()),
    path('workshops/<int:pk>/comments/',     views.CommentCreateView.as_view()),

    # Statistics
    path('statistics/public/',  views.PublicStatsView.as_view()),
    path('statistics/csv/',     views.StatsCsvView.as_view()),

    # Profile
    path('profile/',           views.ProfileView.as_view()),
    path('profile/<int:pk>/',  views.ProfileView.as_view()),
]
