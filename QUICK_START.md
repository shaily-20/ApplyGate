# ⚡ Quick Start - Job Portal

## 30-Second Setup

### 1. Install Dependencies (Takes ~2 minutes)
```bash
npm install
cd server && npm install && cd ..
```

### 2. Start Services

**Terminal 1 - Backend:**
```bash
cd server && npm start
```
✅ Should show: `🚀 Server is running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ Should show: `➜  Local:   http://localhost:5173/`

### 3. Open Browser
Visit: **http://localhost:5173**

### 4. Test Login
```
Email: user@example.com
Password: password123
```

## ✨ That's It!

You now have a fully functional job portal with:
- ✅ User authentication (JWT tokens + password hashing)
- ✅ Job listings from MongoDB
- ✅ Job search and filters
- ✅ Apply for jobs feature
- ✅ Role-based access (Job Seeker/Employer)

## 🚀 Next Steps

1. Explore the UI - browse jobs, apply for positions
2. Create a new account with signup
3. Test employer account: `employer@example.com` / `password123`
4. Check browser console (F12) to see API calls
5. Review code in `src/` and `server/` directories

## 📚 Documentation

- **Detailed Setup**: See `INSTALLATION_GUIDE.md`
- **Features List**: See `FEATURES_SUMMARY.md`
- **Full Details**: See `README_SETUP.md`

## ⚙️ Environment Files

Both files are pre-configured but you can customize:

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:5000/api
```

**Backend** (`server/.env`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## 🆘 Troubleshooting

### Backend won't start?
```bash
# Check if port 5000 is in use
# Kill process: netstat -ano | findstr :5000

# Check MongoDB
# Make sure MongoDB is running (local or Atlas)
```

### Frontend shows "Failed to load jobs"?
```bash
# Backend not running?
# Check: http://localhost:5000/api/health
```

### CORS errors?
```bash
# Both servers must be running
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

## 🎯 Test Credentials

**Job Seeker**:
- Email: `user@example.com`
- Password: `password123`

**Employer**:
- Email: `employer@example.com`
- Password: `password123`

## 🔑 Key Technologies

```
Frontend: React 19 + Vite + React Router
Backend: Express.js + MongoDB + JWT
Auth: bcryptjs (password hashing) + JWT tokens
```

## 📊 Project Structure

```
Project Root
├── Do
├── eslint.config.js
├── FEATURES_SUMMARY.md
├── index.html
├── LICENSE
├── package.json
├── QUICK_START.md
├── README.md
├── vite.config.js
├── public/
├── server/
│   ├── db.js
│   ├── index.js
│   ├── mockDB.js
│   ├── package.json
│   ├── seedData.js
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Job.js
│   │   └── User.js
│   └── routes/
│       ├── auth.js
│       └── jobs.js
└── src/
    ├── App.css
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── assets/
    ├── components/
    │   ├── AIMatcher.jsx
    │   ├── Footer.css
    │   ├── Footer.jsx
    │   ├── GoogleSignIn.jsx
    │   ├── Hero.css
    │   ├── Hero.jsx
    │   ├── JobCard.css
    │   ├── JobCard.jsx
    │   ├── JobListings.css
    │   ├── JobListings.jsx
    │   ├── Navbar.css
    │   └── Navbar.jsx
    ├── contexts/
    │   └── AuthContext.jsx
    ├── pages/
    │   ├── Auth.css
    │   ├── HomePage.css
    │   ├── HomePage.jsx
    │   ├── JobDetail.css
    │   ├── JobDetail.jsx
    │   ├── Jobs.css
    │   ├── Jobs.jsx
    │   ├── Login.jsx
    │   ├── PostJob.css
    │   ├── PostJob.jsx
    │   └── Signup.jsx
    └── services/
        ├── api.js
        └── authService.js
```

## 🎓 What You Get

- Complete authentication system
- Production-ready API structure
- Secure password hashing
- Token-based authentication
- Full-stack job portal
- Sample data seeding
- Professional codebase

## 💻 Common Commands

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
npm start            # Start server
npm run dev          # Start with auto-reload (requires nodemon)

# MongoDB (if local)
mongosh              # Connect to local MongoDB
use job-portal       # Switch database
db.jobs.find()       # View jobs
```

## 🌐 Access Points

- **App**: http://localhost:5173
- **API**: http://localhost:5000/api
- **Health**: http://localhost:5000/api/health

## ✅ Verification Checklist

- [ ] Both servers started without errors
- [ ] Frontend loads at localhost:5173
- [ ] Can see job listings
- [ ] Can login with test credentials
- [ ] Can view job details
- [ ] Can apply for jobs
- [ ] Browser console shows no errors

## 🚀 Production Ready

The application includes:
- ✅ Secure password hashing
- ✅ JWT authentication
- ✅ Error handling
- ✅ Input validation
- ✅ CORS protection
- ✅ Responsive design
- ✅ Clean code structure

Ready to extend with more features!

---

**Questions?** Check the detailed guides or review the code comments.

**Happy job hunting! 🎉**
