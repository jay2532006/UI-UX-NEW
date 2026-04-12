# Python Imports
import datetime as dt
import pandas as pd

# Django Imports
from django.template.loader import get_template
from django.template import RequestContext
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils import timezone
from django.http import HttpResponse

# Local Imports
from workshop_app.models import (
    Profile, User, has_profile, Workshop, WorkshopType, Testimonial,
    states
)
from teams.models import Team
from .forms import FilterForm
from workshop_app.utils import is_email_checked, is_instructor


def workshop_public_stats(request):
    user = request.user
    form = FilterForm()
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')
    state = request.GET.get('state')
    workshoptype = request.GET.get('workshop_type')
    show_workshops = request.GET.get('show_workshops')
    sort = request.GET.get('sort')
    download = request.GET.get('download')

    if from_date and to_date:
        form = FilterForm(
            start=from_date, end=to_date, state=state, type=workshoptype,
            show_workshops=show_workshops, sort=sort
        )
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
            ).order_by("date")
    if show_workshops:
        if is_instructor(user):
            workshops = workshops.filter(instructor_id=user.id)
        else:
            workshops = workshops.filter(coordinator_id=user.id)
    if download:
        data = workshops.values(
            "workshop_type__name", "coordinator__first_name",
            "coordinator__last_name", "instructor__first_name",
            "instructor__last_name", "coordinator__profile__state",
            "date", "status"
        )
        df = pd.DataFrame(list(data))
        if not df.empty:
            df.status.replace(
                [0, 1, 2], ['Pending', 'Success', 'Reject'], inplace=True
            )
            codes, states_map = list(zip(*states))
            df.coordinator__profile__state.replace(
                codes, states_map, inplace=True
            )
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename=statistics.csv'
            output_file = df.to_csv(response, index=False)
            return response
        else:
            messages.add_message(request, messages.WARNING, "No data found")
    ws_states, ws_count = Workshop.objects.get_workshops_by_state(workshops)
    ws_type, ws_type_count = Workshop.objects.get_workshops_by_type(workshops)
    paginator = Paginator(workshops, 30)
    page = request.GET.get('page')
    workshops = paginator.get_page(page)
    context = {"form": form, "objects": workshops, "ws_states": ws_states,
               "ws_count": ws_count, "ws_type": ws_type,
               "ws_type_count": ws_type_count}
    return render(
        request, 'statistics_app/workshop_public_stats.html', context
    )


@login_required
def team_stats(request, team_id=None):
    user = request.user
    teams = Team.objects.all()
    if team_id:
        team = teams.get(id=team_id)
    else:
        team = teams.first()
    if not team.members.filter(user_id=user.id).exists():
        messages.add_message(
            request, messages.INFO, "You are not added to the team"
        )
        return redirect(reverse("workshop_app:index"))

    member_workshop_data = {}
    for member in team.members.all():
        workshop_count = Workshop.objects.filter(
            instructor_id=member.user.id).count()
        member_workshop_data[member.user.get_full_name()] = workshop_count
    TEAM_LABELS = list(member_workshop_data.keys())
    WS_COUNT = list(member_workshop_data.values())
    return render(
        request, 'statistics_app/team_stats.html',
        {'team_labels': TEAM_LABELS, "ws_count": WS_COUNT, 'all_teams': teams,
         'team_id': team.id}
    )


def get_public_stats_data(request):
    """Returns a dict — called by workshop_app.api.views.PublicStatsView."""
    import pandas as pd
    from workshop_app.models import Workshop

    qs = Workshop.objects.filter(status=1).select_related(
        'coordinator__profile', 'workshop_type')

    if not qs.exists():
        return {'total_workshops': 0, 'total_states': 0,
                'workshops_by_state': {}, 'workshops_by_type': []}

    records = [
        {
            'state': getattr(getattr(w.coordinator, 'profile', None), 'state', 'Unknown'),
            'type':  w.workshop_type.name if w.workshop_type else 'Unknown',
        }
        for w in qs
    ]
    df        = pd.DataFrame(records)
    by_state  = df.groupby('state').size().to_dict()
    by_type   = df.groupby('type').size().reset_index(name='count')

    return {
        'total_workshops':    len(records),
        'total_states':       len(by_state),
        'workshops_by_state': by_state,
        'workshops_by_type':  [
            {'name': r['type'], 'count': int(r['count'])}
            for _, r in by_type.iterrows()
        ],
    }
