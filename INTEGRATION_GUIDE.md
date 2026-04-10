# 🏦 Banking System - Complete Integration Guide

Your React (Vite) frontend is **fully integrated** with the Spring Boot backend. Here's how to use it.

---

## 📋 Prerequisites

Make sure you have installed:
- **Java 17+** (Maven comes with it)
- **Node.js 16+** (npm)

Verify installations:
```bash
java -version
npm -v
```

---

## 🚀 Quick Start (Fastest Way)

### Option 1: Run in Two Separate Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd c:\Projects\BankingSystem
run-backend.bat
```

**Terminal 2 - Frontend:**
```bash
cd c:\Projects\BankingSystem
run-frontend.bat
```

Then open browser: **http://localhost:5173**

### Option 2: Manual Commands

**Terminal 1 - Backend:**
```bash
cd c:\Projects\BankingSystem
mvn clean spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd c:\Projects\BankingSystem\frontend
npm install
npm run dev
```

---

## 🔑 Test Credentials

Once everything is running, use these accounts to log in:

### Admin Account
- **Username:** `admin`
- **Password:** `123456`
- **Accessible:** http://localhost:5173/admin

### Teller Account (if seeded in DB)
- **Username:** `teller1`
- **Password:** `123456`
- **Accessible:** http://localhost:5173/teller

### Client Account (if seeded in DB)
- **Username:** `client1`
- **Password:** `123456`
- **Accessible:** http://localhost:5173/client

---

## 📁 Project Structure

```
BankingSystem/
├── backend/
│   ├── src/main/java/...           (Spring Boot code)
│   ├── pom.xml                      (Maven config)
│   └── run-backend.bat              (Start script)
│
├── frontend/                         (React Vite app)
│   ├── src/
│   │   ├── api.js                   (Axios client)
│   │   ├── auth.js                  (Session management)
│   │   ├── App.jsx                  (Router)
│   │   ├── Login.jsx                (Login page)
│   │   └── components/
│   │       ├── AdminDashboard.jsx   (Admin panel)
│   │       ├── ClientDashboard.jsx  (Client portal)
│   │       └── TellerDashboard.jsx  (Teller portal)
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── run-backend.bat                  (Start backend)
├── run-frontend.bat                 (Start frontend)
└── README.md                        (This file)
```

---

## 🔌 How the Integration Works

### API Flow
1. **Frontend** sends request to `http://localhost:8080` (backend)
2. **Axios interceptor** auto-attaches `Authorization: Bearer <token>`
3. **Backend** validates token, processes request, returns JSON
4. **Frontend** displays data in React components

### Authentication
- User logs in → `POST /auth/login`
- Backend returns `{ token, role }`
- Token stored in `localStorage`
- Auto-attached to all subsequent requests
- On 401/403: Clear session → Redirect to login

### CORS Configured
✅ Backend allows origin: `http://localhost:5173`  
✅ All HTTP methods: GET, POST, PUT, DELETE  
✅ Authorization header included

---

## ✨ Features by Role

### Admin Dashboard (🏦)
- ✅ Create tellers
- ✅ Update teller passwords
- ✅ Delete tellers
- ✅ Search/filter tellers

### Teller Dashboard (🧾)
- ✅ Create clients
- ✅ Update client passwords
- ✅ Delete clients
- ✅ View all accounts
- ✅ Approve/reject account requests
- ✅ Approve credit cards (set interest %)
- ✅ View all transactions

### Client Dashboard (💳)
- ✅ View my accounts
- ✅ Request new account
- ✅ View my cards
- ✅ Request debit/credit cards
- ✅ View transactions
- ✅ Make transfers

---

## 🔧 Troubleshooting

### Frontend won't start (npm errors)
```bash
cd frontend
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Backend won't start (Maven errors)
```bash
mvn clean
mvn spring-boot:run
```

### Port 5173 already in use
Edit `frontend/vite.config.js`:
```javascript
server: {
  port: 3000,  // Change to any free port
}
```

### Port 8080 already in use
Edit `src/main/resources/application.properties`:
```properties
server.port=9090
```

Then update `frontend/src/api.js`:
```javascript
baseURL: "http://localhost:9090"
```

### CORS errors in browser console
- Ensure backend is running on `http://localhost:8080`
- Check `SecurityConfig.java` has CORS configured
- Check frontend `src/api.js` has correct baseURL

### Login fails with "Invalid credentials"
- Check username/password is correct (case-sensitive)
- Make sure backend is running and connected
- Check browser console for error messages

---

## 📊 Backend API Endpoints

All endpoints require JWT token (auto-attached by frontend).

### Authentication (No Auth Required)
- `POST /auth/login` — Login
- `POST /auth/register-client` — Register client

### Admin
- `GET /admin/tellers` — List all tellers
- `POST /admin/tellers` — Create teller
- `PUT /admin/tellers/{id}/password` — Update password
- `DELETE /admin/tellers/{id}` — Delete teller

### Client
- `GET /client/accounts` — My accounts
- `POST /client/accounts/request` — Request account
- `GET /client/cards` — My cards
- `POST /client/cards/debit/request` — Request debit card
- `POST /client/cards/credit/request` — Request credit card
- `GET /client/transactions` — My transactions
- `POST /client/transactions/transfer` — Transfer money

### Teller
- `GET /teller/clients` — All clients
- `POST /teller/clients` — Create client
- `PUT /teller/clients/{id}/password` — Update password
- `DELETE /teller/clients/{id}` — Delete client
- `GET /teller/accounts` — All accounts
- `POST /teller/accounts/{id}/approve` — Approve account
- `POST /teller/accounts/{id}/reject` — Reject account
- `GET /teller/transactions` — All transactions
- `POST /teller/cards/{id}/approve-credit` — Approve credit card

---

## 📝 Default Test Data

If backend includes a seed service, these users should be available:
- `admin` / `123456` — Admin role
- `teller1` / `123456` — Teller role
- `client1` / `123456` — Client role

---

## 🛑 Stopping the Application

- **Backend:** Press `Ctrl+C` in terminal
- **Frontend:** Press `Ctrl+C` in terminal

---

## 🆘 Need Help?

1. Check browser console (F12) for errors
2. Check terminal output for backend/frontend errors
3. Verify ports 5173 (frontend) and 8080 (backend) are available
4. Ensure Java and Node.js are installed

---

## ✅ Quick Checklist

Before running:
- [ ] Java installed (`java -version`)
- [ ] Node.js installed (`npm -v`)
- [ ] Backend code in `src/main/java/...`
- [ ] Frontend code in `frontend/src/...`
- [ ] CORS configured in backend
- [ ] API baseURL correct in `frontend/src/api.js`

---

**Happy Banking! 🏦💰**
