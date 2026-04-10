# Banking System

A full-stack banking application featuring role-based access control, built with Spring Boot (backend) and React + Vite (frontend).

## Overview

This system provides a complete banking platform with three distinct user roles:
- **Admin**: System administration and teller management
- **Teller**: Client account and transaction management
- **Client**: Account access and banking operations

## Tech Stack

### Backend
- Java 17
- Spring Boot 4.0.3
- Spring Security with JWT authentication
- Spring Data JPA
- MySQL Database
- Maven

### Frontend
- React 18
- Vite
- React Router
- Axios

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL Server
- Maven (included via wrapper)

## Quick Start

### Step 1: Start Backend
```bash
cd c:\Projects\BankingSystem
run-backend.bat
```

### Step 2: Start Frontend (in new terminal)
```bash
cd c:\Projects\BankingSystem
run-frontend.bat
```

### Step 3: Access Application
Open browser and navigate to: `http://localhost:5173`

## Credentials

| Role   | Username | Password |
|--------|----------|----------|
| Admin  | admin    | 123456   |
| Teller | teller1  | 123456   |
| Client | client1  | 123456   |

## Project Structure

```
BankingSystem/
├── src/                    ← Backend (Spring Boot)
├── frontend/               ← Frontend (React + Vite)
├── run-backend.bat         ← Start backend
├── run-frontend.bat        ← Start frontend
└── README.md
```

## Features

### Admin Dashboard
- Create and manage teller accounts
- Modify teller credentials
- System overview

### Teller Dashboard
- Create and manage client accounts
- Approve/reject account requests
- Process credit card approvals
- View and manage transactions

### Client Dashboard
- View account information and balance
- Request new accounts
- Request credit/debit cards
- Transfer funds between accounts
- View transaction history

## Documentation

- [Backend Setup](src/README.md)
- [Frontend Setup](frontend/README.md)
```

### Manual Testing
1. Start both backend and frontend
2. Login with test accounts
3. Test role-specific features:
   - Admin: Create/manage tellers
   - Teller: Approve client requests
   - Client: View accounts, make transfers

## 📁 Project Structure

```
BankingSystem/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── api.js             # Axios configuration
│   │   ├── auth.js            # Authentication utilities
│   │   └── App.jsx            # Main app component
│   ├── package.json
│   └── vite.config.js
├── src/                        # Spring Boot backend
│   ├── main/java/...          # Java source code
│   └── test/java/...          # Unit tests
├── pom.xml                    # Maven configuration
├── run-backend.bat            # Backend startup script
├── run-frontend.bat           # Frontend startup script
└── README.md                  # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Admin Endpoints
- `GET /api/admin/tellers` - List all tellers
- `POST /api/admin/tellers` - Create teller
- `PUT /api/admin/tellers/{id}` - Update teller
- `DELETE /api/admin/tellers/{id}` - Delete teller

### Teller Endpoints
- `GET /api/teller/clients` - List clients
- `POST /api/teller/clients` - Create client
- `GET /api/teller/accounts/pending` - Pending account requests
- `POST /api/teller/accounts/{id}/approve` - Approve account

### Client Endpoints
- `GET /api/client/accounts` - User's accounts
- `POST /api/client/accounts` - Request new account
- `POST /api/client/transfer` - Transfer money
- `GET /api/client/transactions` - Transaction history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

- Backend uses H2 in-memory database (data resets on restart)
- CORS is configured for frontend development
- JWT tokens are stored in localStorage
- Error handling includes both client and server validation

## 📄 License

This project is for educational purposes. See individual component licenses for details.

## 🆘 Troubleshooting

### Backend Issues
- Ensure Java 17+ is installed
- Check port 8080 is available
- View logs in terminal for errors

### Frontend Issues
- Ensure Node.js 16+ is installed
- Run `npm install` in frontend directory
- Check port 5173 is available
- Clear browser cache if login issues occur

### Common Errors
- **"mvn not recognized"**: Use `.\mvnw.cmd` instead
- **"npm not found"**: Install Node.js from nodejs.org
- **Port conflicts**: Change ports in application.properties or vite.config.js