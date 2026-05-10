# TVK Orathanadu – Project Overview

## What Is This?

**TVK Orathanadu** is a full-stack **Progressive Web App (PWA)** built for the *Thamizhaga Vetri Kazhagam* (TVK) political party to manage constituency operations for **Orathanadu Assembly Constituency – No. 175** in Tamil Nadu, India.

It serves as a digital platform for:
- Party member enrollment & digital ID cards
- Grievance submission and tracking
- Event management and QR-based attendance
- Constituency-wide chat
- Admin analytics and booth management

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | JavaScript (ESM) |
| **UI** | React 19 + TailwindCSS v4 |
| **Auth** | NextAuth.js v5 (beta.25) – Credentials provider |
| **Database** | MongoDB via Mongoose v8 |
| **Email** | Nodemailer (OTP delivery) |
| **QR Codes** | `qrcode.react` (generate) + `html5-qrcode` (scan) |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **ID Generation** | nanoid |
| **Password Hashing** | bcryptjs |
| **Image Export** | html-to-image |
| **Deployment** | Vercel (PWA installable) |

---

## Project Structure

```
tvk-antigravity/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.js             # Landing page (public)
│   │   ├── layout.js           # Root layout (SessionProvider, TopLoader)
│   │   ├── login/              # OTP + password login page
│   │   ├── chat/               # Constituency-wide chat (client)
│   │   ├── dashboard/          # Protected dashboard area
│   │   │   ├── layout.js       # Sidebar + MobileNav + MobileHeader
│   │   │   ├── page.js         # Smart redirect by role
│   │   │   ├── voter/          # Voter dashboard
│   │   │   ├── leader/         # Poruppalar (leader) dashboard
│   │   │   ├── admin/          # Admin analytics, users, events, scanner
│   │   │   ├── events/         # Event listing & booking
│   │   │   ├── grievances/     # Submit/track grievances
│   │   │   ├── ticket/         # Digital membership card
│   │   │   ├── notifications/  # Broadcast notifications
│   │   │   ├── feedback/       # User feedback
│   │   │   └── profile/        # Profile setup/edit
│   │   └── api/auth/           # NextAuth.js catch-all route
│   ├── auth.js                 # NextAuth config (authorize logic)
│   ├── auth.config.js          # Edge-compatible auth config (callbacks)
│   ├── middleware.js            # Route protection + RBAC redirects
│   ├── models/                 # Mongoose schemas
│   ├── components/             # Shared React components
│   ├── actions/                # Next.js Server Actions
│   ├── lib/                    # Utilities (db, mailer, constants, nav)
│   └── data/                   # Static data (users.json for admin)
```

---

## Authentication System

### Flow (Three-layer fallback)
1. **Environment Variables** – `ADMIN_EMAIL` + `ADMIN_PASSWORD` (highest priority, Vercel-safe)
2. **`data/users.json`** – Hardcoded local users (bundled at build time)
3. **MongoDB Database** – Bcrypt-hashed passwords for registered members

### OTP Flow (for regular members)
- User enters email → API sends OTP via Nodemailer
- User enters OTP → `auth.js` validates against `OTP` collection
- On success: user is created if new, session is established
- New users default to **Voter** role

### Middleware RBAC
Routes are protected and role-redirected in `middleware.js`:
- `/dashboard/admin/*` → Admin only
- `/dashboard/leader/*` → Poruppalar only  
- `/dashboard/voter/*` → Voter only
- All `/dashboard/*` → must be authenticated
- `/login` while logged in → redirected to `/dashboard`

---

## User Roles

| Role | Tamil Term | Access Level |
|---|---|---|
| **Voter** | வாக்காளர் | Basic member: ticket, grievances, events, chat |
| **Poruppalar** | பொறுப்பாளர் | Leader: + booth grievances view |
| **Admin** | நிர்வாகி | Full access: analytics, user mgmt, scanner, event mgmt |
| **MLA** | சட்டமன்ற உறுப்பினர் | (Schema defined, not yet routed) |
| **DistSecretary** | மாவட்ட செயலாளர் | (Schema defined, not yet routed) |

---

## Data Models

### User
- `name`, `username` (unique/sparse), `email`, `password` (bcrypt)
- `role` (Voter/Poruppalar/Admin/MLA/DistSecretary)
- `mobile`, `voterId`, `panchayat`, `boothNumber`
- `isProfileComplete` (boolean), `image`, `createdAt`

### Grievance
- `userId` (ref: User), `title`, `description`
- `category`: Agriculture | Water | Road | Electricity | Other
- `status`: Pending | Investigating | Resolved
- `panchayat`, `boothNumber`, `createdAt`, `updatedAt`

### Event
- `title`, `description`, `date`, `location`
- `capacity`, `seatPrefix`, `isActive`, `createdBy`

### Attendance
- `userId`, `userName`, `userRole`, `panchayat`, `boothNumber`
- `event` (name), `scannedBy` (admin email), `scannedAt`
- Compound index: `{ userId, event, scannedAt }` (prevents duplicates)

