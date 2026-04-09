"""workshop_portal URL Configuration"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse
from workshop_portal import views
from django.conf import settings


def health_check(request):
    """Lightweight health-check endpoint for Render/load-balancers."""
    return JsonResponse({'status': 'ok'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health_check, name='health-check'),
    path('', views.index),
    path('workshop/', include('workshop_app.urls')),
    path('reset/', include('django.contrib.auth.urls')),
    path('page/', include('cms.urls')),
    path('statistics/', include('statistics_app.urls')),
    path('api/', include('workshop_app.api.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
