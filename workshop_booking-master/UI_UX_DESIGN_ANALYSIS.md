# FOSSEE Workshop Booking Portal: Comprehensive UI/UX Design Analysis

**Analysis Date:** April 2026  
**System:** React 19.2.4 SPA + Django 4.2 REST API  
**Tech Stack:** Vite 8.0.7, Tailwind CSS 3.4.19, React Router v6  

---

## 1. REACT COMPONENT ARCHITECTURE

### 1.1 Page Routes (12 Pages Total)

#### Authentication Pages
| Page | Route | Purpose | Key Features |
|------|-------|---------|--------------|
| **Login Page** | `/login` | User authentication | Username/email + password, email verification check, role-based redirect |
| **Register Page** | `/register` | New user registration | Profile setup (institute, dept, position, phone), state/title selection |
| **Activation Page** | `/auth/activate/:key` | Email verification | Auto-verified on registration, activation key system |

#### Coordinator Pages
| Page | Route | Purpose | Key Features |
|------|-------|---------|--------------|
| **Coordinator Dashboard** | `/dashboard` | Main coordinator hub | Workshop stats (total/pending/accepted), recent workshops grid, quick propose CTA |
| **Propose Workshop Page** | `/propose` | Create workshop proposal | Workshop type selector, date picker, T&C checkbox, submission modal |
| **Workshop Status Page** | `/my-workshops` | Manage coordinator's proposals | Status filtering (pending/accepted/rejected), date display, instructor assignment view |

#### Instructor Pages
| Page | Route | Purpose | Key Features |
|------|-------|---------|--------------|
| **Instructor Dashboard** | `/instructor/dashboard` | Manage proposals | Pending proposals list, stats (pending/accepted), accept/reject actions |
| **Workshop Manage Page** | `/instructor/workshops/:id` | Single workshop details | Proposal details, instructor notes, accept/reject modals, comments thread |

#### Shared/Public Pages
| Page | Route | Purpose | Key Features |
|------|-------|---------|--------------|
| **Workshop Types** | `/workshop-types` | Browse available workshops | Type cards, description, duration, CTA to propose |
| **Workshop Detail** | `/workshop/:id` | Single workshop details | Full details, instructor info, comments, statistics |
| **Statistics** | `/statistics` | Public analytics | Team stats, workshop count, filters by department/duration |
| **Profile** | `/profile` | User profile management | Edit name, institute, dept, phone, state, position |
| **Not Found** | `*` | 404 error page | Generic error message, navigation CTA |

### 1.2 Component Hierarchy

```
App (Root)
├── Router
│   └── Routes
│       ├── Auth Pages (lazy loaded)
│       │   ├── LoginPage
│       │   ├── RegisterPage
│       │   └── ActivationPage
│       ├── ProtectedRoutes
│       │   ├── Coordinator Routes
│       │   │   ├── CoordinatorDashboard
│       │   │   │   └── [2-3 WorkshopCards]
│       │   │   └── ProposeWorkshopPage
│       │   ├── Instructor Routes
│       │   │   ├── InstructorDashboard
│       │   │   │   └── [Pending/Accepted workshop list]
│       │   │   └── WorkshopManagePage
│       │   │       └── CommentThread
│       │   └── Shared Routes
│       │       ├── WorkshopTypesPage
│       │       ├── WorkshopDetailPage
│       │       ├── ProfilePage
│       │       └── StatisticsPage
│       └── Error Page
│           └── NotFoundPage
├── AuthProvider (Context)
├── ErrorBoundary
└── HelmetProvider (for SEO)
```

### 1.3 UI Component Library (15 Components)

#### Layout Components
| Component | Location | Purpose | Props |
|-----------|----------|---------|-------|
| **Navbar** | `layout/Navbar.jsx` | Desktop-only sticky header | role="navigation", semantic `<nav>` |
| **BottomNav** | `layout/BottomNav.jsx` | Mobile-only bottom tab bar | role="navigation", aria-label, safe-area-inset |
| **PageWrapper** | `layout/PageWrapper.jsx` | Layout container | padding, max-width constraints |

#### UI Components
| Component | Props | Variants | Accessibility |
|-----------|-------|----------|----------------|
| **Button** | variant, fullWidth, disabled, onClick, type | primary, secondary, danger, ghost | min-h-[44px], aria-label, focus-visible:ring-2 |
| **Card** | title, subtitle, badge, onClick, children | default, clickable | rounded-2xl, shadow-sm, hover:shadow-md |
| **Modal** | isOpen, onClose, title, children | full-screen (mobile), max-w-sm (desktop) | role="dialog", aria-modal, aria-labelledby, Escape key trap |
| **Badge** | children | default | bg-fossee-orange, text-white, text-xs, px-2, py-1 |
| **Toast** | type, message, onClose | success, error, info, warning | auto-dismiss (5s), fixed bottom-right, z-50 |
| **Spinner** | size | default (large) | Loading indicator, fade-in animation |
| **EmptyState** | icon, title, message, action | default | Centered layout, CTA optional |

#### Workshop-Specific Components
| Component | Purpose | Data Display |
|-----------|---------|--------------|
| **WorkshopCard** | Grid/list item for workshops | Title, date, coordinator, status badge, instructor |
| **WorkshopStatusBadge** | Status indicator | Status: PENDING (amber), ACCEPTED (green), REJECTED (red) |
| **CommentThread** | Comment section | Author, date, public/private toggle |

#### Route/Auth Components
| Component | Purpose | Implementation |
|-----------|---------|-----------------|
| **ProtectedRoute** | Role-based access control | Checks auth + required roles, redirects to login |
| **ErrorBoundary** | Error catching | Logs errors, shows fallback UI |

### 1.4 State Management Architecture