### Message (Chat)
- `senderEmail`, `senderName`, `content`, `role`, `createdAt`
- Index: `{ createdAt: -1 }` for efficient polling

### Notification
- `title`, `message`, `type` (info/warning/success/announcement)
- `targetRole` (All/Admin/Poruppalar/Voter), `isSystem`

### OTP
- Short-lived OTP records for email login; deleted after use

### Booking
- Event seat bookings (linked to User + Event)

### Feedback
- User feedback/ratings (separate from grievances)

---

## Key Features

### 1. Digital Membership Ticket
- QR code generated from user's MongoDB `_id`
- Shows: name, role, panchayat, booth number
- `html-to-image` enables PNG download/share
- Ticket + MembershipCard are two separate visual card components

### 2. QR Attendance Scanner (Admin only)
- Uses `html5-qrcode` to scan member QR codes
- Records attendance to MongoDB with event, location, timestamp
- Prevents duplicate scanning (index-enforced)

### 3. Grievance System
- Voters submit issues by category
- Poruppalar sees booth-level grievances
- Admin sees all + can update status
- Categories: Agriculture, Water, Road, Electricity, Other

### 4. Event Management
- Admins create events with capacity + seat prefix
- Members can book seats
- Events listed in a calendar/list view for all roles

### 5. Constituency Chat
- Shared real-time chat room for all authenticated users
- 5-second polling (Server Actions-based)
- Last 50 messages fetched on load
- Messages show sender name + timestamp + role-styled bubbles

### 6. Admin Analytics Dashboard
- Live stats: total members, active issues, booth coverage, profile completion %
- Role distribution bar chart (CSS-based)
- Grievance category breakdown
- 7-day user growth histogram (bar chart)
- Top 5 panchayats by member count
- Quick links to user management + grievance review
- DatabaseManager component for direct DB operations

### 7. Notifications
- Broadcast messages from Admin to specific roles or all users
- Types: info, warning, success, announcement

### 8. Profile Management
- First-time users go through profile setup flow
- Fields: name, mobile, voter ID, panchayat, booth number, profile image
- `isProfileComplete` flag used for onboarding gate

### 9. PWA Support
- `manifest.js` (dynamic manifest route)
- `viewport` + `appleWebApp` metadata for iOS/Android install
- `InstallButton` component for browser install prompt

---

## Constituency Data

`lib/constants.js` contains a hardcoded list of **~100 Panchayat names** specific to the Orathanadu constituency — used in dropdowns for user profile and filtering.

---

## Navigation (Role-Based)

Navigation items defined in `lib/nav.js` per role:

| Role | Navigation Items |
|---|---|
| Voter | Dashboard, Notifications, My Ticket, Events, Grievances, Chat, Profile |
| Poruppalar | Dashboard, Notifications, My Ticket, Events, Booth Grievances, Chat, Profile |
| Admin | Analytics, Notifications, My Ticket, Events, Scanner, Manage Events, Users, Grievances, Chat, Profile |

Navigation items have both English labels and Tamil (`labelTa`) equivalents.

---

## UI / Design System

- **Color Palette**: Deep dark background (`#050505`/`#0a0a0a`), **Maroon** (`#800000`) as primary, **Gold** (`#FFD700`) as accent
- **Glassmorphism**: `.glass-card` utility throughout
- **Animations**: `animate-float`, `animate-fade-in-up`, `animate-pulse` for micro-interactions
- **Typography**: Tamil (`lang="ta"`) + English, custom `.tamil` class
- **Layout**: Desktop uses a left **Sidebar**; Mobile uses bottom **MobileNav** + top **MobileHeader**
- **Gradient text**: `.gradient-text` class (maroon→gold)

---

## Server Actions (`src/actions/`)

| File | Purpose |
|---|---|
| `auth.js` | Login/logout server actions |
| `admin.js` | User role changes, admin ops |
| `chat.js` | `getMessages()`, `sendMessage()` |
| `db-admin.js` | Direct DB management (admin only) |
| `event.js` | Create/edit/delete events, book seats |
| `feedback.js` | Submit feedback |
| `grievance.js` | Submit/update grievances |
| `notification.js` | Create/fetch notifications |
| `profile.js` | Update profile fields |
| `verification.js` | Scan QR + record attendance |

---

## Current State & Known Gaps

> [!NOTE]
> Based on conversation history, the following are recently implemented or stabilized:

- ✅ OTP-based passwordless login (Nodemailer)
- ✅ Auth.js v5 with Edge-compatible middleware
- ✅ QR attendance scanner for admins
- ✅ Chat with polling and Telegram-style UI
- ✅ Admin analytics dashboard
- ✅ Digital ticket + membership card
- ✅ PWA installability

> [!WARNING]
> Roles `MLA` and `DistSecretary` are in the schema but have no dedicated routes or dashboards yet.

> [!TIP]
> The `tvk-mobile-app/` directory exists but is **empty** — a React Native or Expo mobile app may be planned but not started.
