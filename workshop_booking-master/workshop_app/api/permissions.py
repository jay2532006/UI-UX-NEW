from rest_framework.permissions import BasePermission

class IsInstructor(BasePermission):
    message = "Only instructors can perform this action."
    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and
                request.user.groups.filter(name='instructor').exists())

class IsCoordinator(BasePermission):
    message = "Only coordinators can perform this action."
    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and
                not request.user.groups.filter(name='instructor').exists())
