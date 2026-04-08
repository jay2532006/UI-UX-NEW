"""
Shared helper functions for workshop_app.
Deduplicated from workshop_app/views.py and statistics_app/views.py.
"""


def is_email_checked(user):
    """Check if the user's email has been verified"""
    if hasattr(user, 'profile'):
        return user.profile.is_email_verified
    return False


def is_instructor(user):
    """Check if the user is having instructor rights"""
    return user.groups.filter(name='instructor').exists()
