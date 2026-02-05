# Mini-ATS - Frontend

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff.svg)](https://vitejs.dev/)

> Modern, Teamtailor-inspired recruitment platform frontend built with React and TypeScript. Features a drag-and-drop Kanban board for candidate pipeline management.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [User Roles](#user-roles)
- [Development](#development)

---

## 🎯 Overview

The Mini-ATS frontend provides an intuitive interface for recruitment teams to manage their hiring pipeline. Built with React and TypeScript, it connects to a Spring Boot backend via REST API.

### Demo Credentials

**Admin User:**
```
Email: admin@acme.com
Password: admin123
```

**Regular User:**
```
Email: user@acme.com
Password: user123
```

---

## ✨ Features

### Dashboard
- Welcome greeting with user info
- Active applications widget
- Career statistics
- Internal jobs listing
- Upcoming meetings calendar

### Jobs Management
- Create and edit job postings
- Filter by status (ACTIVE/CLOSED/DRAFT)
- Search by title
- View application statistics

### Candidates Management
- Add candidates with LinkedIn profiles
- Search by name
- Grid/list view
- Contact information display

### Kanban Pipeline (Main Feature)
- **5 columns**: NEW → SCREENING → INTERVIEW → OFFER + REJECTED
- Drag-and-drop to move candidates
- Filter by job
- Search by candidate name
- Click card for detailed view
- Real-time statistics

### Admin Panel (Admin Only)
- Create organizations
- Create user accounts (ADMIN or USER)
- Switch between organizations
- Manage multiple tenants

---

## 🛠️ Tech Stack

### Core
- **Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3

### Key Libraries
- **Routing**: React Router
- **State**: React Context API
- **HTTP**: Fetch API
- **Forms**: React Hook Form
- **Drag & Drop**: @dnd-kit or react-beautiful-dnd
- **Icons**: Lucide React

### Development
- **Code Quality**: ESLint, Prettier
- **Type Checking**: TypeScript strict mode

---

## 🚀 Getting Started

### Prerequisites

```bash
node -v    # Node 18+
npm -v     # npm 9+
```

### Installation

1. **Backend Setup**

Ensure backend is running:
```bash
cd mini-ats-backend
mvn spring-boot:run
# Backend available at http://localhost:8080/api
```

2. **Frontend Setup**

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend available at: `http://localhost:5173`

### Environment Variables

Create `.env` file:
```bash
VITE_API_URL=http://localhost:8080/api
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── GreetingCard.tsx
│   │   ├── StatsCard.tsx
│   │   ├── ActiveApplications.tsx
│   │   └── UpcomingMeetings.tsx
│   ├── Jobs/
│   │   ├── JobList.tsx
│   │   ├── JobCard.tsx
│   │   └── JobForm.tsx
│   ├── Candidates/
│   │   ├── CandidateList.tsx
│   │   ├── CandidateCard.tsx
│   │   └── CandidateForm.tsx
│   ├── Kanban/
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── ApplicationCard.tsx
│   │   └── KanbanStats.tsx
│   ├── Admin/
│   │   ├── AdminPanel.tsx
│   │   ├── CreateOrganization.tsx
│   │   ├── CreateUser.tsx
│   │   └── OrganizationSwitcher.tsx
│   └── Layout/
│       ├── TopNav.tsx
│       ├── UserDropdown.tsx
│       └── Navigation.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Jobs.tsx
│   ├── Candidates.tsx
│   ├── Pipeline.tsx
│   └── AdminPanel.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── OrganizationContext.tsx
├── hooks/
│   ├── useApi.ts
│   ├── useKanban.ts
│   └── useJobs.ts
├── utils/
│   ├── api.ts
│   └── formatters.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

---

## 🔌 API Integration

### API Client

```typescript
// src/utils/api.ts
const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    const result = await response.json();
    return result.data; // Extract data from standard response
  },
  
  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result.data;
  },
  // ... patch, put, delete
};
```

### Example Usage

```typescript
// Fetch Kanban board
const applications = await api.get(`/applications/organization/${orgId}`);

