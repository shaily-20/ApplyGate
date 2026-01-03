# ApplyGate

**ApplyGate** is a modern job application portal built with **React.js** on the frontend and **Express + SQLite** on the backend. It connects candidates with opportunities through a simple, structured application flow.

This repository contains both the **frontend** (Vite + React) and a **lightweight backend** (Express + better-sqlite3).

---

## Features

- User signup & login with **JWT authentication**  
- Support for **Employer** and **Job Seeker** roles  
- Job listings with **search, filters, and pagination**  
- Job posting and application workflows  
- Local **SQLite database** with seeded sample data  

---

## Repository Layout

```
/             --> Frontend (Vite + React)
/server       --> Backend (Express + SQLite)
```

---

## Prerequisites

- Node.js >= 18  
- npm (or yarn/pnpm)  

---

## Environment Variables

### Backend (`server/.env`)

```
PORT=5000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

### Frontend (`.env` or `.env.local` in project root)

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

> ⚠️ **Do not commit real secrets**. Use `.env.example` for sharing structure without secrets.

---

## Quick Start (Development)

### 1. Run the Frontend

```
# from the project root
npm install
npm run dev
```

Frontend URL: [http://localhost:5173](http://localhost:5173)

---

### 2. Run the Backend (in a separate terminal)

```
cd server
npm install
npm run dev   # uses nodemon
# or npm start for a one-time run
```

Backend API base: `http://localhost:5000/api`

---

### Test Accounts (Seeded)

- **Job Seeker:** `user@example.com` / `password123`  
- **Employer:** `employer@example.com` / `password123`  

---

## Stop the Project

- Press `Ctrl+C` in each terminal running a server.  
- Stop any background services with your OS process manager.

---

## Prepare for GitHub

- Ensure `.gitignore` includes:

```
node_modules/
.env
server/job-portal.db
server/allowSignup.json
.DS_Store
dist/
```

- Create `.env.example` files for frontend & backend with keys only (no secrets).  
- Remove any sensitive information from the repo history before pushing.

---

## Build for Production (Optional)

### Frontend (Vite)
```
npm run build
```

### Backend
Deploy the `/server` folder to your hosting environment.  
Ensure:
- `NODE_ENV=production`  
- `PORT` is set  

---

## Notes & Next Steps

- Consider moving from **file-based SQLite auth** to a **managed database** for production.  
- Configure **Google Sign-In** for production using `GOOGLE_CLIENT_ID`.  
- Add **CI/CD** with GitHub Actions to run lint/tests and build on push.

---

## License


This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.