#### Global State (Context API)
```javascript
AuthContext {
  user: {
    id, username, email, first_name, last_name, full_name,
    profile: { position, institute, department, phone_number, ... },
    role: 'coordinator' | 'instructor'
  },
  isAuthenticated: boolean,
  isLoading: boolean,
  login(username, password) → { success, role, error },
  logout() → void,
  register(userData) → { success, error }
}
```

#### Custom Hooks (Local State)
```javascript
useAuth()
  └── Accesses AuthContext, wraps login/logout/register

useWorkshops()
  └── Fetches workshops with pagination & caching
  └── Returns: { workshops, loading, fetchWorkshops() }

useStats(filters?)
  └── Fetches statistics (public/team)
  └── Returns: { stats, loading, filters, setFilters() }
```

#### Data Flow
```
User Action
  ↓
Component State (useState)
  ↓
API Call (Axios client)
  ↓
AuthContext or Hook update
  ↓
Component Re-render
```

### 1.5 Component Composition Patterns

1. **Container + Presentational**: Pages (containers) use UI components (presentational)
2. **Render Props**: Modal with onClose callback
3. **Custom Hooks**: useAuth, useWorkshops for data fetching
4. **Lazy Loading**: All 12 pages lazy-loaded with React.lazy() + Suspense
5. **ErrorBoundary**: Wraps entire app for error handling
6. **Slot/Children**: Card, Modal, PageWrapper accept children

---

## 2. PAGE FLOWS AND FEATURES

### 2.1 Authentication Flow

**Linear Flow Diagram:**
```
Landing (/)
  ↓
[Not Authenticated?] → /login
  ↓
LoginPage (email/password)
  ↓
POST /api/auth/login/
  ↓
[Email verified?] YES → AuthContext updated
                      ↓
                    [Role?]
                     /  \
                COORD  INSTR
                  /      \
          /dashboard    /instructor/dashboard
         
                   NO → Error: "Verify email first"
```

**API Calls:**
- `POST /api/auth/login/` → Returns User + Profile data
- `POST /api/auth/register/` → Creates User + Profile (auto-verified)
- `GET /api/auth/me/` → Check authenticated user
- `POST /api/auth/logout/` → Clear session

**Key UX Details:**
- Login form has email/password + remember me option
- Form validation on client (email regex, password min 8 chars)
- Loading state disables button + shows spinner
- Toast notifications for errors
- Role-based redirect after login

---

### 2.2 Coordinator Workflow

**Main Purpose:** Propose workshops to instructors, track status

#### Step 1: Browse Available Workshops
```
/dashboard (home)
  ↓
[View Recent Workshops Grid] → Statistics cards
                             → "Propose Workshop" CTA
                             → List of recent proposals
```

**Data Displayed:**
- Total workshops count
- Pending workshops (amber)
- Accepted workshops (green)
- Recent proposals: Title, Date, Status, Instructor

**Component:** CoordinatorDashboard + WorkshopCard

#### Step 2: Propose New Workshop
```
/propose (Workshop Type Browser)
  ↓
[View All Workshop Types] → Cards with description, duration
                          → Browse T&C
  ↓
[Select Type] → Navigate to proposal form
  ↓
ProposeWorkshopPage
  ↓
[Fill Form]
  - Workshop Type (pre-selected from filter)
  - Date picker (future dates)
  - T&C checkbox (required)
  ↓
[Submit] → POST /api/workshops/
  ↓
Modal: "Proposal Sent" → Redirect to /my-workshops
```

**Data Collected:**
- Workshop Type ID
- Date (>= today)
- T&C acceptance flag

**Component:** WorkshopTypesPage → ProposeWorkshopPage → Modal

#### Step 3: Track Workshop Status
```
/my-workshops (Workshop Status Page)
  ↓
[View All Proposals - Grouped by Status]
  - PENDING (awaiting instructor review)
  - ACCEPTED (instructor confirmed)
  - REJECTED (instructor declined)
  ↓
[Click Workshop Card] → WorkshopDetailPage
  ↓
[View Details]
  - Workshop type & description
  - Proposed date
  - Assigned instructor (if accepted)
  - Comments from instructor
  - Change date option (if pending)
```

**Key Actions:**
- Reschedule workshop (PUT `/api/workshops/{id}/change-date/`)
- View instructor comments (GET `/api/workshops/{id}/`)
- Cancel proposal (DELETE `/api/workshops/{id}/`)

---

### 2.3 Instructor Workflow

**Main Purpose:** Review proposals, accept/reject, provide feedback

#### Step 1: Review Pending Proposals
```
/instructor/dashboard (Inbox)
  ↓
[View Proposals - 2 Sections]
  - PENDING (awaiting decision)
  - ACCEPTED (already approved)
  ↓
Stats:
  - Pending count
  - Accepted count
  - Total proposals
```

**Component:** InstructorDashboard + WorkshopCard (filtered)

#### Step 2: Accept or Reject
```
[Click Workshop Card] → WorkshopManagePage
  ↓
[View Full Details]
  - Workshop type
  - Coordinator info
  - Proposed date
  - T&C terms
  - Comments section (read-only)
  ↓
[Action Modal]
  - "Accept" button → POST /api/workshops/{id}/accept/
  - "Reject" button → POST /api/workshops/{id}/reject/
  - Optional: Add comment before action
  ↓
[Confirmed] → Toast "Accepted/Rejected"
           → Status updated in UI
           → Redirect to dashboard
```

**Data Manipulation:**
- Update workshop.status (0→1 ACCEPT, 0→2 REJECT)
- Optionally add comment (POST `/api/workshops/{id}/comments/`)
- System auto-emails coordinator

---

### 2.4 Public Pages

#### Workshop Types (Browse)
```
/workshop-types
  ↓
[Grid of All Workshop Types]
  - Type name, description, duration
  - Clickable cards lead to detail view
  ↓
[Card Click] → /workshop/:id (WorkshopDetailPage)
```

**Data:** `GET /api/workshop-types/`

