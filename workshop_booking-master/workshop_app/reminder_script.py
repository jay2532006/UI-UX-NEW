import django
import os
import sys
import datetime as dt
import warnings
from textwrap import dedent
from django.core.mail import send_mail
from time import sleep

#Setting Up Django Environment Using Existing settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "workshop_portal.settings")
base_path =  os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(base_path)
django.setup()
#Importing required email credentials
from workshop_portal.settings import (
                    EMAIL_HOST, 
                    EMAIL_PORT, 
                    EMAIL_HOST_USER, 
                    EMAIL_HOST_PASSWORD,
                    EMAIL_USE_TLS,
                    PRODUCTION_URL, 
                    SENDER_EMAIL,
                    ADMIN_EMAIL
                    )
from workshop_app.models import Workshop
from datetime import datetime, date

# Guard against removed models (RequestedWorkshop, ProposeWorkshopDate)
try:
    from workshop_app.models import RequestedWorkshop, ProposeWorkshopDate
except ImportError:
    warnings.warn(
        "DEPRECATION: RequestedWorkshop and ProposeWorkshopDate models no longer exist. "
        "The reminder_script.py references to these models are deprecated and will be "
        "removed in a future version. Only the Workshop model reminders will be processed.",
        DeprecationWarning,
        stacklevel=1
    )
    RequestedWorkshop = None
    ProposeWorkshopDate = None

def send_email():
	upcoming = date.today() + dt.timedelta(days=2)

	# Process proposed workshops (deprecated model)
	if ProposeWorkshopDate is not None:
		upcoming_proposed_workshops = ProposeWorkshopDate.objects.filter(
						proposed_workshop_date=upcoming, 
						status='ACCEPTED'
						)
		for w in upcoming_proposed_workshops:
			message = dedent("""\
					Dear {0}, 

					This is to remind you that
					you have a workshop on {1}, 
					for {2}.

					Create Course and Quiz for your workshop.

					Get in touch with your coordinator so that participants
					can be instructed for enrollment.

					Thank You.
					""".format(w.proposed_workshop_instructor.get_full_name(),
						w.proposed_workshop_date, w.proposed_workshop_title))
			send_mail(
				"Gentle Reminder about workshop on {0}"
				.format(w.proposed_workshop_date),message, SENDER_EMAIL,
				[w.proposed_workshop_instructor.email], fail_silently=False
				)

			message = dedent("""\
					Dear {0},

					This is to remind you that
					you have a workshop on {1},
					for {2}.

					You will receive course instructions from our Instructor shortly.

					Thank You.
					""".format(w.proposed_workshop_coordinator.get_full_name(),
						w.proposed_workshop_date, w.proposed_workshop_title))
			send_mail(
				"Gentle Reminder about workshop on {0}"
				.format(w.proposed_workshop_date),message, SENDER_EMAIL,
				[w.proposed_workshop_coordinator.email], fail_silently=False
				)
	else:
		print("Skipping ProposeWorkshopDate reminders — model no longer exists.")

	# Process requested workshops (deprecated model)
	if RequestedWorkshop is not None:
		upcoming_requested_workshops = RequestedWorkshop.objects.filter(
						requested_workshop_date=upcoming, 
						status='ACCEPTED'
						)
		for w in upcoming_requested_workshops:
			message = dedent("""\
					Dear {0}, 

					This is to remind you that
					you have a workshop on {1}, 
					for {2}.

					Create Course and Quiz for your workshop.

					Get in touch with your coordinator so that participants
					can be instructed for enrollment.

					Thank You.
					""".format(w.requested_workshop_instructor.get_full_name(),
						w.requested_workshop_date, w.requested_workshop_title))
			send_mail(
				"Gentle Reminder about workshop on {0}"
				.format(w.requested_workshop_date),message, SENDER_EMAIL,
				[w.requested_workshop_instructor.email], fail_silently=False
				)

			message = dedent("""\
					Dear {0},

					This is to remind you that
					you have a workshop on {1},
					for {2}.

					You will receive course instructions from our Instructor shortly.

					Thank You.
					""".format(w.requested_workshop_coordinator.get_full_name(),
						w.requested_workshop_date, w.requested_workshop_title))
			send_mail(
				"Gentle Reminder about workshop on {0}"
				.format(w.requested_workshop_date),message, SENDER_EMAIL,
				[w.requested_workshop_coordinator.email], fail_silently=False
				)
	else:
		print("Skipping RequestedWorkshop reminders — model no longer exists.")

send_email()