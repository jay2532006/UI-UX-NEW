#!/bin/bash
gunicorn workshop_portal.wsgi:application --bind 0.0.0.0:${PORT:-8000}