#### Statistics (Public Analytics)
```
/statistics
  ↓
[Display Metrics]
  - Total workshops conducted
  - By department (filter dropdown)
  - By workshop type (filter dropdown)
  - By date range (optional)
  ↓
[Charts/Cards]
  - Bar chart: workshops by dept
  - Card: total participations
  - Card: average rating
```

**Data:** `GET /api/stats/public/?filters`

#### Profile Management
```
/profile
  ↓
[Display User Info - Read Mode]
  - Name, Email, Institute
  - Department, Position
  - Phone, Location, State
  ↓
[Edit Button] → Toggle edit mode
  ↓
[Form Mode - Edit Each Field]
  - Validation on each field
  - Save/Cancel buttons
  ↓
PUT /api/profile/
  ↓
Toast "Profile Updated"
```

---

## 3. DESIGN SYSTEM AND STYLING

### 3.1 Color Palette (Brand Colors)

```css
/* Primary Brand Colors */
--fossee-blue:        #003865  /* Navy blue, primary action/headers */
--fossee-orange:      #F7941D  /* Orange, secondary action/badges */
--fossee-orange-dark: #C06A00  /* Darker orange, hover state */
--fossee-light:       #EEF4FB  /* Light blue, backgrounds */

/* Semantic Colors (Tailwind extended) */
--success:     rgb(22, 163, 74)    /* green-600 */
--warning:     rgb(217, 119, 6)    /* amber-600 */
--error:       rgb(220, 38, 38)    /* red-600 */
--info:        var(--fossee-blue)

/* Neutral Colors (Tailwind defaults) */
--gray-900:    #111827  /* Text */
--gray-700:    #374151  /* Text secondary */
--gray-600:    #4b5563  /* Text tertiary */
--gray-300:    #d1d5db  /* Borders */
--white:       #ffffff  /* Backgrounds */
```

### 3.2 Typography System

**Font Family:** Inter (system-ui fallback)
- Clean, modern, highly legible
- Excellent for UI and readability
- Available via Google Fonts CDN

**Font Sizes & Weights:**

| Role | Size | Weight | Example | Usage |
|------|------|--------|---------|-------|
| **H1** | 32px (2rem) | 700 (bold) | "Hello, Coordinator 👋" | Page titles |
| **H2** | 24px (1.5rem) | 600 (semibold) | "Recent Workshops" | Section headers |
| **H3** | 20px (1.25rem) | 600 (semibold) | Card titles | Subsection headers |
| **Body Large** | 16px (1rem) | 400 (regular) | Form labels | Primary content |
| **Body** | 14px (0.875rem) | 400 (regular) | Card description | Secondary content |
| **Caption** | 12px (0.75rem) | 400 (regular) | Helper text | Tertiary/disabled |
| **Button** | 14-16px | 600 (semibold) | "Propose Workshop" | Call-to-action |

### 3.3 Spacing System (Tailwind)

**Base Unit:** 4px (0.25rem in Tailwind)

| Scale | Pixels | Tailwind | Usage |
|-------|--------|----------|-------|
| XS | 4px | p-1 | Micro-spacing |
| S | 8px | p-2 | Button padding, icon gaps |
| SM | 12px | p-3 | Input padding |
| M | 16px | p-4 | Card padding, section gap |
| L | 24px | p-6 | Page sections |
| XL | 32px | p-8 | Hero sections |

**Common Patterns:**
- `gap-2` = 8px between items (flex/grid)
- `gap-3` = 12px between cards
- `gap-4` = 16px between sections
- `p-4` = 16px padding inside containers
- `mb-4` = 16px margin-bottom

### 3.4 Component Variants & States

#### Button Variants
```
PRIMARY (Default action)
├─ Default:  bg-fossee-blue text-white
├─ Hover:    bg-blue-900
├─ Active:   scale-95 (press effect)
├─ Focus:    ring-2 ring-offset-2 ring-fossee-blue
└─ Disabled: opacity-50 cursor-not-allowed

SECONDARY (Alternative action)
├─ Default:  border-2 border-fossee-blue text-fossee-blue bg-transparent
├─ Hover:    bg-fossee-light
└─ Focus:    ring-2 ring-fossee-blue

DANGER (Destructive action)
├─ Default:  bg-red-600 text-white
├─ Hover:    bg-red-700
└─ Active:   scale-95

GHOST (Minimal/tertiary)
├─ Default:  text-fossee-blue underline
├─ Hover:    no-underline
└─ Focus:    ring-2
```

All variants:
- Min height: 44px (WCAG tap target)
- Border radius: 11px (rounded-xl)
- Transition: all 150-200ms

#### Badge Variants
```
DEFAULT:
├─ bg-fossee-orange (fill color)
├─ text-white
├─ font-semibold
└─ rounded-full (px-2 py-1)

PENDING:  bg-amber-100 text-amber-800
ACCEPTED: bg-green-100 text-green-800
REJECTED: bg-red-100 text-red-800
```

#### Card States
```
STATIC:
├─ rounded-2xl
├─ shadow-sm
├─ bg-white
└─ p-4

CLICKABLE (hoverable):
├─ cursor-pointer
├─ hover:shadow-md
└─ transition-shadow (200ms)
```

#### Modal States
```
MOBILE (< 640px):
├─ Position: fixed inset-0
├─ Slide-in from bottom
├─ rounded-t-3xl (top only)
└─ Safe area inset (bottom)

DESKTOP (>= 640px):
├─ Centered in viewport
├─ max-w-sm (384px)
├─ rounded-2xl (all corners)
└─ Zoom-in fade animation
```

### 3.5 Responsive Breakpoints

**Tailwind Breakpoints:**
```
Mobile:  0-639px    (default, no prefix)
SM:      640-767px  (sm:)
MD:      768-1023px (md:)
LG:      1024-1280px(lg:)
XL:      1280px+    (xl:)
```

