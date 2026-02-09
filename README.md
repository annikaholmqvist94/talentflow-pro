# TalentFlow Pro - Frontend

Modern recruitment platform built with React, TypeScript, and Supabase. Features real-time candidate pipeline management with drag-and-drop Kanban board.

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Authentication](#-authentication)
- [User Roles](#-user-roles)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)

---

## 🎯 Overview

TalentFlow Pro is a modern Applicant Tracking System (ATS) frontend that connects to a Spring Boot backend with Supabase authentication. It provides an intuitive interface for recruitment teams to manage their entire hiring pipeline.

### Demo Credentials

**Admin User:**
- Email: `admin@acme.com`
- Password: `ChangeThisPassword123!`

> **Note:** Additional users can be created via the Admin Panel once logged in as admin.

---

## ✨ Features

### 🏠 Dashboard
- Welcome greeting with user information
- Active applications overview
- Real-time career statistics
- Internal jobs listing
- Upcoming meetings calendar

### 💼 Jobs Management
- Create and edit job postings
- Filter by status (ACTIVE/CLOSED/DRAFT)
- Search by job title
- View application statistics per job
- Department-based organization

### 👥 Candidates Management
- **Add candidates** with complete profiles
- LinkedIn profile integration
- Skills management with tags
- Contact information display
- Search and filter candidates
- **Candidate detail view** with:
  - Full profile information
  - Skills editing (inline)
  - Summary editing (inline)
  - Activity timeline
  - Notes management
  - **Scorecard system** with 5 categories:
    - Technical Skills (1-5 stars)
    - Communication (1-5 stars)
    - Culture Fit (1-5 stars)
    - Experience (1-5 stars)
    - Leadership (1-5 stars)
  - Overall rating calculation
  - Real-time auto-save

### 📊 Kanban Pipeline (Main Feature)
- **5-column workflow:**
  - 🆕 NEW
  - 🔍 SCREENING
  - 💬 INTERVIEW
  - 📝 OFFER
  - ❌ REJECTED
- **Drag-and-drop** to move candidates between stages
- Filter by job posting
- Search by candidate name
- Click card for detailed candidate view
- Real-time statistics and counts
- Stage-specific coloring

### 🔐 Admin Panel (Admin Only)
- **Create organizations**
- **Create user accounts:**
  - Regular users (USER role)
  - Admin users (ADMIN role)
- **User management:**
  - Set passwords for new users
  - Assign roles
  - Link to organizations
- View all users in system
- Organization switcher (for admins)

---

## 🛠️ Tech Stack

### Core
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI Framework |
| TypeScript | 5 | Type Safety |
| Vite | 5 | Build Tool |
| Tailwind CSS | 3 | Styling |

### Key Libraries
| Library | Purpose |
|---------|---------|
| `react-router-dom` | Routing |
| `@supabase/supabase-js` | Authentication |
| `@dnd-kit/*` | Drag & Drop |
| `lucide-react` | Icons |
| `sonner` | Toast Notifications |
| `@radix-ui/*` | UI Components |

### Development
- **Code Quality:** ESLint, Prettier
- **Type Checking:** TypeScript strict mode
- **State Management:** React Context API
- **HTTP Client:** Fetch API with custom wrapper

---

## 🚀 Getting Started

### Prerequisites
```bash
node -v    # Node 18+
npm -v     # npm 9+
```

### Backend Setup

Ensure backend is running first:
```bash
cd mini-ATS
./mvnw spring-boot:run
# Backend available at http://localhost:8080/api
```

### Frontend Installation
```bash
# Clone repository
git clone <your-repo-url>
cd talentflow-pro

# Install dependencies
npm install

# Create environment file
cat > .env.local << EOF
VITE_SUPABASE_URL=https://xlrbdnnferxnitillzmt.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:8080/api
EOF

# Start development server
npm run dev
```

**Frontend available at:** http://localhost:5173

---

## 🔐 Authentication

### Supabase Auth Integration

This application uses **Supabase Authentication** with JWT tokens validated by the Spring Boot backend.

#### How It Works

1. **User logs in** via Supabase Auth (`email + password`)
2. **Supabase returns** a JWT token (ES256 signed)
3. **Frontend stores** token in session
4. **All API requests** include `Authorization: Bearer <token>` header
5. **Backend validates** token using Supabase JWKS endpoint
6. **User data** is fetched from `public.users` table

#### Auth Flow
```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@acme.com',
  password: 'ChangeThisPassword123!'
});

// Get JWT token
const token = data.session?.access_token;

// Make authenticated API call
const response = await fetch('http://localhost:8080/api/users/email/admin@acme.com', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

#### Creating New Users

**Admin users can create new users via Admin Panel:**

1. Navigate to Admin Panel
2. Fill in user details + password
3. Backend creates user in **both**:
   - Supabase Auth (`auth.users`)
   - Application database (`public.users`)
4. User can immediately log in with credentials

---

## 👥 User Roles

### 🔴 Admin

**Capabilities:**
- ✅ Access Admin Panel
- ✅ Create organizations
- ✅ Create users (ADMIN or USER role)
- ✅ Switch between organizations
- ✅ View/manage any organization's data
- ✅ All USER capabilities

**UI Features:**
- "Admin" link in navigation
- Organization switcher
- User creation panel
- Can see all organizations

### 🔵 User

**Capabilities:**
- ✅ View/manage own organization's data
- ✅ Create and manage jobs
- ✅ Add and manage candidates
- ✅ Use Kanban pipeline
- ✅ Add notes and scorecards
- ❌ Cannot access Admin Panel
- ❌ Cannot create organizations
- ❌ Cannot create other users

**UI Features:**
- Standard navigation
- Organization-scoped data
- Full candidate management

---

## 📁 Project Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx              # Main navigation with user menu
│   │   └── MainLayout.tsx          # App shell
│   ├── dashboard/
│   │   ├── StatsCard.tsx           # Statistics widgets
│   │   ├── ActiveApplications.tsx  # Recent applications
│   │   └── UpcomingMeetings.tsx    # Calendar view
│   ├── jobs/
│   │   ├── JobList.tsx             # Jobs grid
│   │   ├── JobCard.tsx             # Job display card
│   │   └── JobForm.tsx             # Create/edit job
│   ├── candidates/
│   │   ├── CandidateList.tsx       # Candidates grid
│   │   ├── CandidateCard.tsx       # Candidate display
│   │   ├── CandidateDetail.tsx     # Detail modal
│   │   ├── CandidateScorecard.tsx  # Rating system
│   │   └── CandidateNotes.tsx      # Notes management
│   ├── pipeline/
│   │   ├── KanbanBoard.tsx         # Main pipeline board
│   │   ├── KanbanColumn.tsx        # Status column
│   │   └── ApplicationCard.tsx     # Draggable card
│   └── admin/
│       ├── AdminPanel.tsx          # Admin dashboard
│       ├── UserCreateForm.tsx      # User creation
│       └── OrganizationForm.tsx    # Organization creation
├── pages/
│   ├── Login.tsx                   # Authentication page
│   ├── Dashboard.tsx               # Home dashboard
│   ├── Jobs.tsx                    # Jobs management
│   ├── Candidates.tsx              # Candidates management
│   ├── Pipeline.tsx                # Kanban board
│   └── AdminPanel.tsx              # Admin interface
├── contexts/
│   └── AuthContext.tsx             # Supabase auth + user state
├── lib/
│   └── supabase.ts                 # Supabase client
├── utils/
│   └── api.ts                      # API client wrapper
├── types/
│   └── index.ts                    # TypeScript types
├── App.tsx                         # App root with routing
└── main.tsx                        # Entry point
```

---

## 🔌 API Integration

### API Client
```typescript
// src/utils/api.ts
import { supabase } from '@/lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Get JWT token from Supabase
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });
  
  const result = await response.json();
  return result.data as T;
}

export const api = {
  get: <T>(endpoint: string) => apiCall<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) => 
    apiCall<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  // ... etc
};
```

### Usage Examples
```typescript
// Fetch candidates
const candidates = await api.get<Candidate[]>(
  `/candidates/organization/${orgId}`
);

// Create candidate
const newCandidate = await api.post<Candidate>('/candidates', {
  organizationId: orgId,
  fullName: 'Anna Andersson',
  email: 'anna@example.com',
  skills: ['React', 'TypeScript'],
  summary: 'Senior developer...'
});

// Update application status
await api.patch<Application>(`/applications/${id}/status`, {
  status: 'INTERVIEW'
});

// Create scorecard
await api.post<Scorecard>('/scorecards', {
  candidateId: candidate.id,
  technicalSkills: 4,
  communication: 5,
  cultureFit: 4,
  experience: 3,
  leadership: 4
});
```

---

## 💻 Development

### Run Development Server
```bash
npm run dev
# Available at http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview  # Preview production build
```

### Code Quality
```bash
npm run lint           # ESLint
npm run type-check     # TypeScript
```

### Component Development Guidelines

**Best Practices:**
1. ✅ Use TypeScript for all components
2. ✅ Keep components small and focused
3. ✅ Extract shared logic to custom hooks
4. ✅ Use Tailwind for styling (no CSS files)
5. ✅ Follow existing patterns

**Example Component:**
```typescript
interface CandidateCardProps {
  candidate: Candidate;
  onClick: (id: string) => void;
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(candidate.id)}
    >
      <h3 className="font-semibold text-lg">{candidate.fullName}</h3>
      <p className="text-gray-600 text-sm">{candidate.email}</p>
      <div className="flex gap-2 mt-2">
        {candidate.skills.map(skill => (
          <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
```

---

## 🎨 Design System

### Colors
```css
/* Primary Colors */
--primary-pink: #E91E63;
--primary-purple: #7B1FA2;
--primary-teal: #00BCD4;
--accent-yellow: #FFC107;

/* Neutrals */
--background: #FFFFFF;
--card-bg: #F5F5F5;
--text-primary: #212121;
--text-secondary: #757575;

/* Status Colors */
--status-new: #4CAF50;
--status-screening: #2196F3;
--status-interview: #FF9800;
--status-offer: #9C27B0;
--status-rejected: #F44336;
```

### Typography
```css
/* Headings */
font-family: 'Inter', sans-serif;
--h1: 2rem (32px)
--h2: 1.5rem (24px)
--h3: 1.25rem (20px)

/* Body */
--body: 1rem (16px)
--small: 0.875rem (14px)
--tiny: 0.75rem (12px)
```

### Responsive Breakpoints
```css
/* Mobile First */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

---

## 🚢 Deployment

### Build
```bash
npm run build
# Output in dist/
```

### Deployment Platforms

#### **Lovable (Automatic)**

1. Push to GitHub
2. Lovable auto-deploys
3. Set environment variables in Lovable dashboard

#### **Vercel**
```bash
vercel
# Follow prompts
```

**Environment Variables:**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://your-backend-api.com/api
```

#### **Netlify**
```bash
netlify deploy --prod
```

---

## 🐛 Troubleshooting

### CORS Error

**Problem:** Cannot connect to backend

**Solution:** 
1. Check backend `.env` has frontend URL in `CORS_ALLOWED_ORIGINS`
2. Restart backend after changing CORS settings

### Authentication Error

**Problem:** 401 Unauthorized or JWT validation fails

**Solution:**
1. Check Supabase credentials in `.env.local`
2. Verify user exists in both `auth.users` AND `public.users`
3. Check backend JWT validation logs

### Empty Data

**Problem:** No jobs/candidates showing

**Solution:**
1. Verify backend is running on port 8080
2. Check organization ID matches
3. Verify user has correct organization_id

### Can't Create Users

**Problem:** Admin panel user creation fails with 400 error

**Solution:**
1. Ensure password field is filled (min 6 characters)
2. Check backend logs for specific error
3. Verify Supabase Service Role Key is configured

---

## 📖 Related Documentation

- **Backend README:** [mini-ATS/README.md](../mini-ATS/README.md)
- **Backend API Docs:** [mini-ATS/API_DOCUMENTATION.md](../mini-ATS/API_DOCUMENTATION.md)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)

---

## 🔄 Git Workflow

### Branches

**Main branches:**
- `main` - Production-ready code
- Feature branches for new work

**Completed features:**
- ✅ `candidate-detail-view` - Candidate modal with scorecard
- ✅ `integrate-supabase-auth` - Real Supabase authentication
- ✅ `admin-password-field` - Admin panel user creation

### Making Changes
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push to GitHub
git push origin feature/my-feature

# Merge when ready
git checkout main
git merge feature/my-feature
git push origin main
```

---

## 📄 License

MIT License

---

## 🙏 Acknowledgments

Built with:
- React & TypeScript
- Supabase for authentication
- Spring Boot backend
- Tailwind CSS for styling
- Love ❤️ and coffee ☕

---

**Questions or issues?** Open an issue on GitHub or contact the development team.
