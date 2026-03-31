# SmartHire AI

An AI-powered resume analyzer and smart hiring platform built for students, job seekers, and recruiters.

![SmartHire AI](frontend/public/logo.png)

## Live Demo

- **Frontend:** [Vercel Deployment](https://smarthire-ai.vercel.app)
- **Backend API:** [Render Deployment](https://smarthire-ai-1-3atf.onrender.com)

---

## Features

- **AI Resume Analysis** — Deep NLP to extract skills, experience, and format automatically
- **ATS Score Generation** — Instant ATS score evaluating readability, structure, and job relevance
- **Skill Gap Identification** — Highlights missing skills and keywords needed to improve applications
- **Smart Job Matching** — Compares candidate profiles against active job listings with high accuracy
- **Recruiter Dashboard** — Post jobs, view applicants, rank candidates by ATS match score
- **Candidate Dashboard** — Upload resume, apply to jobs, track application status

---

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- pdf-parse + mammoth (resume parsing)
- Google Gemini 1.5 Flash (AI analysis)

---

## Project Structure

```
SmartHire-AI/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Navbar, Footer, Logo, Dashboard components
│   │   ├── pages/        # Home, Login, Register, Dashboard, Demo
│   │   └── api.js        # Axios API client
│   └── public/           # Static assets (bg.jpg, logo.png, favicon.svg)
│
├── backend/           # Express API server
│   ├── controllers/      # Auth, Resume, Job, Application, Demo
│   ├── middleware/        # Auth & Role middleware
│   ├── models/           # User, Resume, Job, Application, MatchResult
│   ├── routes/           # API routes
│   ├── utils/            # Gemini AI, NLP, Match utilities
│   └── server.js         # Entry point
│
├── vercel.json        # Vercel deployment config
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=development
PORT=5001
```

```bash
node server.js
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=/api
```

```bash
npm run dev
```

---

## Deployment

### Frontend → Vercel
- Connect GitHub repo
- Root directory: ` ` (blank)
- `vercel.json` handles build config and API proxy to Render

### Backend → Render
- Connect GitHub repo
- Root directory: `backend`
- Build command: `npm install`
- Start command: `node server.js`
- Add env variables: `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `NODE_ENV=production`

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/resume/upload` | Upload resume | User |
| GET | `/api/resume/mine` | Get my resume | User |
| GET | `/api/jobs` | List all jobs | Auth |
| POST | `/api/jobs` | Create job | Recruiter |
| POST | `/api/applications/:jobId` | Apply to job | User |
| GET | `/api/applications/my` | My applications | User |
| POST | `/api/demo/analyze` | Demo ATS analysis | Public |

---

## Built By

**Rahul Dhakad** — Built with ❤️ using React, Node.js, and Google Gemini AI