**Mobile-First Design Pattern:**
1. Set base styles for mobile (0-639px)
2. Override with `sm:`, `md:`, `lg:` as needed
3. **Example:**
   ```jsx
   {/* Mobile: scroll horizontally, then grid on md */}
   <div className="flex gap-3 overflow-x-auto pb-2 
                    md:grid md:grid-cols-3 md:gap-4 md:overflow-x-visible">
   ```

**Responsive Components:**
- **Navbar:** Desktop-only (hidden on mobile)
- **BottomNav:** Mobile-only (hidden on desktop)
- **Modal:** Sheets on mobile (bottom safe-area), centered on desktop
- **Grids:** 1-col mobile, 2-col SM, 3-col MD+

### 3.6 Border Radius & Shadows

**Border Radius:**
```
Buttons:      rounded-xl   (11px)
Cards:        rounded-2xl  (16px)
Inputs:       rounded-xl   (11px)
Modals:       rounded-t-3xl (mobile) / rounded-2xl (desktop)
```

**Shadows:**
```
shadow-sm:   0 1px 2px 0 rgba(0, 0, 0, 0.05)  /* Card default */
hover:shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)  /* Hover elevate */
Modal backdrop:  bg-black bg-opacity-50        /* Scrim */
```

### 3.7 Transitions & Animations

```css
transition-all 150ms ease-in-out   /* General UI changes */
transition-colors 200ms ease       /* Color/background changes */
transition-shadow 200ms ease       /* Hover effects */

/* Custom animations */
slide-in-from-bottom-4    /* Mobile modal enter */
fade-in                   /* Modal backdrop */
zoom-in-95                /* Desktop modal enter */
scale-95                  /* Active button press */
```

### 3.8 Micro-interactions

1. **Button Press:**
   - Click → `active:scale-95` (slight compress)
   - Feedback: immediate visual reduction

2. **Hover States:**
   - Buttons: color shade shift + opacity change
   - Cards: shadow elevation + cursor change
   - Links: underline remove/add

3. **Loading:**
   - Spinner animation (rotating + fade)
   - Button disabled state: opacity-50

4. **Toast Notifications:**
   - Auto-dismiss after 5s
   - Position: bottom-right, z-50
   - Slide-in animation

5. **Modal Dismiss:**
   - Escape key closes
   - Backdrop click closes
   - Close button (X) in top-right

---

## 4. DJANGO MODELS AND DATA STRUCTURES

### 4.1 Core Models

#### User (Django built-in)
```python
class User:
  id: int (PK)
  username: str (unique)
  email: str (unique)
  password: str (hashed)
  first_name: str
  last_name: str
  is_active: bool (default=True)
  is_staff: bool (default=False)
  date_joined: datetime
```

#### Profile (Extended User)
```python
class Profile(models.Model):
  user: ForeignKey(User, OneToOne)  # ← One profile per user
  
  # Personal Info
  title: str  # Choices: Prof, Dr, Mr, Mrs, Ms, etc.
  first_name: str (inherited from User)
  last_name: str (inherited from User)
  
  # Organization
  institute: str  # College/University name
  department: str  # Choices: CS, IT, Civil, Mech, etc. (18 options)
  phone_number: str  # Regex validation: 10 digits only
  location: str  # City/Place
  state: str  # Choices: States of India (36 options)
  
  # Role & Status
  position: str  # Choices: 'coordinator' | 'instructor' (required)
  is_email_verified: bool (default=False)
  activation_key: str (for email verification)
  key_expiry_time: datetime
  
  # Discovery
  how_did_you_hear_about_us: str  # Choices: FOSSEE website, Google, Social media, etc.

  Constraints:
    - phone_number: regex ^.{10}$ (10 digits)
    - position: default='coordinator'
    - state: default='IN-MH' (Maharashtra)
```

#### WorkshopType (Admin-created)
```python
class WorkshopType(models.Model):
  id: int (PK)
  name: str  # "Python Basics", "ISCP", etc.
  description: TextField  # Full description
  duration: int  # In days (>= 1, validated)
  terms_and_conditions: TextField  # Legal T&C
  
  Constraints:
    - duration >= 1 (MinValueValidator)
  
  __str__: f"{name} for {duration} day(s)"
```

#### Workshop (Main model)
```python
class Workshop(models.Model):
  id: int (PK)
  uid: UUID (unique, auto-generated)  # For sharing/external refs
  
  # Participants
  coordinator: ForeignKey(User)  # ← Who proposed the workshop
  instructor: ForeignKey(User, null=True)  # ← Who conducts it
  workshop_type: ForeignKey(WorkshopType)  # ← Type reference
  
  # Scheduling
  date: DateField  # Proposed/scheduled date
  
  # Status
  status: int  # Choices:
              # 0 = Pending (awaiting instructor review)
              # 1 = Accepted (instructor confirmed)
              # 2 = Deleted (rejected or cancelled)
              # (Previous: 0-1-2-3, now 0-1-2)
  
  # Legal
  tnc_accepted: bool  # Coordinator agreed to T&C
  
  __str__: f"{workshop_type} on {date} by {coordinator}"
  get_status(): str  # Returns human-readable status
```

#### Comment (Feedback/Discussion)
```python
class Comment(models.Model):
  id: int (PK)
  author: ForeignKey(User)  # ← Who commented
  workshop: ForeignKey(Workshop)  # ← On which workshop
  comment: TextField  # Comment text
  public: bool (default=True)  # Instructor feedback (private/public)
  created_date: datetime (default=timezone.now)
  
  __str__: f"Comment by {author.get_full_name()}"
```

#### AttachmentFile (Supporting docs)
```python
class AttachmentFile(models.Model):
  workshop_type: ForeignKey(WorkshopType)
  file: FileField  # Stored in workshops/{type_name}/ subdirectory
  created_date: datetime
```

