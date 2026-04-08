# FOSSEE Workshop Booking — React UI/UX Redesign Implementation Plan

> **Project**: FOSSEE Workshop Booking Portal (IIT Bombay)  
> **Target**: Django REST API backend + React SPA frontend  
> **Created**: 2026-04-08

---

## Phase 0: Bug Fixes (Pre-requisite) - ✅ COMPLETED

### BUG 1: `admin.py` missing `import csv`
- [x] **File**: `workshop_app/admin.py`
- [x] **Fix**: Add `import csv` at top
- [x] `WorkshopTypeAdmin.download_csv` and `TestimonialAdmin.download_csv` use `csv.writer` without import

### BUG 2: Duplicated helpers
- [x] **Files**: `workshop_app/views.py`, `statistics_app/views.py`
- [x] **Fix**: Create `workshop_app/utils.py`, move `is_email_checked()` and `is_instructor()` there, import in both views

### BUG 3: `reminder_script.py` references removed models
- [x] **File**: `workshop_app/reminder_script.py`
- [x] **Fix**: Wrap `RequestedWorkshop`/`ProposeWorkshopDate` in try/except ImportError with deprecation warning

---

## Phase 1: Project Scaffold & Tooling Setup - ✅ COMPLETED

- [x] Create Vite+React app in `frontend/`
- [x] Install Tailwind CSS v3 with FOSSEE brand tokens
- [x] Configure Vite proxy to Django
- [x] Add DRF + CORS to Django settings
- [x] Update requirements.txt

---

## Phase 2: DRF API Layer - ⏸️ PAUSED (Implementation Code Written)

- [x] Create `workshop_app/api/` package
- [x] Create DRF Serializers (`UserSerializer`, `ProfileSerializer`, `WorkshopSerializer`, etc.)
- [x] Create API Views (Auth, Workshops, Profile, Statistics)
- [x] Create URL Routing (`workshop_app/api/urls.py`)
- [x] Wire into `workshop_portal/urls.py` under `/api/`
- [ ] Debug URL `ImportError` in Django
- [ ] Verify API endpoints with curl

---

## Phase 3: React App Structure & Routing - ✅ COMPLETED

- [x] Created directory structure (api/, context/, hooks/, components/, pages/)
- [x] Created Axios client with CSRF interceptor
- [x] Implemented AuthContext with login/logout/register
- [x] Created custom hooks (useAuth, useWorkshops, useStats)
- [x] Implemented ProtectedRoute for role-based access control
- [x] Created all page placeholders (auth, coordinator, instructor, shared)
- [x] Wired React Router v6 with all routes
- [x] Verified Vite build succeeds with zero errors

---

## Phase 4: Mobile-First UI Component Library - ✅ COMPLETED

- [x] Button component (primary, secondary, danger, ghost variants)
- [x] Card component with title, subtitle, badge support
- [x] Badge component (success, error, warning, default)
- [x] Spinner component (animated loading)
- [x] Modal component (accessible, Escape key support, focus trap)
- [x] Toast component (auto-dismiss notifications)
- [x] EmptyState component with optional CTA
- [x] Navbar component (desktop navigation, role-aware)
- [x] BottomNav component (mobile navigation with active indicator)
- [x] PageWrapper layout component (responsive)
- [x] WorkshopCard component
- [x] WorkshopStatusBadge component (color-coded statuses)
- [x] CommentThread component
- [x] WCAG 2.1 AA accessible throughout
- [x] Vite build verified with zero errors

---

## Phase 5: Core Pages (Coordinator Flow First) - ✅ COMPLETED

- [x] LoginPage - email/password form with validation
- [x] RegisterPage - 3-step wizard (email/personal/state)
- [x] CoordinatorDashboard - greeting, summary cards, recent workshops
- [x] ProposeWorkshopPage - 3-step flow (select type, pick date, review T&C)
- [x] WorkshopStatusPage - filter tabs (All/Pending/Accepted/Rejected)
- [x] Integration with API endpoints
- [x] Mobile-first responsive design (horizontal scroll on mobile)
- [x] Vite build verified (1803 modules, 287KB gzipped)

---

## Phase 6: Instructor Pages & Statistics - ✅ COMPLETED

- [x] InstructorDashboard - pending requests (most urgent), accept/reject buttons, upcoming workshops
- [x] WorkshopManagePage - workshop detail, change date modal, delete modal, comments section
- [x] StatisticsPage (public) - filters, workshop visualization by state/type, CSV download
- [x] ProfilePage (shared) - inline edit mode, role badge, institution details
- [x] Toast notifications for all user actions
- [x] Responsive design for all pages
- [x] Vite build verified (1804 modules, 308KB gzipped)

---

## Phase 7: Performance, SEO, Accessibility

- React.lazy() + Suspense for all pages
- Vite manual chunks
- react-helmet-async for SEO
- WCAG 2.1 AA compliance pass
- ErrorBoundary components
- Updated README.md
