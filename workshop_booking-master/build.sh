#!/usr/bin/env bash
# build.sh — Render Build Script
# Runs once per deploy before the web service starts.
set -o errexit   # Exit on any error

echo "==> Installing Python dependencies..."
pip install -r requirements.txt

echo "==> Collecting static files..."
python manage.py collectstatic --no-input

echo "==> Running database migrations..."
python manage.py migrate --no-input

echo "==> Build complete ✓"