### 4.2 Relationship Diagram

```
User ←─ One ─→ Profile (must have)
  ↓              ↓
  ├─ is admin    ├─ position: 'coordinator' | 'instructor'
  │              └─ institute, department, phone, state
  │
  ├─→ Workshop (many) ← as coordinator
  │   ├─ uid, date, status
  │   ├─→ WorkshopType
  │   ├─→ User (as instructor, nullable)
  │   └─→ Comment (many)
  │
  └─→ Comment (many as author)
```

### 4.3 Data Validation Rules

| Field | Type | Validation | UI Input |
|-------|------|-----------|----------|
| `username` | str | 1-150 chars, alphanumeric + @./+/- | email-like input |
| `email` | str | Valid email format (Django) | email input |
| `phone_number` | str | Exactly 10 digits (regex) | tel input (10 chars) |
| `title` | choice | 8 options (Prof, Dr, Mr, Mrs, etc.) | dropdown |
| `department` | choice | 18 IT options + variants | dropdown |
| `state` | choice | 36 Indian states + territories | dropdown |
| `position` | choice | 'coordinator' or 'instructor' | radio/toggle |
| `date` | date | Future date (>= today) | date picker |
| `status` | int | 0=Pending, 1=Accepted, 2=Deleted | read-only |
| `tnc_accepted` | bool | Must be True to submit | checkbox (required) |

---

## 5. USER PERSONAS AND ROLES

### 5.1 Student Coordinator (Workshop Proposer)

**Profile:**
- Role: 'coordinator' in Profile.position
- Primary Goal: Find instructors to conduct workshops at their college
- Frequency: Proposes 1-5 workshops per semester

**Workflow:**
1. Register with college details + T&C
2. Browse available workshop types
3. Propose workshop on specific date
4. Track proposal status (pending → accepted/rejected)
5. Reschedule if instructor requests
6. View profile, update contact info

**Pain Points:**
- Need clear status visibility (is proposal reviewed?)
- Want instructor feedback if rejected
- Need confirmation once accepted
- Mobile access for on-the-go updates

**Key Actions:**
- Browse workshops (`/workshop-types`)
- Submit proposal (`/propose`)
- View status (`/my-workshops`)
- Edit profile (`/profile`)

### 5.2 Instructor (Workshop Conductor)

**Profile:**
- Role: 'instructor' in Profile.position
- Primary Goal: Accept/reject workshop proposals, manage their calendar
- Frequency: Reviews 5-20 proposals per semester

**Workflow:**
1. Register with credentials
2. Login to dashboard
3. See pending proposals (inbox-style)
4. Review each proposal (dates, coordinator, T&C)
5. Accept or provide feedback/rejection
6. Manage accepted workshops

**Pain Points:**
- Need quick decision-making (compact cards)
- Want to see all details before committing
- May need to leave notes for future reference
- Need date/time clarity to avoid double-booking

**Key Actions:**
- View dashboard (`/instructor/dashboard`)
- Accept/reject proposals (modals)
- View proposal details (`/instructor/workshops/:id`)
- Add comments

### 5.3 Admin/Staff

**Profile:**
- Django admin access
- Can create WorkshopTypes + upload attachments
- Can manually edit workshops/profiles
- Can manage user activation

**Workflow:**
- Create workshop types in Django admin
- Monitor statistics
- Resolve disputes or errors

**Not Primary:** Admin workflows are backend (Django admin console)

### 5.4 Anonymous/Public User

**Profile:**
- No registration required
- Can view public data

**Actions:**
- Browse workshop types (`/workshop-types`)
- View public statistics (`/statistics`)
- Links to login/register

---

### 5.5 Accessibility Considerations (WCAG AA)

