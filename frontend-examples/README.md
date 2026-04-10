# Banking System Frontend (Vite + React)

Complete, working React (Vite) frontend fully integrated with Spring Boot backend at `http://localhost:8080`.

## Files Included

```
src/
├── api.js                 # Axios client (auto Bearer token, 401 handling)
├── auth.js                # Session management (localStorage)
├── App.jsx                # Router setup
├── Login.jsx              # Login form
├── Login.css              # Login styles
├── ProtectedRoute.jsx     # Role-based route protection
├── main.jsx               # React entry point
├── ui.js                  # Shared UI styles
└── components/
    ├── AdminDashboard.jsx # Admin: manage tellers (CRUD)
    ├── ClientDashboard.jsx # Client: accounts, cards, transfer
    └── TellerDashboard.jsx # Teller: manage clients, approve requests
```

## Quick Setup

### 1. Copy files to your Vite React app

```bash
# From this frontend-examples folder, copy:
src/                     → your-react-app/src/
src/components/          → your-react-app/src/components/
src/Login.css           → your-react-app/src/Login.css
```

### 2. Install dependencies

```bash
npm install
npm install axios react-router-dom
```

### 3. Start dev server

```bash
npm run dev
```

The app will run at `http://localhost:5173` (Vite default).

### 4. Backend requirement

Ensure your Spring Boot backend is running:
- Base URL: `http://localhost:8080`
- CORS configured for `http://localhost:5173` ✅ (already done in `SecurityConfig.java`)

## Architecture

### API Client (`src/api.js`)
- Creates axios instance pointing to `http://localhost:8080`
- **Request interceptor:** Automatically attaches `Authorization: Bearer <token>` from `localStorage`
- **Response interceptor:** On 401/403, clears session and redirects to `/login`

### Auth Management (`src/auth.js`)
- Stores token, role, and username in `localStorage`
- Functions: `setSession()`, `getToken()`, `getRole()`, `getUsername()`, `getSession()`, `clearSession()`

### Login Flow
1. User submits username/password
2. Backend returns `{ token, role }`
3. **`LoginRequest` → `POST /auth/login`**
4. Token stored in localStorage, user redirected to dashboard

### Protected Routes (`src/ProtectedRoute.jsx`)
- Checks token and role before rendering component
- If role not in allowed list, redirects to login
- Each dashboard (Admin/Client/Teller) is wrapped with `<ProtectedRoute allowed={["ROLE"]}>`

### Dashboards
- **AdminDashboard:** Create, update password, delete tellers (`/admin/tellers` CRUD)
- **ClientDashboard:** View accounts/cards/transactions, request accounts, transfer money
- **TellerDashboard:** Manage clients, approve/reject account requests, approve credit cards

## API Endpoints Used

All endpoints are called via the `api` client (axios) which auto-attaches JWT token.

### Auth
- `POST /auth/login` — login (no auth required)
- `POST /auth/register-client` — register client (no auth required)

### Admin
- `GET /admin/tellers` — list tellers (admin only)
- `POST /admin/tellers` — create teller (admin only)
- `PUT /admin/tellers/{id}/password` — update teller password (admin only)
- `DELETE /admin/tellers/{id}` — delete teller (admin only)

### Client
- `GET /client/accounts` — list my accounts
- `POST /client/accounts/request` — request new current account
- `GET /client/cards` — list my cards
- `POST /client/cards/debit/request` — request debit card
- `POST /client/cards/credit/request` — request credit card
- `GET /client/transactions` — list my transactions
- `POST /client/transactions/transfer` — transfer money

### Teller
- `GET /teller/clients` — list all clients (teller only)
- `POST /teller/clients` — create client (teller only)
- `PUT /teller/clients/{id}/password` — update client password (teller only)
- `DELETE /teller/clients/{id}` — delete client (teller only)
- `GET /teller/accounts` — list all accounts (teller only)
- `POST /teller/accounts/{id}/approve` — approve account request (teller only)
- `POST /teller/accounts/{id}/reject` — reject account request (teller only)
- `GET /teller/transactions` — list all transactions (teller only)
- `POST /teller/cards/{id}/approve-credit` — approve credit card (teller only)

## Error Handling

- **400 Bad Request:** Invalid input (missing fields, constraints violated)
- **401 Unauthorized:** Invalid credentials or expired token → clear session, redirect to login
- **403 Forbidden:** Access denied (wrong role) → redirect to login
- **500 Server Error:** Backend error

All errors are caught and displayed as toast notifications in dashboards (see `show()` function).

## Key Features

✅ JWT Bearer token auto-attached to all requests  
✅ Session persistence (localStorage)  
✅ Role-based route protection  
✅ Automatic 401 redirect to login  
✅ Toast notifications for feedback  
✅ Responsive UI (Tailwind-inspired styles)  
✅ Search/filter functionality  
✅ CRUD operations (Create, Read, Update, Delete)  
✅ Clean, reusable component structure  

## Testing the App

### Admin User
- Login: username `admin`, password `123456`
- Access: `/admin` dashboard
- Actions: Manage tellers

### Teller User
- Login: username `teller1`, password `123456` (if seeded)
- Access: `/teller` dashboard
- Actions: Manage clients, approve requests

### Client User
- Login: username `client1`, password `123456` (if seeded)
- Access: `/client` dashboard
- Actions: View accounts, request accounts, transfer money

## Notes

- Passwords are **hashed** in backend (BCrypt), never stored in plain text
- All sensitive operations require proper authentication
- CORS is configured in `SecurityConfig.java` (backend) for `http://localhost:5173`
- No changes to backend business logic — integration layer only

---

Happy banking! 🏦
