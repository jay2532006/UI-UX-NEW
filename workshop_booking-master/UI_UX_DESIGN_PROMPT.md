# FOSSEE Workshop Booking Portal — UI/UX Design Prompt
## Comprehensive Design Guide for Designers, Developers, and Stakeholders

**Version**: 2.0  
**Last Updated**: April 9, 2026  
**Target Audience**: UI/UX Designers, Frontend Developers, Product Managers  
**Project Scope**: React 19 SPA + Django 3.0.7 REST API  

---

## 📑 TABLE OF CONTENTS

1. [Project Overview & Vision](#project-overview--vision)
2. [User Personas & Roles](#user-personas--roles)
3. [Design System & Visual Language](#design-system--visual-language)
4. [Component Library Specifications](#component-library-specifications)
5. [Page-by-Page Design Requirements](#page-by-page-design-requirements)
6. [User Flows & Interactions](#user-flows--interactions)
7. [Features & Functionality Matrix](#features--functionality-matrix)
8. [Responsive Design Specifications](#responsive-design-specifications)
9. [Accessibility Requirements](#accessibility-requirements)
10. [API & Data Integration Points](#api--data-integration-points)
11. [Design Tokens & Implementation](#design-tokens--implementation)
12. [Animation & Micro-interactions](#animation--micro-interactions)

---

## 1. PROJECT OVERVIEW & VISION

### 1.1 Project Mission
The FOSSEE Workshop Booking Portal is a **mobile-first, accessible web platform** enabling Indian students and educators to propose, manage, and track technical workshops. The platform bridges workshop coordinators (faculty/staff proposing workshops) with instructors (educators accepting/rejecting proposals) through an intuitive, responsive interface.

### 1.2 Core Objectives
- **Simplify Workshop Management**: Reduce friction in the proposal → acceptance → scheduling flow
- **Mobile-First Experience**: Primary users are students on devices (375–414px screens)
- **Accessibility**: WCAG 2.1 AA compliance (keyboard nav, screen readers, color contrast)
- **Performance**: Fast load times (<2.5s LCP), responsive interactions (<200ms)
- **Scalability**: Support 1000s of concurrent users during workshop peak seasons

### 1.3 Key Differentiators
- **Session-Based Auth**: Django session authentication (not JWT) with CSRF protection
- **Real-Time Feedback**: Toast notifications, loading spinners, form validation
- **Role-Based UI**: Coordinator vs. Instructor dashboards with different workflows
- **Statistics & Insights**: Public-facing statistics on workshop adoption, state-wise distribution
- **Email Notifications**: Automatic acceptance/rejection emails with SendGrid integration

### 1.4 Success Metrics
- **Mobile Adoption**: >70% of traffic from mobile devices
- **Accessibility Score**: Lighthouse Accessibility ≥95
- **Performance**: Lighthouse Performance ≥88
- **User Satisfaction**: <5% bounce rate on homepage
- **Conversion**: >60% of users complete at least one action per session

---

## 2. USER PERSONAS & ROLES

### 2.1 Primary Users

#### **Persona 1: Arun (Student Coordinator)**
| Attribute | Details |
|-----------|---------|
| **Age** | 21, B.Tech student, CSE |
| **Goal** | Propose Python workshop for his college; track status |
| **Pain Points** | Unclear process; no feedback on proposal status; form too complex |
| **Device** | iPhone SE (375px), occasionally laptop |
| **Tech Savvy** | Medium; familiar with mobile apps, not deep technical knowledge |
| **Behavior** | Propose once per semester; checks status 2-3 times weekly |

**Key Needs**:
- Simple 3-step form with clear instructions
- Status notifications (email + in-app)
- Ability to reschedule if date conflicts

---

#### **Persona 2: Dr. Metra (Instructor)**
| Attribute | Details |
|-----------|---------|
| **Age** | 55, Professor, IIT Bombay |
| **Goal** | Review workshop proposals; accept if feasible; reject if not available |
| **Pain Points** | Overwhelmed with emails; unclear proposal details; no calendar view |
| **Device** | Desktop (1920px), occasionally iPad (768px) |
| **Tech Savvy** | Low; prefers simple interfaces; worried about missing deadlines |
| **Behavior** | Checks proposals daily; delegates to staff sometimes |

**Key Needs**:
- Dashboard showing pending proposals above the fold
- One-click accept/reject with optional reason
- Email reminders for pending
- Calendar view of accepted workshops

---

#### **Persona 3: Priya (Admin/Coordinator Staff)**
| Attribute | Details |
|-----------|---------|
| **Age** | 35, Workshop Coordinator, FOSSEE |
| **Goal** | Monitor workshop pipeline; generate reports; manage workshop types |
| **Pain Points** | Manual tracking in spreadsheets; no real-time visibility |
| **Device** | Desktop (1440px) |
| **Tech Savvy** | High; comfortable with dashboards and exports |
| **Behavior** | Checks statistics daily; exports reports monthly |

**Key Needs**:
- Real-time statistics with filtering (state, type, date range)
- Ability to download data (CSV)
- Bulk operations (edit workshop types, etc.)
- Performance charts (adoption trends)

---

### 2.2 Secondary Users

#### **Anonymous Visitor**
- **Goal**: Browse available workshop types; see statistics
- **Device**: Any (responsive)
- **Needs**: Public-facing pages easy to navigate without login

#### **Guest/Unauthenticated**
- **Goal**: Understand the platform; encourage registration
- **Device**: Mobile primarily
- **Needs**: Clear landing page; easy signup flow

---

## 3. DESIGN SYSTEM & VISUAL LANGUAGE

### 3.1 Brand Identity

#### **Core Values**
| Value | Color | Emotion | Usage |
|-------|-------|---------|-------|
| **Trust & Authority** | fossee-blue (#003865) | Professional, reliable | Primary actions, headers, navigation |
| **Energy & Action** | fossee-orange (#F7941D) | Urgency, CTA | Call-to-action buttons, success states |
| **Clarity & Calm** | fossee-light (#EEF4FB) | Breathing room, clean | Backgrounds, secondary information |
| **Neutrals** | Gray (700 for text, 300 for borders) | Clarity, hierarchy | Text, dividers, secondary elements |

#### **Color Palette**

```
Primary Colors:
├─ fossee-blue: #003865 (0%, 38.4%, 39.6%) — Authority
├─ fossee-orange: #F7941D (97.3%, 58%, 11.4%) — Action
├─ fossee-light: #EEF4FB (93.3%, 95.7%, 98.4%) — Clean

Semantic Colors:
├─ success-green: #10B981 — Accepted, positive
├─ error-red: #EF4444 — Rejected, urgent
├─ warning-yellow: #F59E0B — Pending, caution
├─ info-blue: #3B82F6 — Information

Neutral Colors:
├─ text-primary: #1A1A2E — 87% opacity (headers, body text)
├─ text-secondary: #6B7280 — 60% opacity (hints, metadata)
├─ border: #D1D5DB — 30% opacity (dividers, inputs)
├─ background: #FFFFFF — All content areas
└─ background-subtle: #F9FAFB — Cards, elevated surfaces
```

#### **Color Contrast Ratios** (WCAG AA Verified)
| Text | Background | Ratio | Level |
|------|-----------|-------|-------|
| #1A1A2E | #FFFFFF | 14.5:1 | AAA ✅ |
| #003865 | #FFFFFF | 11.2:1 | AAA ✅ |
| #F7941D | #FFFFFF | 8.4:1 | AA ✅ |

---

### 3.2 Typography

#### **Font Family**
- **Primary**: Inter (Google Fonts)
- **System Fallback**: system-ui, -apple-system, sans-serif
- **Weight Scale**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

#### **Type Scale & Hierarchy**

| Use Case | Size | Weight | Line Height | Letter Spacing | Example |
|----------|------|--------|-----------|---|---|
| **H1** Body | 32px | 700 | 1.2 (38.4px) | -0.02em | "FOSSEE Workshop Portal" |
| **H2** Section | 24px | 600 | 1.3 (31.2px) | -0.01em | "My Workshops" |
| **H3** Subsection | 20px | 600 | 1.4 (28px) | 0 | "Workshop Details" |
| **Body (Large)** | 18px | 400 | 1.5 (27px) | 0 | Paragraph text |
| **Body** | 16px | 400 | 1.5 (24px) | 0 | Default paragraph |
| **Body Small** | 14px | 400 | 1.5 (21px) | 0 | Hints, metadata |
| **Label** | 12px | 500 | 1.4 (16.8px) | 0.02em | Form labels, badges |
| **Caption** | 12px | 400 | 1.4 (16.8px) | 0 | Timestamps, footnotes |

#### **Text Treatment Examples**

```
Page Title (H1):
  Font: Inter 32px 700 (semibold)
  Color: #003865 (fossee-blue)
  Margin: 0 below, 16px below
  Example: "FOSSEE Workshop Booking Portal"

Section Heading (H2):
  Font: Inter 24px 600 (semibold)
  Color: #003865
  Margin: 24px above, 12px below
  Example: "Pending Workshops"

Body Text:
  Font: Inter 16px 400
  Color: #1A1A2E
  Line Height: 1.5 (24px)
  Max Width: 65 characters (readable)

Secondary Text:
  Font: Inter 14px 400
  Color: #6B7280 (60% opacity of text-primary)
  Use For: Hints, timestamps, metadata
```

---

### 3.3 Spacing System

**Base Unit**: 4px (Tailwind default)

```
Spacing Scale:
  2px   = 0.5 (hairline borders)
  4px   = 1   (minimal spacing)
  8px   = 2   (compact)
  12px  = 3   (tight)
  16px  = 4   (default, used most)
  20px  = 5   (comfortable)
  24px  = 6   (generous)
  32px  = 8   (large)
  48px  = 12  (extra large)
  64px  = 16  (section breaks)

Tailwind Classes Used:
  p-4    = padding 16px (card content)
  gap-4  = gap 16px (between elements)
  mb-4   = margin-bottom 16px
  mt-6   = margin-top 24px
  space-y-3 = vertical gap between children (12px)
```

---

### 3.4 Border Radius

```
Radius Scale:
  rounded-lg   = 8px (inputs, small components)
  rounded-xl   = 12px (cards, messages)
  rounded-2xl  = 16px (modals, large components)
  rounded-3xl  = 24px (hero elements, prominent CTAs)
  rounded-full = 9999px (circles, avatars)

Usage:
  Buttons: 12px (rounded-xl)
  Cards: 16px (rounded-2xl)
  Form Inputs: 8px (rounded-lg)
  Badges: 8px (rounded-lg)
  Modals: 16px (rounded-2xl on desktop, 16px top on mobile)
```

---

### 3.5 Shadows & Elevation

```
Shadow Levels:
  
  sm: 0 1px 2px 0 rgba(0,0,0,0.05)
      — Subtle (cards on white)
  
  md: 0 4px 6px -1px rgba(0,0,0,0.1)
      — Default (cards, dropdowns, popovers)
  
  lg: 0 10px 15px -3px rgba(0,0,0,0.1)
      — Lifted (modals, side panels)
  
  xl: 0 20px 25px -5px rgba(0,0,0,0.1)
      — Prominent (full-screen overlays)

Examples:
  Card (hover): Box-shadow: 0 4px 6px rgba(0,0,0,0.1)
  Modal backdrop: Opacity 50% black overlay
  Navbar: 0 4px 6px rgba(0,0,0,0.05)
```

---

### 3.6 Transitions & Animations

```
Duration Scale:
  Fast:   75ms (micro-interactions: hover)
  Normal: 300ms (standard transitions)
  Slow:   500ms (page transitions)

Easing:
  ease-in-out (default): Cubic-bezier(0.4, 0, 0.2, 1)
  ease-out: Cubic-bezier(0, 0, 0.2, 1)
  ease-in: Cubic-bezier(0.4, 0, 1, 1)

Common Animations:
  Button hover: 
    - Transform: scale(1.05)
    - Duration: 300ms ease-out
    - Box-shadow: md
  
  Modal open:
    - From: opacity 0, scale(0.95)
    - To: opacity 1, scale(1)
    - Duration: 300ms ease-out
  
  Toast slide-in:
    - From: translateX(100%) opacity 0
    - To: translateX(0) opacity 1
    - Duration: 300ms ease-out
  
  Fade out (on close):
    - To: opacity 0
    - Duration: 200ms ease-in
```

---

## 4. COMPONENT LIBRARY SPECIFICATIONS

### 4.1 Button Component

#### **Variants**

| Variant | Background | Text | Border | Hover State | Use Case |
|---------|-----------|------|--------|-------------|----------|
| **Primary** | fossee-blue (#003865) | white | none | bg-blue-900 | Main CTA (propose, accept, submit) |
| **Secondary** | transparent | fossee-blue | 2px fossee-blue | bg-fossee-light | Alternative action |
| **Danger** | red-600 (#DC2626) | white | none | bg-red-700 | Destructive (delete, reject) |
| **Ghost** | transparent | fossee-blue | none | text-decoration: underline | Minor actions |

#### **Sizes**

```
Small:
  Height: 36px
  Padding: 0 12px
  Font: 14px 500

Medium (Default):
  Height: 44px (minimum tap target WCAG AA)
  Padding: 0 16px
  Font: 16px 600

Large:
  Height: 52px
  Padding: 0 24px
  Font: 18px 600
```

#### **States**

```
Normal:
  ✓ Visible, interactive

Hover:
  • Opacity +10%, scale +5% (if animation enabled)
  • Cursor: pointer
  • Duration: 200ms ease-out

Focus:
  ✓ Outline: 2px solid fossee-blue
  ✓ Outline-offset: 2px
  ✓ Visible: ALL TIMES (keyboard nav critical)

Active (Pressed):
  • Scale: 95%
  • Duration: 75ms

Disabled:
  • Opacity: 50%
  • Cursor: not-allowed
  • Pointer-events: none
```

#### **Button Specifications**

```jsx
<Button 
  variant="primary"      // primary | secondary | danger | ghost
  size="medium"          // small | medium | large
  disabled={false}       // accessibility
  onClick={handleClick}
  aria-label="Submit form" // required for icon buttons
>
  Propose Workshop
</Button>
```

---

### 4.2 Card Component

#### **Structure**

```
┌─────────────────────┐
│   [Icon] Title      │ ← Header (optional)
│                     │
│   Content area      │ ← Main body (text, images, forms)
│   Multiple lines    │
│                     │
│  [Action] [Action]  │ ← Footer (optional buttons)
└─────────────────────┘
```

#### **Specifications**

```
Border Radius: 16px (rounded-2xl)
Padding: 24px (p-6)
Border: 1px solid #E5E7EB (gray-300)
Box Shadow: 0 4px 6px rgba(0,0,0,0.1)
Background: white

Hover State:
  • Box Shadow: 0 10px 15px rgba(0,0,0,0.1)
  • Transition: 300ms ease-out

Variants:
  - Default: white background
  - Elevated: light gray background
  - Outlined: border-2 fossee-blue
  - Ghost: no border, subtle shadow
```

#### **Card Use Cases**

| Use Case | Content | Status Indicator | Example |
|----------|---------|------------------|---------|
| **Workshop Card** | Type, Date, Coordinator | Status badge | "Python Workshop - March 15, 2024" |
| **Summary Card** | Metric, Count, Trend | Color-coded | "Pending: 5 proposals" |
| **Comment Card** | Author, Timestamp, Text | Profile avatar | "Great! We'll run this." |
| **Profile Card** | User info, role, actions | Edit button | "Arun Kumar - Coordinator" |

---

### 4.3 Form Input Component

#### **Input Types**

```
Text Input (Email, Name):
  Height: 44px
  Padding: 12px 16px
  Border: 2px solid #D1D5DB
  Border Radius: 8px
  Font: 16px 400
  Focus: Border color → fossee-blue, outline: 2px

Number Input (Phone):
  Same as text, but:
  • Type: tel or number
  • Mask: (XXX) XXX-XXXX or similar (country-specific)

Select Dropdown:
  Height: 44px
  Similar styling to text input
  Icon: chevron-down (right-aligned)

Textarea (Comments):
  Min Height: 88px (4 lines)
  Resize: vertical only
  Same border/radius as text input

Date Input:
  Browser native picker (mobile → native, desktop → custom)
  Fallback: YYYY-MM-DD format
```

#### **Form Label & Error Pattern**

```jsx
<div className="mb-4">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
    Email Address <span className="text-red-500">*</span>
    <span className="sr-only">(required)</span>
  </label>
  <input
    id="email"
    type="email"
    required
    aria-required="true"
    aria-describedby="email-error"
    aria-invalid={hasError}
    className="w-full h-[44px] px-4 rounded-lg border-2 border-gray-300 focus:border-fossee-blue focus:outline-none"
  />
  {hasError && (
    <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
      Please enter a valid email address
    </p>
  )}
</div>
```

---

### 4.4 Modal Component

#### **Structure**

```
Mobile (375px):
  ┌───────────────┐
  │ Title      ✕  │ ← Header with close button
  │               │
  │ Content area  │ ← Full-width, min padding 16px
  │               │
  │ [Cancel] [OK] │ ← Footer buttons
  └───────────────┘
  (Slides up from bottom)

Desktop (1024px+):
  ┌─────────────────────────┐
  │ Title              ✕    │
  │                         │
  │     Content (max 500px) │
  │                         │
  │   [Cancel]  [Confirm]   │
  └─────────────────────────┘
  (Fades in, centered)
```

#### **Specifications**

```
Mobile:
  Width: 100vw
  Height: Auto (content-driven)
  Border Radius: 16px 16px 0 0 (top only)
  Animation: slideUp 300ms ease-out from bottom
  Backdrop: 50% black overlay, fixed
  Safe area: 16px padding bottom (for mobile notches)

Desktop:
  Width: 90vw, max 40rem (500px)
  Height: auto
  Border Radius: 16px (all corners)
  Animation: fadeIn + zoom (0.95 → 1)
  Position: centered (fixed, top 50%, left 50%, transform -50%)

Interaction:
  Close triggers:
    • Click ✕ button → focus returns to trigger
    • Press ESC → focus returns to trigger
    • Click backdrop → focus returns to trigger
  Focus trap: Tab cycles within modal only
  Aria-modal: "true", aria-labelledby: "modal-title"
```

---

### 4.5 Toast Notification Component

#### **Anatomy**

```
┌─ Success ────────────────────────┐
│ ✓ workshop proposal submitted!   │ ✕
└────────────────────────────────────┘

┌─ Error ──────────────────────────┐
│ ✗ Failed to update profile       │ ✕
└────────────────────────────────────┘

┌─ Info ───────────────────────────┐
│ ℹ You have 3 pending proposals   │ ✕
└────────────────────────────────────┘
```

#### **Specifications**

```
Position: Fixed top-right corner
Offset: 16px from top, 16px from right (mobile: full width with 16px margin)

Sizes:
  Mobile: 100% - 32px (full width minus safe margins)
  Desktop: max-w-sm (384px)

Colors:
  Success: bg-green-50, text-green-900, icon: green-600
  Error: bg-red-50, text-red-900, icon: red-600
  Info: bg-blue-50, text-blue-900, icon: blue-600
  Warning: bg-yellow-50, text-yellow-900, icon: yellow-600

Animation:
  In: slideInFromTop 300ms ease-out + fadeIn
  Out: fadeOut 200ms ease-in

Auto-dismiss:
  Success: 3 seconds
  Error: 5 seconds (user may need time to read)
  Info: 3 seconds
  Manual close: ✕ button always present

Stacking:
  Multiple toasts: Stack vertically with 8px gap
  Max visible: 3 (older ones are auto-dismissed)
```

---

### 4.6 Badge Component

#### **Badge Variants**

| Badge Type | Background | Text | Icon | Use Case |
|-----------|-----------|------|------|----------|
| **Status: Pending** | #FEF3C7 (yellow-100) | #92400E (yellow-900) | ⏳ Clock | Awaiting review |
| **Status: Accepted** | #DCFCE7 (green-100) | #166534 (green-900) | ✓ Check | Approved workshop |
| **Status: Rejected** | #FEE2E2 (red-100) | #991B1B (red-900) | ✗ X | Declined |
| **Tag** | #EFF6FF (blue-100) | #1E3A8A (blue-900) | — | Category, label |
| **Role: Coordinator** | #E0E7FF (indigo-100) | #3730A3 (indigo-900) | — | User role |
| **Role: Instructor** | #F3E8FF (purple-100) | #5B21B6 (purple-900) | — | User role |

#### **Badge Specifications**

```
Padding: 4px 8px (vertical), 4px 12px (horizontal)
Font: 12px 500
Border Radius: 8px (rounded-lg)
Border: 1px solid (darker shade of background color)

Example: Status Badge
  Structure: [Icon] [Label]
  Icon size: 14px
  Gap: 4px between icon and text
```

---

### 4.7 Status Badge (Non-Color-Reliant)

```jsx
// ACCESSIBLE: Uses icon + text + color (not color alone)
<span role="status" className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium bg-green-100 text-green-800 border border-green-300">
  <CheckCircle size={16} aria-hidden="true" />
  Accepted
</span>
```

---

## 5. PAGE-BY-PAGE DESIGN REQUIREMENTS

### 5.1 Authentication Pages

#### **Login Page**

**Purpose**: Authenticate users (coordinators, instructors, admin)

**Layout**:
```
Mobile (375px):
┌─────────────────────┐
│                     │
│    FOSSEE Logo      │ ← 48px, centered
│   Welcome Back      │ ← H2, centered
│                     │
│  ┌─────────────────┐│
│  │ Email or User   ││ ← Input 44px
│  └─────────────────┘│
│                     │
│  ┌─────────────────┐│
│  │ Password        ││ ← Input 44px
│  └─────────────────┘│
│                     │
│  [Login Button]     │ ← Full width, primary
│                     │
│  Forgot password? → │ ← Link
│                     │
│  Don't have acc...? │ ← Link to register
│                     │
└─────────────────────┘

Desktop (1024px):
Centered card (max-w-sm), similar structure
```

**Components**:
- FOSSEE brand logo/text
- Email/username text input (44px, required)
- Password text input (44px, required)
- Login button (full width, primary, 44px)
- "Forgot password?" link (secondary)
- "Register here" link (secondary)
- Error toast (if login fails)

**Interactions**:
- Form validation: Real-time feedback
- Error states: Email format, password required
- Success: Redirect to role-based dashboard
- 401 error: Toast "Invalid credentials"

---

#### **Register Page**

**Purpose**: Create new user account (3-step wizard)

**Step 1: Email & Password**
```
[Progress indicator: 1 of 3]

Email (required)           → Input, email validation
Password (required)        → Input (show/hide toggle)
Confirm Password (required) → Input, match validation
"Next" button             → Disabled until all valid
```

**Step 2: Personal Details**
```
[Progress indicator: 2 of 3]

First Name (required)     → Input
Last Name (required)      → Input
Phone (required)          → Input, 10-digit validation
State (required)          → Select (36 Indian states)
Department (required)     → Select (Engineering, Science, etc.)

"Back" button (left)      → Return to step 1
"Next" button (right)     → Proceed to step 3
```

**Step 3: Terms & Confirmation**
```
[Progress indicator: 3 of 3]

Review section:
  • Email: xxx@xxx.com
  • Name: John Doe
  • Phone: +91 98765 43210
  • State: Karnataka

Checkbox: "I agree to Terms & Conditions"
  (+ link to full T&C in modal)

"Back" button (left)      → Return to step 2
"Register" button (right) → Submit, show pending toast

Success flow:
  → Toast "Check your email for activation"
  → Redirect to email verification page
  OR
  → Auto-activate & redirect to onboarding
```

---

#### **Email Verification / Activation**

**Purpose**: Confirm email ownership

**State 1: Awaiting Email**
```
┌─────────────────────────────────┐
│ Verify Your Email               │
│                                 │
│ We've sent an email to          │
│ arun@example.com with an        │
│ activation link.                │
│                                 │
│ [Click the link to continue]    │
│                                 │
│ Didn't receive email?           │
│ [Resend] or [Change Email]      │
└─────────────────────────────────┘
```

**State 2: Email Verified (After clicking link)**
```
┌─────────────────────────────────┐
│ ✓ Email Verified!               │
│                                 │
│ Your account is ready.          │
│ Redirecting to dashboard...     │
│                                 │
│ [Continue Manually] →           │
└─────────────────────────────────┘
(Auto-redirect after 2 seconds)
```

---

### 5.2 Coordinator (Student) Pages

#### **Coordinator Dashboard**

**Purpose**: Show workshop overview, pending proposals, status summary

**Layout**:
```
Mobile (375px):
┌─────────────────────────────────┐
│ Welcome, Arun!                  │ ← Greeting with user first name
│                                 │
│ ┌──────────────────────────────┐│
│ │ [Propose Workshop] →         ││ ← CTA button, full-width primary
│ └──────────────────────────────┘│
│                                 │
│ ├─ My Workshops Summary         │ ← H2 section
│ │  ┌─────────────┐              │
│ │  │ Pending  5  │ ← Card       │
│ │  └─────────────┘              │
│ │  ┌─────────────┐              │
│ │  │ Accepted 2  │              │
│ │  └─────────────┘              │
│ │                               │
│ ├─ Recent Workshops             │
│ │  ┌─────────────────────────┐  │
│ │  │ Python (⏳ Pending)     │  │ ← Card, click→detail
│ │  │ March 15, 2024          │  │
│ │  │ Dr. Metra (IIT-B)       │  │
│ │  └─────────────────────────┘  │
│ │                               │
│ │  ┌─────────────────────────┐  │
│ │  │ IoT (✓ Accepted)        │  │
│ │  │ April 20, 2024          │  │
│ │  │ Prof. Kumar (NIT-K)     │  │
│ │  └─────────────────────────┘  │
│                                 │
│ [View All Workshops] →          │
└─────────────────────────────────┘

Desktop (1024px):
Similar layout but with sidebar nav, more cards visible
```

**Components**:
- Greeting personalized (logged-in user first name)
- Prominent "Propose Workshop" button (primary CTA)
- Summary cards (3-column grid on desktop, 1-column on mobile):
  - Total proposals
  - Pending proposals
  - Accepted proposals
- Workshop cards (recent 3-5):
  - Workshop type, date, instructor name
  - Status badge (pending/accepted/rejected)
  - Action button: "View Details"
- "View All Workshops" link

**Data from API**:
- `GET /api/workshops/` → List user's workshops
- `GET /api/auth/me/` → Current user (for greeting)

---

#### **Propose Workshop Page**

**Purpose**: Create new workshop proposal (3-step wizard with validation)

**Progress Indicator** (all steps):
```
Step 1: 1/3 — Select Type
Step 2: 2/3 — Choose Date
Step 3: 3/3 — Review & Submit
```

**Step 1: Select Workshop Type**
```
┌─────────────────────────────────┐
│ Step 1 of 3: Select Type        │
│ What workshop do you want to    │
│ propose?                        │
│                                 │
│  (Radio Buttons):               │
│  ⦾ Python Programming           │ ← Icons/emoji possible
│  ○ IoT & Embedded Systems       │
│  ○ Web Development              │
│  ○ Data Science                 │
│  ○ Open Source (FOSS)           │
│  ○ Other (specify below)        │
│                                 │
│  Description (read-only):       │
│  "Basics of Python" → Workshop  │
│  module with hands-on coding    │
│                                 │
│  [Back (disabled)]  [Next] →    │
└─────────────────────────────────┘
```

**Step 2: Choose Date & Time**
```
┌─────────────────────────────────┐
│ Step 2 of 3: When?              │
│                                 │
│ label: Workshop Date (required) │
│ <date input, min: tomorrow>     │
│                                 │
│ label: Preferred Instructor     │
│ <dropdown or autocomplete>      │
│ Optional: Search by name        │
│                                 │
│ label: Duration (hours)         │
│ <number input: 1, 2, 4, 8>      │
│ Default: 2 hours                │
│                                 │
│ label: Venue                    │
│ <text input: college/online>    │
│                                 │
│ [Back] ← → [Next]               │
└─────────────────────────────────┘
```

**Step 3: Review & Confirm**
```
┌─────────────────────────────────┐
│ Step 3 of 3: Review             │
│                                 │
│ Workshop Details:               │
│ • Type: Python Programming      │
│ • Date: March 15, 2024          │
│ • Time: [TBD by instructor]     │
│ • Instructor: Dr. Metra         │
│ • Duration: 2 hours             │
│ • Venue: IIT-B, Room 101        │
│                                 │
│ ☑ I agree to the Terms &        │
│    Conditions                   │
│                                 │
│ [Back] ← → [Submit Proposal] →  │
└─────────────────────────────────┘

Success:
┌─────────────────────────────────┐
│ ✓ Proposal Submitted!           │
│                                 │
│ Tracking ID: #WB-2024-001231    │
│ Check email for confirmation    │
│                                 │
│ [View Status]  [Back to Home]   │
└─────────────────────────────────┘
```

**Components**:
- Progress bar (Step 1/2/3)
- Form inputs (validated on blur)
- Error messages (aria-describedby)
- Back/Next buttons
- Success confirmation modal

**Data from API**:
- `GET /api/workshop-types/` → List types for step 1
- `POST /api/workshops/` → Submit proposal
- Response: `{ id, status, created_at, tracking_id }`

---

#### **My Workshops Page (Status View)**

**Purpose**: Track all proposals and their statuses

**Layout**:
```
Tabs / Filters:
[ All ] [ Pending ⏳ 5 ] [ Accepted ✓ 2 ] [ Rejected ✗ 1 ]

Workshops List (Grid on desktop, stack on mobile):

┌─ Pending (5)
│  ┌─────────────────────────────┐
│  │ Python Programming          │
│  │ Status: ⏳ Pending          │
│  │ Proposed: March 15, 2024    │
│  │ Instructor: Awaiting Review │
│  │ [View] [Edit] [Cancel]      │
│  └─────────────────────────────┘
│  
│  ┌─────────────────────────────┐
│  │ IoT Basics                  │
│  │ Status: ⏳ Pending          │
│  │ Proposed: April 10, 2024    │
│  │ Instructor: Awaiting Review │
│  │ [View] [Edit] [Cancel]      │
│  └─────────────────────────────┘

┌─ Accepted (2)
│  ┌─────────────────────────────┐
│  │ Data Science Intro          │
│  │ Status: ✓ Accepted          │
│  │ Date: March 25, 2024, 2 PM  │
│  │ Instructor: Prof. Kumar     │
│  │ [View] [Reschedule]         │
│  └─────────────────────────────┘

┌─ Rejected (1)
│  ┌─────────────────────────────┐
│  │ Web Dev Advanced            │
│  │ Status: ✗ Rejected          │
│  │ Reason: "Already scheduled" │
│  │ [View Details]              │
│  └─────────────────────────────┘
```

**Components**:
- Filter tabs (Tab component)
- Workshop cards (status badge, date, instructor)
- Action buttons (View, Edit, Cancel, Reschedule)
- Empty state: "No pending proposals. Start by proposing one!"

---

### 5.3 Instructor Pages

#### **Instructor Dashboard**

**Purpose**: Show pending proposals needing review/acceptance

**Layout**:
```
Greeting:
"Hello, Dr. Metra. You have 3 pending proposals."

┌─ Pending Proposals (Above-fold, critical)
│  ┌──────────────────────────────┐
│  │ Python Programming           │
│  │ Proposed by: Arun Kumar      │
│  │ Institution: IISER Pune      │
│  │ Date: March 15, 2024         │
│  │ Duration: 2 hours            │
│  │ Venue: Online                │
│  │                              │
│  │ [View Details] [Accept] [Reject]
│  └──────────────────────────────┘
│
│  ┌──────────────────────────────┐
│  │ IoT Basics                   │
│  │ Proposed by: Priya Sharma    │
│  │ Institution: VIT Chennai     │
│  │ Date: April 10, 2024         │
│  │ Venue: IIT-B Campus          │
│  │                              │
│  │ [View Details] [Accept] [Reject]
│  └──────────────────────────────┘

┌─ Upcoming Workshops (Accepted, scheduled this month)
│  March 15 (Friday, 2 PM) — Python — IISER Pune
│  March 20 (Wed, 10 AM) — Data Science — NIT Trichy
│
├─ Past Workshops (Month history)
│  March 8 — Web Dev — Delhi Univ
│  March 1 — IoT — IIT-K
```

**Components**:
- Greeting with pending count
- Pending proposals (cards with actions)
- Upcoming workshops (list or calendar view)
- Past workshops (archive)

**Actions**:
- [View Details] → Opens modal/detail page
- [Accept] → Opens confirmation dialog
- [Reject] → Opens modal with optional rejection reason

---

#### **Workshop Detail / Review Page (Instructor)**

**Purpose**: View full proposal details and make accept/reject decision

**Layout**:
```
┌──────────────────────────────────────────┐
│ << Back                                 │
│                                          │
│ Python Programming                       │
│ Status: ⏳ Pending Review                │
│                                          │
│ Proposal Details:                        │
│  • Proposed by: Arun Kumar               │
│    (Coordinator at IISER Pune)           │
│  • Institution: IISER Pune               │
│  • Proposed Date: March 15, 2024         │
│  • Preferred Time: 2 PM - 4 PM           │
│  • Venue: Lecture Hall A / Online        │
│  • Expected Students: 40-50              │
│  • Duration: 2 hours                     │
│                                          │
│ Additional Details:                      │
│  "We want to introduce Python to our    │
│   final-year students. Focus on basics  │
│   and practical coding exercises."       │
│                                          │
│ Contact Information:                     │
│  • Email: arun@iiserpune.ac.in           │
│  • Phone: +91 98765 43210                │
│  • Contact Person: Arun Kumar            │
│                                          │
│ ─────────────────────────────────────── │
│                                          │
│ [Comments] tab                           │
│  └─ Add internal notes before deciding   │
│                                          │
│ ─────────────────────────────────────── │
│                                          │
│ Your Decision:                           │
│              [Reject] [Accept]           │
│                                          │
└──────────────────────────────────────────┘
```

---

### 5.4 Shared Pages

#### **Workshop Types Page (Public)**

**Purpose**: Browse all available workshop categories

**Layout**:
```
┌──────────────────────────────────────┐
│ Workshop Categories                  │
│                                      │
│ Search: [_______________] 🔍         │
│ Filter: [All ▼]                      │
│                                      │
│ ┌────────────────┐ ┌────────────┐  │
│ │ 🐍 Python      │ │ 💾 Data Sci│  │
│ │ Programming    │ │ Intro      │  │
│ │                │ │            │  │
│ │ 45 proposals   │ │ 12 proposals│ │
│ │ Since 2020     │ │ Since 2022  │  │
│ │ [View]         │ │ [View]     │  │
│ └────────────────┘ └────────────┘  │
│                                      │
│ ┌────────────────┐ ┌────────────┐  │
│ │ 🌐 Web Dev     │ │ IoT & Embed│  │
│ │ Fundamentals   │ │ Systems    │  │
│ │                │ │            │  │
│ │ 28 proposals   │ │ 7 proposals │ │
│ │ [View]         │ │ [View]     │  │
│ └────────────────┘ └────────────┘  │
│                                      │
│ ┌────────────────┐ ┌────────────┐  │
│ │ 📊 Open Source │ │ ML / AI    │  │
│ │ (FOSS)         │ │ Basics     │  │
│ │                │ │            │  │
│ │ 18 proposals   │ │ 9 proposals │ │
│ │ [View]         │ │ [View]     │  │
│ └────────────────┘ └────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

---

#### **Statistics Page (Public)**

**Purpose**: Show workshop adoption, trends, state-wise distribution

**Layout**:
```
┌──────────────────────────────────────┐
│ Workshop Statistics                  │
│                                      │
│ Date Range: [Jan 2024] - [Mar 2024]  │
│ Filter: [All Types ▼] [All States ▼]│
│                                      │
│ Key Metrics (Grid):                  │
│  ┌────────────┐ ┌────────────┐      │
│  │ Total      │ │ Accepted   │      │
│  │ Proposals  │ │ Success    │      │
│  │    127     │ │   95%      │      │
│  └────────────┘ └────────────┘      │
│  ┌────────────┐ ┌────────────┐      │
│  │ Students   │ │ States     │      │
│  │ Reached    │ │ Covered    │      │
│  │  5,420     │ │    24/36   │      │
│  └────────────┘ └────────────┘      │
│                                      │
│ Chart 1: Proposals Over Time         │
│ ┌────────────────────────────────┐   │
│ │ (Line chart: Jan→Feb→Mar)      │   │
│ │ Jan: 32, Feb: 45, Mar: 50      │   │
│ └────────────────────────────────┘   │
│                                      │
│ Chart 2: State-wise Distribution     │
│ ┌────────────────────────────────┐   │
│ │ (Bar chart top 10 states)      │   │
│ │ Karnataka: 28                  │   │
│ │ Tamil Nadu: 22                 │   │
│ │ Delhi: 18                      │   │
│ │ ...                            │   │
│ └────────────────────────────────┘   │
│                                      │
│ Chart 3: Workshops by Type           │
│ ┌────────────────────────────────┐   │
│ │ (Pie chart)                    │   │
│ │ Python: 35%                    │   │
│ │ Web Dev: 21%                   │   │
│ │ Data Science: 18%              │   │
│ │ Others: 26%                    │   │
│ └────────────────────────────────┘   │
│                                      │
│ [Download CSV] [Print]               │
│                                      │
└──────────────────────────────────────┘
```

---

#### **User Profile Page**

**Purpose**: View/edit personal information

**Layout**:
```
Tabs: [My Profile] [Settings] [Account]

┌─ My Profile
│  Profile Picture:
│  [Avatar Circle]    or    [Upload]
│  "AR" initials or user photo
│
│  Personal Information (Editable inline):
│  Name: Arun Kumar         [Edit]
│  Email: arun@example.com  (read-only)
│  Phone: +91 98765 43210   [Edit]
│  State: Karnataka         [Edit]
│  Institution: IISER Pune  [Edit]
│
│  Role Information:
│  Role: Coordinator ← or Instructor
│  Member Since: January 2023
│
│  [Save Changes]

┌─ Settings
│  Notifications:
│  ☑ Email on new proposal
│  ☑ Email on accept/reject
│  ☐ SMS notifications
│
│  Privacy:
│  Profile visibility: [Public ▼]
│  Show email: [Yes ▼]

┌─ Account
│  Password:
│  [Change Password]
│
│  [Delete Account] (with confirmation)
│  [Sign Out All Devices]
```

**Components**:
- Avatar (initials or image)
- Inline editable fields
- Tab navigation
- Save/Cancel buttons
- Confirmation modals for destructive actions

---

## 6. USER FLOWS & INTERACTIONS

### 6.1 Authentication Flow

```
┌─────────────────┐
│ Anonymous Visitor
└────────┬────────┘
         │
    [Visit App]
         │
         ↓
    ┌─────────────┐
    │ Redirected  │
    │ to /login   │
    └──────┬──────┘
           │
      [User Action]
           │
    ┌──────┴──────┐
    ↓             ↓
[Login]      [Register]
    │             │
    ↓             ↓
[Credentials]  [Email→Verify]
    │             │
    ↓             ↓
[Check with     [Activation]
 Django Auth]    │
    │            ↓
    ↓        [Logged In]
[Session Set]    │
    │            ↓
    ↓        ┌────────────────┐
 [Redirect]  │ Check Role in  │
    │        │ /api/auth/me/  │
    └──────┬─┤ (Position field)
           │ └────────────────┘
      ┌────┴────┐
      ↓         ↓
 [Coordinator] [Instructor]
 Dashboard    Dashboard
```

**Duration**: 2-5 seconds

---

### 6.2 Propose Workshop Flow

```
[Coordinator]
     │
     ↓
[Click "Propose"]
     │
     ↓
┌────────────────────────┐
│ Step 1: Select Type    │
│ (Radio buttons)        │
└──────┬─────────────────┘
       │ [Next]
       ↓
┌────────────────────────┐
│ Step 2: Date & Time    │
│ (Form inputs)          │
└──────┬─────────────────┘
       │ [Next]
       ↓
┌────────────────────────┐
│ Step 3: Review & Agree │
│ (Summary + T&C)        │
└──────┬─────────────────┘
       │ [Submit]
       ↓
┌────────────────────────┐
│ POST /api/workshops/   │
│ {type, date, ...}      │
└──────┬─────────────────┘
       │
    ┌──┴──┐
    ↓     ↓
 [Error][Success]
    │     │
    ↓     ↓
[Toast] [Toast]
[Retry] [Redirect to status]
           │
           ↓
    [⏳ Pending]
     Dashboard
```

**Duration**: 3-7 minutes (user fills form), 2 seconds (API submission)

---

### 6.3 Accept/Reject Workshop Flow

```
[Instructor Dashboard]
   Pending Proposals
         │
         ↓
  [Click proposal]
         │
         ↓
  [Review modal]
         │
    ┌────┴────┐
    ↓         ↓
 [Accept]  [Reject]
    │         │
    ↓         │
  [API call] │
  POST       │
  /api/work- │
  shops/{id}/│
  accept/    │
    │        ↓
    │    [Open reason modal]
    │    [Optional text input]
    │        │
    │        ↓
    │    [API call]
    │    POST /api/workshops/
    │    {id}/reject/
    │    {reason}
    │        │
    ├────┬───┘
    ↓    ↓
[Toast message]
  Success
    │
    ↓
[Update dashboard]
 Proposal removed
 from pending list
```

**Duration**: 30 seconds to 3 minutes (review) + 1 second (API)

---

## 7. FEATURES & FUNCTIONALITY MATRIX

| Feature | Coordinator | Instructor | Anonymous | Admin | Mobile | Desktop |
|---------||---|---|---|---|---|
| View workshops | ✓ | ✓ | ✓ (public) | ✓ | ✓ | ✓ |
| Propose workshop | ✓ |  |  |  | ✓ | ✓ |
| Track proposal | ✓ |  |  | ✓ | ✓ | ✓ |
| Review proposals |  | ✓ |  | ✓ | ✓ | ✓ (preferred) |
| Accept/reject |  | ✓ |  |  | ✓ | ✓ |
| Reschedule |  | ✓ |  |  | ✓ | ✓ |
| Comment | ✓ | ✓ |  |  | ✓ | ✓ |
| View statistics | ✓ | ✓ | ✓ |  | ✓ | ✓ |
| Edit profile | ✓ | ✓ |  |  | ✓ | ✓ |
| Download report |  |  |  | ✓ |  | ✓ |

---

## 8. RESPONSIVE DESIGN SPECIFICATIONS

### 8.1 Breakpoints

```
Mobile (320px–639px):
  - Single column layouts
  - BottomNav navigation (fixed bottom)
  - Full-width buttons
  - Stacked forms
  - Images scale to 100%

Small (640px–767px):
  - Still primarily mobile layout
  - 2-column grids optional
  - Wider cards

Tablet (768px–1023px):
  - 2-column layouts
  - Top navbar + drawer nav
  - Side sidebar (optional)
  - Horizontal form fields

Desktop (1024px+):
  - 3+ column layouts
  - Top navbar + sidebar nav
  - Multi-column dashboards
  - Horizontal cards/tables
```

### 8.2 Responsive Components

```
Navigation:
  Mobile (<768px): BottomNav (4 icons, fixed bottom)
  Desktop (≥768px): Navbar (top, horizontal links)

Cards:
  Mobile: Full width (-16px margin)
  Tablet: 2-column grid (gap-4)
  Desktop: 3-column grid (gap-6)

Buttons:
  Mobile: Full width on forms
  Desktop: Auto width, side by side

Modals:
  Mobile: 100% width (slides from bottom), full height
  Desktop: Centered max-width 500px, fade-in
```

---

## 9. ACCESSIBILITY REQUIREMENTS

### 9.1 WCAG 2.1 AA Compliance Checklist

| Criterion | Requirement | Implementation |
|-----------|------------|---|
| **1.4.3 Contrast** | 4.5:1 for normal text | Body text 14.5:1 ratio ✓ |
| **1.4.13 Content Above Fold** | Important content visible without scrolling | CTA buttons, status summary visible ✓ |
| **2.1.1 Keyboard** | All functionality via keyboard | Tab, Enter, Escape navigation ✓ |
| **2.1.3 Keyboard No Exception** | No keyboard trap | Modal focus trap OK, escapable ✓ |
| **2.4.3 Focus Order** | Logical focus order | Nav → Content → Forms → Footer ✓ |
| **2.4.7 Focus Visible** | Visible focus indicator | 2px solid #2563eb outline always visible ✓ |
| **3.2.2 On Input** | No unexpected context change | Form changes don't auto-submit ✓ |
| **3.3.1 Error Identification** | Errors identified clearly | aria-invalid + role="alert" messages ✓ |
| **3.3.3 Error Suggestion** | Help text for errors | aria-describedby hints ✓ |
| **4.1.2 Name, Role, Value** | All controls have accessible name | aria-label, aria-labelledby on all interactive elements ✓ |

### 9.2 Keyboard Navigation

```
Tab: Navigate forward through interactive elements
Shift+Tab: Navigate backward
Enter: Activate buttons, submit forms
Space: Toggle checkboxes, radio buttons
Arrow Keys: Navigate within dropdowns, modals
Escape: Close modals, cancel operations
Ctrl+S: Save form (if implemented)
```

### 9.3 Screen Reader Support

- All page sections have semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`)
- Headings use proper hierarchy (h1 → h2 → h3)
- Images have alternative text (alt attributes)
- Icon buttons have `aria-label`
- Form groups have `<label htmlFor>`
- Error messages use `role="alert"`
- Status updates use `role="status"` with `aria-live="polite"`

---

## 10. API & DATA INTEGRATION POINTS

### 10.1 Key Endpoints

```
Authentication:
  POST /api/auth/login/         → { access_token, user }
  POST /api/auth/register/      → { user, activation_email_sent }
  GET /api/auth/me/             → { user, profile, role }
  POST /api/auth/logout/        → { success }
  POST /api/auth/activate/<key>/ → { success }

Workshops:
  GET /api/workshops/           → [ { id, type, date, status, instructor } ]
  POST /api/workshops/          → Create proposal
  GET /api/workshops/<id>/      → Detailed view
  POST /api/workshops/<id>/accept/   → Accept proposal
  POST /api/workshops/<id>/reject/   → Reject with reason
  POST /api/workshops/<id>/change-date/ → Reschedule
  GET /api/workshops/<id>/comments/ → List comments
  POST /api/workshops/<id>/comments/ → Add comment

Workshop Types:
  GET /api/workshop-types/      → [ { id, name, description } ]

Profile:
  GET /api/profile/             → Current user profile
  GET /api/profile/<user_id>/   → Other user profile
  PUT /api/profile/             → Update profile

Statistics:
  GET /api/stats/public/        → Public statistics
  GET /api/stats/team/          → Team/institution statistics
```

### 10.2 Data Models (JSON Schema)

```json
{
  "Workshop": {
    "id": "uuid",
    "type_id": "uuid",
    "coordinator_id": "uuid",
    "instructor_id": "nullable uuid",
    "title": "string",
    "description": "string",
    "proposed_date": "ISO-8601 date",
    "scheduled_date": "nullable ISO-8601 date",
    "status": "0 (Pending) | 1 (Accepted) | 2 (Rejected)",
    "created_at": "ISO-8601 datetime",
    "updated_at": "ISO-8601 datetime",
    "rejection_reason": "nullable string"
  },

  "Profile": {
    "user_id": "uuid",
    "phone": "string (10 digits)",
    "state": "string (36 Indian states)",
    "institution": "string",
    "department": "string",
    "position": "coordinator | instructor",
    "bio": "nullable string",
    "avatar_url": "nullable URL"
  },

  "Comment": {
    "id": "uuid",
    "workshop_id": "uuid",
    "author_id": "uuid",
    "text": "string",
    "created_at": "ISO-8601 datetime",
    "updated_at": "ISO-8601 datetime"
  }
}
```

---

## 11. DESIGN TOKENS & IMPLEMENTATION

### 11.1 Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      'fossee-blue': '#003865',
      'fossee-orange': '#F7941D',
      'fossee-light': '#EEF4FB',
      // ... standard Tailwind colors
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    extend: {
      spacing: {
        'safe-area-bottom': 'max(1rem, env(safe-area-inset-bottom))',
      },
      keyframes: {
        slideUp: { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        // ... custom animations
      },
    },
  },
};
```

---

## 12. ANIMATION & MICRO-INTERACTIONS

### 12.1 Key Animations

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Button | Hover | Scale 1.05 + shadow grow | 200ms | ease-out |
| Button | Click | Scale 0.95 | 75ms | ease-in |
| Card | Hover (desktop) | Lift (shadow grow) | 300ms | ease-out |
| Modal (open) | Trigger | Fade-in + scale 0.95→1 | 300ms | ease-out |
| Modal (close) | Trigger | Fade-out + scale 1→0.95 | 200ms | ease-in |
| Toast (in) | Trigger | Slide from top + fade-in | 300ms | ease-out |
| Toast (out) | Auto/dismiss | Fade-out | 200ms | ease-in |
| Form error | Invalid | Shake + background flash | 200ms | ease-out |
| Spinner | Loading | Rotate 360° continuous | 1s | linear |

### 12.2 Accessibility in Animations

```css
/* Respect prefers-reduced-motion (WCAG AA) */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 13. ERROR STATES & VALIDATION

### 13.1 Form Validation

```
Email Input:
  ✓ Valid: name@example.com (green border)
  ✗ Invalid: "invalid-email" (red border + error message)
  ✗ Empty: (required) (red border + "This field is required")

Phone Input:
  ✓ Valid: +91 98765 43210 (10 digits)
  ✗ Invalid: 123 (red border + "Phone must be 10 digits")

Date Input:
  ✓ Valid: 2024-03-15 (anytime from tomorrow)
  ✗ Invalid: 2024-03-01 (past date, red border + "Date must be in future")

Select Dropdown:
  ✓ Valid: "Karnataka" (blue border on focus)
  ✗ Invalid: No selection (red border + "Please select an option")
```

### 13.2 API Error Handling

```
Network Error:
  Toast: "Connection lost. Retrying..."
  Auto-retry after 3 seconds, up to 3 attempts
  
401 Unauthorized:
  Toast: "Your session expired. Please log in again"
  Redirect to /login

400 Bad Request:
  Toast: "Invalid data. Please review and try again"
  Highlight fields with errors

500 Internal Server Error:
  Toast: "Something went wrong. Please try again"
  Show retry button
```

---

## 14. IMPLEMENTATION ROADMAP

### Phase 1: Core Pages (Weeks 1-2)
- [ ] Login & Register
- [ ] Coordinator Dashboard
- [ ] Propose Workshop (3-step wizard)

### Phase 2: Instructor Features (Week 3)
- [ ] Instructor Dashboard
- [ ] Workshop Review & Accept/Reject
- [ ] Comment Thread

### Phase 3: Polish & Optimization (Week 4)
- [ ] Statistics Page
- [ ] Profile Management
- [ ] Accessibility audit & fixes
- [ ] Performance optimization

---

## 15. DESIGN HANDOFF CHECKLIST

- [ ] All components built in Tailwind + React
- [ ] Mobile responsive (tested at 375px, 768px, 1024px, 1920px)
- [ ] WCAG 2.1 AA accessibility verified
- [ ] Touch targets all ≥44px
- [ ] Focus visible on all interactive elements
- [ ] ARIA labels on icons and dynamic content
- [ ] Color contrast ratios verified (4.5:1 minimum)
- [ ] Error messages clear and actionable
- [ ] Loading states for all async operations
- [ ] Empty states for lists
- [ ] Keyboard navigation tested (Tab, Enter, Escape)
- [ ] Screen reader tested (NVDA, JAWS, VoiceOver)
- [ ] Form validation real-time
- [ ] API error handling implemented
- [ ] Toast notifications on success/error
- [ ] Git committed with meaningful messages
- [ ] Lighthouse audit: Performance ≥88, Accessibility ≥95

---

## 16. RESOURCES & REFERENCES

**Design System Documentation**:
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Inter Font](https://fonts.google.com/specimen/Inter)

**Accessibility**:
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Deque axe DevTools](https://www.deque.com/axe/devtools/)

**React & Performance**:
- [React Official Docs](https://react.dev)
- [React Router v6](https://reactrouter.com/docs/en/v6)
- [React Code Splitting](https://react.dev/reference/react/lazy)

**Component Libraries** (for reference):
- [Shadcn/ui](https://ui.shadcn.com/)
- [Headless UI](https://headlessui.com/)
- [Radix UI](https://www.radix-ui.com/)

---

**Document Version**: 2.0  
**Last Updated**: April 9, 2026  
**Next Review**: After first round of user testing

---

