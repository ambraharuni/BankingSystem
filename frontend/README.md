# Banking System - Frontend

React-based frontend for the Banking System application, built with Vite for optimal development experience.

## Overview

This frontend provides a responsive user interface for three distinct user roles:
- **Admin**: Teller management interface
- **Teller**: Account and transaction management
- **Client**: Account access and banking operations

## Technology

- React 18 with Hooks
- Vite 5 (build tool and dev server)
- React Router 6 (client-side routing)
- Axios (HTTP client)
- CSS (styling)

## Prerequisites

- Node.js 16 or higher
- npm 7 or higher
- Backend API running on `http://localhost:8080`

## Installation

```bash
cd frontend
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Create a production build:

```bash
npm run build
```

## Preview

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── api.js              ← Axios HTTP client configuration
│   ├── auth.js             ← Authentication and session management
│   ├── App.jsx             ← Main router component
│   ├── Login.jsx           ← Login form
│   ├── Login.css           ← Login styles
│   ├── ProtectedRoute.jsx  ← Role-based route protection
│   ├── ui.js               ← UI utility functions
│   ├── main.jsx            ← Application entry point
│   └── components/
│       ├── AdminDashboard.jsx    ← Admin interface
│       ├── ClientDashboard.jsx   ← Client interface
│       └── TellerDashboard.jsx   ← Teller interface
├── index.html              ← HTML template
├── package.json
├── vite.config.js
└── README.md
```

## Features

### Authentication
- JWT-based authentication
- Automatic token attachment to API requests
- Session persistence
- Automatic logout on token expiration

### Role-Based Access Control
- Protected routes by user role
- Dashboard specific to each role
- Automatic redirection for unauthorized access

### Admin Features
- Create teller accounts
- Edit teller credentials
- Delete tellers
- Search tellers

### Teller Features
- Create client accounts
- Edit client information
- Delete clients
- View client accounts
- Approve/reject account requests
- Approve credit card requests
- View transaction history

### Client Features
- View account details
- Check account balance
- Request new accounts
- Request credit/debit cards
- Transfer money to other accounts
- View transaction history

## API Integration

The frontend communicates with the backend API:
- **Base URL**: `http://localhost:8080`
- **Authentication**: JWT tokens in Authorization header
- **Default timeout**: Axios configuration in `src/api.js`

## Configuration

Backend API endpoint can be configured in `src/api.js`:

```javascript
// Default configuration points to localhost:8080
// Modify the baseURL if your backend runs on a different port
```

## Testing Credentials

| Role   | Username | Password |
|--------|----------|----------|
| Admin  | admin    | 123456   |
| Teller | teller1  | 123456   |
| Client | client1  | 123456   |

## Troubleshooting

### API Connection Issues
- Verify backend is running on `http://localhost:8080`
- Check CORS configuration in backend
- Verify firewall settings

### Login Issues
- Clear browser cache and cookies
- Check that backend is operational
- Verify credentials are correct

### Build Issues
- Delete `node_modules` folder
- Delete `.vite` folder
- Run `npm install` again