#### Visual Design
| Aspect | Implementation | Standard |
|--------|----------------|----------|
| **Color Contrast** | FOSSEE-blue (#003865) on white (4.5:1+), orange badges on white (7:1+) | WCAG AA 4.5:1 minimum |
| **Font Size** | Base 14px (body), 16px (headings), 18px+ (form labels) | Readable at arm's length |
| **Font Weight** | 400 (regular) for body, 600 (semibold) for emphasis | Clear hierarchy |
| **Color Alone** | Status badges use color + text label ("PENDING", "ACCEPTED") | Not color-dependent |

#### Keyboard Navigation
| Interaction | Implementation |
|-------------|-----------------|
| Tab order | Linear through form fields (Login → Register) |
| Focus Visible | Ring focus (ring-2 ring-fossee-blue) on all buttons |
| Escape Key | Closes modals, clears dialogs |
| Skip Links | Navbar "Skip to content" (implicit via React Router) |

#### Screen Reader Support
| Element | ARIA Attributes |
|---------|-----------------|
| Buttons | `aria-label` for icon-only buttons |
| Forms | `<label htmlFor>` paired with input `id` |
| Modals | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"` |
| Navigation | `role="navigation"`, `aria-label="Main navigation"` |
| Status Badges | Alt text in label (e.g., "PENDING (awaiting review)") |
| Icons | `aria-hidden="true"` on decorative icons |

#### Touch Target Size
| Element | Min Height | Min Width |
|---------|-----------|-----------|
| Buttons | 44px | 44px |
| Input fields | 52px | full width |
| Links | 44px | 44px |
| Tab bar (mobile) | 56px | 56px |

#### Mobile Safety
| Viewport | Adjustment |
|----------|------------|
| Safe area inset | `safe-area-inset-bottom` on modals (iPhone notch/home) |
| Viewport zoom | `viewport-fit=cover` in HTML meta |
| Touch-friendly | Buttons min 44×44px, no hover-only affordances |

---

## 6. API ENDPOINTS AND DATA FLOW

### 6.1 Authentication Endpoints

#### POST `/api/auth/login/`
```
Request:
{
  "username": "string (email or username)",
  "password": "string"
}

Response (Success 200):
{
  "id": 1,
  "username": "student@example.com",
  "email": "student@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "profile": {
    "position": "coordinator",
    "institute": "IIT Bombay",
    "department": "computer engineering",
    "phone_number": "9876543210",
    "title": "Mr",
    "location": "Mumbai",
    "state": "IN-MH",
    "is_email_verified": true
  }
}

Response (Error 401):
{
  "error": "Invalid username or password."
}

Response (Error 403):
{
  "error": "Please verify your email before logging in."
}
```

#### POST `/api/auth/register/`
```
Request:
{
  "username": "string (email)",
  "email": "string",
  "password": "string (min 8)",
  "password2": "string (confirm)",
  "first_name": "string",
  "last_name": "string",
  "title": "string (choice)",
  "institute": "string",
  "department": "string (choice)",
  "phone_number": "string (10 digits)",
  "location": "string",
  "state": "string (choice)",
  "position": "string ('coordinator' | 'instructor')"
}

Response (Success 201):
{
  "id": 2,
  "username": "..." ,
  "email": "...",
  "first_name": "...",
  "last_name": "...",
  "profile": {...},
  "message": "User registered successfully. Please verify your email."
}

Response (Error 400):
{
  "field_name": ["Error message", ...]
}
```

#### POST `/api/auth/logout/`
```
Request: (authenticated session)

Response (Success 200):
{
  "detail": "Logged out successfully."
}
```

#### GET `/api/auth/me/`
```
Request: (authenticated session)

Response (Success 200):
{
  "id": 1,
  "username": "...",
  "email": "...",
  "first_name": "...",
  "last_name": "...",
  "profile": {...}
}

Response (Error 401):
{
  "detail": "Authentication credentials were not provided."
}
```

#### GET `/api/auth/activate/:key/`
```
Request: (activation key from email)

Response (Success 200):
{
  "detail": "Email verified successfully."
}

Response (Error 400):
{
  "detail": "Invalid or expired activation key."
}
```

### 6.2 Workshop Endpoints

#### GET `/api/workshops/`
```
Query Params:
  - page: int (default=1, paginated by 12)
  - page_size: int (max=50)

Response (Success 200):
{
  "count": 25,
  "next": "http://api/workshops/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "uid": "uuid-string",
      "workshop_type": {
        "id": 1,
        "name": "Python Basics",
        "description": "...",
        "duration": 3
      },
      "coordinator": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe"
      },
      "instructor": {
        "id": 2,
        "first_name": "Jane",
        "last_name": "Smith"
      } or null,
      "date": "2026-04-15",
      "status": 0,
      "tnc_accepted": true,
      "comments": [...]  // only in detail view
    },
    ...
  ]
}
```

#### POST `/api/workshops/`
```
Request (CSRF cookie required):
{
  "workshop_type": 1,
  "date": "2026-04-20",
  "tnc_accepted": true
}

Response (Success 201):
{
  "id": 2,
  "uid": "uuid-string",
  "workshop_type": {...},
  "coordinator": {...},
  "instructor": null,
  "date": "2026-04-20",
  "status": 0,
  "tnc_accepted": true
}

Response (Error 400):
{
  "date": ["Date must be in the future"],
  "tnc_accepted": ["Must accept terms and conditions"]
}
```

#### GET `/api/workshops/:id/`
```
Response (Success 200):
{
  "id": 1,
  "uid": "...",
  "workshop_type": {...},
  "coordinator": {...},
  "instructor": {...} or null,
  "date": "2026-04-15",
  "status": 0,
  "tnc_accepted": true,
  "comments": [
    {
      "id": 1,
      "author": {"id": 2, "first_name": "Jane"},
      "comment": "Great proposal!",
      "public": true,
      "created_date": "2026-04-10T10:00:00Z"
    }
  ]
}
```

#### POST `/api/workshops/:id/accept/`
```
Request (Instructor only, CSRF):
{} (empty)

Response (Success 200):
{
  "status": 1,
  "instructor": {...},
  "message": "Workshop accepted."
}
```

#### POST `/api/workshops/:id/reject/`
```
Request (Instructor only, CSRF):
{
  "comment": "string (optional feedback)"
}

Response (Success 200):
{
  "status": 2,
  "message": "Workshop rejected."
}
```

#### PUT `/api/workshops/:id/change-date/`
```
Request (Coordinator only, CSRF):
{
  "date": "2026-05-01"
}

Response (Success 200):
{
  "id": 1,
  "date": "2026-05-01",
  "message": "Date updated."
}

Response (Error 400):
{
  "detail": "Can only change date for pending workshops."
}
```

#### POST `/api/workshops/:id/comments/`
```
Request (Authenticated, CSRF):
{
  "comment": "string",
  "public": boolean (default=true)
}

Response (Success 201):
{
  "id": 2,
  "author": {...},
  "comment": "...",
  "public": true,
  "created_date": "2026-04-10T11:00:00Z"
}
```

### 6.3 Workshop Type Endpoints

#### GET `/api/workshop-types/`
```
Response (Success 200):
{
  "results": [
    {
      "id": 1,
      "name": "Python Basics",
      "description": "2-day introductory Python workshop...",
      "duration": 2,
      "terms_and_conditions": "By registering, you agree to..."
    },
    ...
  ]
}
```

#### GET `/api/workshop-types/:id/`
```
Response (Success 200):
{
  "id": 1,
  "name": "Python Basics",
  "description": "...",
  "duration": 2,
  "terms_and_conditions": "...",
  "attachments": [
    {
      "id": 1,
      "file": "url/to/syllabus.pdf"
    }
  ]
}
```

### 6.4 Profile Endpoints

#### GET `/api/profile/`
```
Request: (authenticated)

Response (Success 200):
{
  "id": 1,
  "user": {
    "id": 1,
    "username": "student@example.com",
    "email": "student@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "title": "Mr",
  "institute": "IIT Bombay",
  "department": "computer engineering",
  "phone_number": "9876543210",
  "position": "coordinator",
  "location": "Mumbai",
  "state": "IN-MH",
  "how_did_you_hear_about_us": "Google",
  "is_email_verified": true
}
```

#### PUT `/api/profile/`
```
Request (authenticated, CSRF):
{
  "first_name": "John",
  "last_name": "Smith",
  "title": "Dr",
  "institute": "IIT Bombay",
  "department": "information technology",
  "phone_number": "9876543210",
  "position": "instructor",
  "location": "Mumbai",
  "state": "IN-MH"
}

Response (Success 200):
{
  "id": 1,
  "user": {...},
  "title": "Dr",
  "institute": "IIT Bombay",
  "department": "information technology",
  ...
}
```

#### GET `/api/profile/:user_id/`
```
Request: (public profile)

Response (Success 200):
{
  "user": {
    "first_name": "John",
    "last_name": "Doe"
  },
  "institute": "IIT Bombay",
  "department": "computer engineering",
  "position": "coordinator",
  "location": "Mumbai"
}
```

### 6.5 Statistics Endpoints

#### GET `/api/stats/public/`
```
Query Params:
  - department: str (filter)
  - workshop_type: int (filter)
  - date_from: date (filter)
  - date_to: date (filter)

Response (Success 200):
{
  "total_workshops": 145,
  "total_participations": 3200,
  "by_department": [
    {"department": "computer engineering", "count": 45},
    {"department": "electrical engineering", "count": 35},
    ...
  ],
  "by_workshop_type": [
    {"workshop_type": "Python Basics", "count": 50},
    ...
  ]
}
```

#### GET `/api/stats/team/`
```
Request: (authenticated)

Response (Success 200):
{
  "user_id": 1,
  "my_proposals_total": 15,
  "my_proposals_accepted": 12,
  "my_proposals_pending": 2,
  "my_proposals_rejected": 1
}
```

---

### 6.6 HTTP Methods Summary

| Method | Purpose | Authentication | CSRF |
|--------|---------|-----------------|------|
| GET | Retrieve data | Required (mostly) | No |
| POST | Create new data / actions | Required (mostly) | Yes |
| PUT | Update full resource | Required | Yes |
| PATCH | Partial update | Required | Yes |
| DELETE | Remove resource | Required | Yes |

### 6.7 Error Responses

| Status | Meaning | Example |
|--------|---------|---------|
| 200 OK | Success | GET request returns data |
| 201 Created | Resource created | POST workshop returns new ID |
| 400 Bad Request | Client error (validation) | Invalid date format |
| 401 Unauthorized | Auth required | Not logged in |
| 403 Forbidden | Permission denied | Instructor accessing coordinator-only endpoint |
| 404 Not Found | Resource doesn't exist | Workshop ID doesn't exist |
| 500 Server Error | Backend issue | Database error |

### 6.8 Client Request Flow (with CSRF)

```
1. App Loads
   ↓
   GET /api/auth/me/ (check if logged in)
   ← Response: User data or 401

2. User Logs In
   ↓
   POST /api/auth/login/
   ← Response: Set-Cookie: csrftoken & sessionid
   ← User data stored in AuthContext

3. User Creates Workshop
   ↓
   [Extract csrftoken from cookies]
   ↓
   POST /api/workshops/ {
     "X-CSRFToken": "csrftoken-value",
     "workshop_type": 1,
     "date": "2026-04-20",
     "tnc_accepted": true
   }
   ← Response: Workshop created (201)

4. User Logs Out
   ↓
   POST /api/auth/logout/
   ← Response: Cookies cleared
```

---

## 7. DESIGN TOKENS & COMPONENT REFERENCE

### 7.1 Design Token Hierarchy

```
BRAND COLORS
├─ Primary:    #003865 (fossil-blue)
├─ Secondary:  #F7941D (fossee-orange)
└─ Accent:     #EEF4FB (fossee-light)

SEMANTIC COLORS
├─ Success:    #16A34A (green-600)
├─ Warning:    #D97706 (amber-600)
├─ Danger:     #DC2626 (red-600)
└─ Info:       #003865 (fossil-blue)

TYPOGRAPHY
├─ Font Family: Inter
├─ Line Height: 1.5 (body), 1.2 (headings)
└─ Letter Spacing: -0.02em (headings), 0 (body)

SPACING
├─ Base unit:   4px
├─ Common:      p-2 (8px), p-4 (16px), p-6 (24px)
└─ Gap:         gap-2 (8px), gap-3 (12px), gap-4 (16px)

SHADOWS
├─ sm:         0 1px 2px rgba(0,0,0,.05)
├─ md:         0 4px 6px rgba(0,0,0,.1)
└─ lg:         0 10px 15px rgba(0,0,0,.1)

BORDER RADIUS
├─ sm:         4px
├─ md:         11px (rounded-xl)
└─ lg:         16px (rounded-2xl)

TRANSITIONS
├─ Fast:       150ms
├─ Standard:   200ms
└─ Slow:       300ms
```

### 7.2 Key Component Specifications

#### Button (All Variants)
- Height: 44px minimum
- Padding: px-4 py-2 (internal)
- Border Radius: 11px
- Font: 14/16px, 600 weight
- Focus: ring-2 ring-offset-2 ring-fossee-blue
- Disabled: opacity-50

#### Input Fields
- Height: 52px
- Padding: px-4
- Border: 2px
- Border Radius: 11px
- Focus: border-fossee-blue outline-none
- Font: 14px, 400 weight

#### Modal
- Mobile: full-screen, bottom sheet, rounded-t-3xl
- Desktop: max-w-sm (384px), centered, rounded-2xl
- Backdrop: bg-black bg-opacity-50
- Escape closes, focus trap

#### Card
- Padding: p-4 (16px)
- Border Radius: 16px (rounded-2xl)
- Shadow: shadow-sm (default), shadow-md (hover)
- Background: white

---

## 8. SUMMARY MATRIX

| Aspect | Details |
|--------|---------|
| **Pages** | 12 total: 3 auth + 3 coordinator + 2 instructor + 3 shared + 1 error |
| **Components** | 15 reusable: 3 layout + 7 UI + 3 workshop + 2 route-specific |
| **Routes** | 10 protected + 2 public + root redirect |
| **Models** | 6: User, Profile, Workshop, WorkshopType, Comment, AttachmentFile |
| **API Endpoints** | 20+: auth (5), workshops (6), types (2), profile (3), stats (2+) |
| **Authentication** | Django session (not JWT) |
| **State Management** | Context API + Custom Hooks (no Redux) |
| **Styling** | Tailwind CSS 3.4.19 (utility-first) |
| **Brand Colors** | 4: blue (#003865), orange (#F7941D), light (#EEF4FB), secondary (#C06A00) |
| **Typography** | Inter font, 5 sizes (12-32px), 2 weights (400/600) |
| **Spacing** | 4px base unit (Tailwind) |
| **Button Variants** | 4: primary, secondary, danger, ghost |
| **Responsive Breakpoints** | 5: base (<640px), sm (640px), md (768px), lg (1024px), xl (1280px+) |
| **Accessibility** | WCAG AA: 4.5:1 contrast, 44px tap targets, keyboard nav, ARIA labels |
| **Performance** | 115 KB gzipped (~56 KB React), 7 code chunks, lazy loading all pages |
| **Mobile UX** | Bottom tab nav, responsive grids, safe-area insets, touch-friendly |

---

## 9. USER FLOW DIAGRAMS

### Authentication Flow
```
┌─────────────────┐
│   Landing (/)   │
└────────┬────────┘
         │
    ┌────v────┐
    │ Logged? │
    └────┬────┘
         ├─NO──→ /login (LoginPage)
         │         ├─ Username/password
         │         ├─ POST /api/auth/login/
         │         └─ Redirect based on role
         │
         └─YES──→ AuthContext { user, role }
                    ├─ role='coordinator' → /dashboard
                    └─ role='instructor' → /instructor/dashboard
```

### Coordinator Proposal Flow
```
/dashboard
    ↓
[Stats Cards] ← GET /api/workshops/
    ↓
[Propose CTA] → navigate('/propose')
    ↓
ProposeWorkshopPage
    ├─ GET /api/workshop-types/
    ├─ Select type
    ├─ Pick date (> today, validated)
    ├─ Agree T&C (checkbox)
    └─ Submit
        ↓
    POST /api/workshops/ {type, date, tnc_accepted}
        ↓
    Toast "Proposal sent!"
        ↓
    Redirect → /my-workshops
        ↓
    [Status page shows new proposal as PENDING]
        ↓
    Monitor for instructor response
        ├─ Accept → Status changes to ACCEPTED
        └─ Reject → Status changes to REJECTED + comments visible
```

### Instructor Review Flow
```
/instructor/dashboard
    ↓
GET /api/workshops/ (filter: status=pending)
    ↓
[Display Pending + Accepted workshops]
    ├─ PENDING section (actionable)
    └─ ACCEPTED section (archive)
    ↓
[Click workshop card] → /instructor/workshops/:id
    ├─ GET /api/workshops/:id/
    ├─ Show all details
    └─ Display comments
    ↓
[Accept Modal]
    ├─ Confirm details
    ├─ Optional add comment
    └─ POST /api/workshops/:id/accept/
    ↓
Status updates → Toast "Accepted!"
                → Return to dashboard
                → Card now in ACCEPTED section
    
[Or Reject Modal]
    ├─ Reason dropdown
    ├─ Feedback text
    └─ POST /api/workshops/:id/reject/
```

---

## 10. DESIGN SYSTEM DELIVERABLES CHECKLIST

- ✅ Color palette (4 brand colors + semantic colors)
- ✅ Typography system (Inter, 5 sizes, 2 weights)
- ✅ Spacing system (4px base unit)
- ✅ Component variants (button: 4 types, all states)
- ✅ Responsive breakpoints (5 sizes)
- ✅ Accessibility (WCAG AA contrast, 44px targets, ARIA labels)
- ✅ Shadows & elevation system
- ✅ Border radius guidelines
- ✅ Micro-interactions (hover, focus, active, disabled)
- ✅ Mobile-first patterns
- ✅ Form input patterns
- ✅ Modal / dialog patterns
- ✅ Navigation patterns (top nav + bottom nav)
- ✅ Loading states
- ✅ Error & success states
- ✅ Empty states

---

## 11. DEVELOPMENT RECOMMENDATIONS

### For UI/UX Designers
1. **Create a Figma library** using these design tokens
2. **Document component variants** for each state (default, hover, active, disabled, focus)
3. **Create mobile + desktop screens** showing responsive behavior
4. **Design flows** for key user journeys (propose → review → accept)
5. **Accessibility audit** using WAVE or axe DevTools

### For Developers
1. **Tailwind config** already set up with brand colors
2. **Component prop documentation** exists in JSDoc comments
3. **Use existing hooks** (useAuth, useWorkshops, useStats) for data
4. **Follow the established patterns** for new components
5. **Test responsive** on actual devices (44px tap targets matter)

### For QA/Testing
1. **Test on mobile** (iPhone SE, Galaxy A51)
2. **Test on tablet** (iPad, Galaxy Tab)
3. **Keyboard navigation** (Tab, Enter, Escape)
4. **Screen reader** (NVDA on Windows, VoiceOver on Mac)
5. **Form validation** (empty fields, invalid data types)
6. **API error paths** (401, 400, 500 responses)

---

**End of Analysis Document**
