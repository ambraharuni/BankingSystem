# 🚀 Ready to Run - Final Steps

Your **complete Banking System** is now fully integrated. Here's what was set up:

---

## ✅ What's Installed

### Backend (Spring Boot) ✓
- Located in: `c:\Projects\BankingSystem\src\`
- Running on: `http://localhost:8080`
- CORS enabled for frontend
- JWT token authentication
- REST API ready

### Frontend (React + Vite) ✓
- Located in: `c:\Projects\BankingSystem\frontend\`
- Running on: `http://localhost:5173`
- Auto-bearer token attachment
- Protected routes by role
- Three role-based dashboards (Admin, Client, Teller)
- Error handling & session management

---

## 🎯 Run the Application RIGHT NOW

### Step 1: Open Terminal 1
```bash
cd c:\Projects\BankingSystem
run-backend.bat
```
**Wait for message:** `Started BankingSystemApplication`

### Step 2: Open Terminal 2
```bash
cd c:\Projects\BankingSystem
run-frontend.bat
```
**Wait for message:** `VITE v... ready in ... ms`

### Step 3: Open Browser
```
http://localhost:5173
```

---

## 🔑 Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `123456` |
| Teller | `teller1` | `123456` |
| Client | `client1` | `123456` |

---

## 🎮 What You Can Do

### As Admin (🏦)
- Create, edit, delete tellers
- Manage all teller passwords
- Search tellers by ID/username

### As Teller (🧾)
- Create, edit, delete clients
- Approve/reject account requests
- Approve credit cards (set interest rate)
- View all transactions and accounts

### As Client (💳)
- View my accounts and balance
- Request new accounts/cards
- Transfer money between accounts
- View transaction history

---

## 📂 File Structure Created

```
BankingSystem/
├── frontend/                          ← NEW: Full React app
│   ├── src/
│   │   ├── api.js                     ← Axios client
│   │   ├── auth.js                    ← Session management
│   │   ├── App.jsx                    ← Router
│   │   ├── Login.jsx                  ← Login form
│   │   └── components/
│   │       ├── AdminDashboard.jsx
│   │       ├── ClientDashboard.jsx
│   │       └── TellerDashboard.jsx
│   ├── package.json                   ← Dependencies
│   ├── vite.config.js                 ← Vite config
│   └── index.html
│
├── run-backend.bat                    ← ONE-CLICK START Backend
├── run-frontend.bat                   ← ONE-CLICK START Frontend
├── INTEGRATION_GUIDE.md               ← Full documentation
└── (existing backend code)
```

---

## 🔗 Integration Points

✅ **CORS:** Backend allows `http://localhost:5173`  
✅ **API:** Frontend calls `http://localhost:8080`  
✅ **Auth:** JWT token auto-attached to requests  
✅ **Session:** Token stored in browser localStorage  
✅ **Errors:** 401→redirect to login, 403→deny access  

---

## 🆘 Common Issues & Fixes

### "Port already in use"
```bash
# Find what's using port 8080 or 5173, or change vite.config.js
```

### "npm not found"
```bash
# Install Node.js from nodejs.org
```

### "mvn not found"
```bash
# Java comes with Maven, check JAVA_HOME environment variable
```

### "Page blank / not loading"
```bash
# Check both terminals are running
# Check browser console (F12) for errors
```

---

## 📚 More Help

- Full guide: `c:\Projects\BankingSystem\INTEGRATION_GUIDE.md`
- Backend code: `c:\Projects\BankingSystem\src\main\java\...`
- Frontend code: `c:\Projects\BankingSystem\frontend\src\...`

---

## ⚡ Quick Commands

```bash
# Start both in separate terminals:
run-backend.bat      # Terminal 1
run-frontend.bat     # Terminal 2

# Or manually:
mvn clean spring-boot:run                    # Terminal 1
cd frontend && npm install && npm run dev    # Terminal 2

# Build for production:
npm run build        # In frontend folder
```

---

## ✨ You're All Set!

Everything is connected and ready to go. Just run both batch files and visit **http://localhost:5173** 🚀

**Good luck!**
