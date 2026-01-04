# ApplyGate

**ApplyGate** is a modern job application platform built with **React.js** on the frontend and **Express with SQLite** on the backend. It enables structured interactions between candidates and employers through a role-based application workflow.

The repository includes both the **Vite + React frontend** and a **lightweight Express backend** powered by `better-sqlite3`.

---

## Tech Stack

### Frontend
- React.js (Vite)
- JWT-based authentication
- Role-based routing

### Backend
- Node.js + Express
- SQLite (`better-sqlite3`)
- JWT authentication
- RESTful APIs

---

## Core Features

- Secure user authentication with **JWT**
- Distinct roles: **Employer** and **Job Seeker**
- Job listings with search, filters, and pagination
- Job posting and application management
- Seeded SQLite database for development and testing

---

## Project Structure

```

/
├── src/            # Frontend (Vite + React)
├── server/         # Backend (Express + SQLite)
└── README.md

```

---

## Environment Configuration

### Backend (`server/.env`)

```

PORT=5000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id

```

### Frontend (`.env` or `.env.local`)

```

VITE_API_URL=[http://localhost:5000/api](http://localhost:5000/api)

````

---

## Getting Started (Development)

### 1. Start the Frontend

```bash
npm install
npm run dev
````

Frontend runs at:
`http://localhost:5173`

---

### 2. Start the Backend

```bash
cd server
npm install
npm run dev   # nodemon
# or
npm start
```

API base URL:
`http://localhost:5000/api`

---

## Test Credentials (Seeded Data)

* **Job Seeker**
  `user@example.com` / `password123`

* **Employer**
  `employer@example.com` / `password123`

---

## GitHub Preparation

Ensure the following entries exist in `.gitignore`:

```
node_modules/
.env
server/job-portal.db
server/allowSignup.json
.DS_Store
dist/
```

Recommended:

* Add `.env.example` files for frontend and backend
* Remove sensitive data from commit history before pushing

---

## Production Build (Optional)

### Frontend

```bash
npm run build
```

### Backend

Deploy the `/server` directory with:

* `NODE_ENV=production`
* Proper `PORT` configuration

---

## Live Demo

Frontend deployment (Vercel):
**Status:** In progress

🔗 [https://applygate-git-main-shaily-20s-projects.vercel.app](https://applygate-git-main-shaily-20s-projects.vercel.app)

---

## Future Enhancements

* Migrate from SQLite to a managed database for scalability
* Enable Google Sign-In for production
* Add CI/CD with GitHub Actions
* Improve validation and test coverage

---

## License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.