// Create candidate
const newCandidate = await api.post('/candidates', {
  organizationId: orgId,
  fullName: 'Anna Andersson',
  email: 'anna@example.com',
  linkedinUrl: 'https://linkedin.com/in/anna',
});

// Move application
await api.patch(`/applications/${id}/status`, {
  status: 'INTERVIEW',
  notes: 'Scheduled for technical interview',
});
```

---

## 👥 User Roles

### Admin
**Capabilities:**
- ✅ Access Admin Panel
- ✅ Create organizations
- ✅ Create users (ADMIN or USER)
- ✅ Switch between organizations
- ✅ View/manage any organization's data
- ✅ All USER capabilities

**UI Differences:**
- "Admin" link in navigation
- Organization switcher in Admin Panel
- Can see all organizations

### User
**Capabilities:**
- ✅ View/manage own organization's data
- ✅ Create jobs
- ✅ Add candidates
- ✅ Manage Kanban pipeline
- ❌ Cannot access Admin Panel
- ❌ Cannot create organizations
- ❌ Cannot switch organizations

**UI Differences:**
- No "Admin" link
- Cannot see other organizations
- Standard user view only

---

## 💻 Development

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

### Code Quality

```bash
npm run lint     # ESLint
npm run type-check  # TypeScript
```

### Component Development

**Guidelines:**
- Use TypeScript for all components
- Keep components small and focused
- Extract shared logic to custom hooks
- Use Tailwind for styling (no CSS files)
- Follow existing design patterns

**Example Component:**

```typescript
interface JobCardProps {
  job: Job;
  onEdit: (id: string) => void;
}

export function JobCard({ job, onEdit }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-bold text-lg">{job.title}</h3>
      <p className="text-gray-600">{job.department}</p>
      <button 
        onClick={() => onEdit(job.id)}
        className="mt-2 px-4 py-2 bg-pink-500 text-white rounded"
      >
        Edit
      </button>
    </div>
  );
}
```

---

## 🎨 Design System

### Colors

```css
Primary Pink: #E91E63
Purple: #7B1FA2
Teal: #00BCD4
Yellow: #FFC107
Background: #FFFFFF
Cards: #F5F5F5
Text: #212121
```

### Components

- **Cards**: Rounded corners (8-12px), subtle shadows
- **Buttons**: Pink primary, rounded, hover effects
- **Inputs**: Clean borders, focus states
- **Kanban**: Column backgrounds match status colors

### Responsive Breakpoints

```css
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
```

---

## 🔒 Authentication

### Current Implementation

**Hardcoded Users** (Development):
- Users stored in `AuthContext`
- Login validates against hardcoded list
- Session stored in `localStorage`

### Login Flow

1. User enters email/password
2. Validated against `USERS` array
3. On success: Store in `localStorage`, redirect
4. On fail: Show error message

### Production Recommendation

See backend `JWT_AUTH_GUIDE.md` for:
- Supabase Auth integration
- JWT token handling
- Secure session management

---

## 🚢 Deployment

### Build

```bash
npm run build
# Output in dist/
```

### Platforms

**Lovable** (Automatic):
- Push to GitHub
- Lovable auto-deploys

**Vercel**:
```bash
vercel
```

**Netlify**:
```bash
netlify deploy --prod
```

### Environment Variables

Set in platform dashboard:
```bash
VITE_API_URL=https://your-backend-api.com/api
```

---

## 🐛 Troubleshooting

### CORS Error
**Problem**: Cannot connect to backend  
**Solution**: Ensure backend `.env` has frontend URL in `CORS_ALLOWED_ORIGINS`

### Empty Data
**Problem**: No jobs/candidates showing  
**Solution**: Check backend is running, verify organization ID

### Login Not Working
**Problem**: Cannot login  
**Solution**: Verify credentials match hardcoded users in `AuthContext`

---

## 📖 Documentation

- **Backend README**: ../mini-ats-backend/README.md
- **API Documentation**: ../mini-ats-backend/API_DOCUMENTATION.md
- **Integration Guide**: ../mini-ats-backend/INTEGRATION_GUIDE.md

---

## 📄 License

MIT License

---

**Built with ❤️ using React and TypeScript**
