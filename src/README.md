# Banking System - Backend

Spring Boot-based backend API for the Banking System application with JWT authentication and role-based access control.

## Overview

This backend provides REST API endpoints for managing banking operations with three distinct user roles:
- **Admin**: System administration and teller management
- **Teller**: Client account and transaction management
- **Client**: Account access and banking operations

## Technology

- Java 17
- Spring Boot 4.0.3
- Spring Security (JWT authentication)
- Spring Data JPA
- MySQL Database
- Maven

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher (included via wrapper)
- MySQL Server 5.7 or higher
- Port 8080 available

## Configuration

### Database Setup

Update `src/main/resources/application.properties` with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3308/banking_db
spring.datasource.username=root
spring.datasource.password=Banking123!A
spring.jpa.hibernate.ddl-auto=update
```

## Installation & Setup

### Option 1: Using Batch File (Recommended)

```bash
cd c:\Projects\BankingSystem
run-backend.bat
```

### Option 2: Manual Setup

```bash
cd c:\Projects\BankingSystem
./mvnw.cmd clean spring-boot:run
```

The backend will start on `http://localhost:8080`

## Project Structure

```
src/main/
├── java/org/example/course/bankingsystem/
│   ├── BankingSystemApplication.java  ← Main Spring Boot application
│   ├── auth/
│   │   ├── AuthController.java        ← Authentication endpoints
│   │   ├── AuthResponse.java          ← JWT response model
│   │   └── LoginRequest.java          ← Login request model
│   ├── controller/
│   │   ├── AdminController.java       ← Admin endpoints
│   │   ├── ClientController.java      ← Client endpoints
│   │   ├── TellerController.java      ← Teller endpoints
│   │   ├── ApiExceptionHandler.java   ← Error handling
│   │   └── [DTOs]                     ← Data transfer objects
│   ├── entity/                        ← Database entities
│   ├── repository/                    ← Data access layer
│   ├── security/                      ← JWT security configuration
│   └── service/                       ← Business logic
└── resources/
    └── application.properties         ← Configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login with username and password
- Returns JWT token for authenticated requests

### Admin Endpoints (Requires ADMIN role)
- `GET /api/admin/tellers` - Get all tellers
- `POST /api/admin/tellers` - Create new teller
- `PUT /api/admin/tellers/{id}` - Update teller
- `DELETE /api/admin/tellers/{id}` - Delete teller

### Client Endpoints (Requires CLIENT role)
- `GET /api/client/accounts` - Get all client accounts
- `POST /api/client/request-account` - Request new account
- `POST /api/client/request-credit-card` - Request credit card
- `POST /api/client/transfer` - Transfer money
- `GET /api/client/transactions` - Get transaction history

### Teller Endpoints (Requires TELLER role)
- `GET /api/teller/clients` - Get all clients
- `POST /api/teller/clients` - Create new client
- `PUT /api/teller/clients/{id}` - Update client
- `DELETE /api/teller/clients/{id}` - Delete client
- `GET /api/teller/accounts` - Get all accounts
- `POST /api/teller/approve-account` - Approve account request
- `POST /api/teller/approve-credit-card` - Approve credit card

## Security

### JWT Authentication
- All protected endpoints require valid JWT token
- Token must be included in Authorization header: `Authorization: Bearer {token}`
- Default token expiration: 120 minutes
- Configurable in `application.properties`

### CORS Configuration
- Frontend at `http://localhost:5173` is enabled
- Modify `security/` configuration for additional origins

## Authentication & Test Credentials

| Role   | Username | Password |
|--------|----------|----------|
| Admin  | admin    | 123456   |
| Teller | teller1  | 123456   |
| Client | client1  | 123456   |

## Database

### Initialization
Database tables are automatically created on first startup via Hibernate.

### Reset Database
To reset the database:
1. Delete the `banking_db` database
2. Restart the application
3. Tables will be recreated

## Building

### Clean and Build
```bash
./mvnw.cmd clean package
```

### Skip Tests
```bash
./mvnw.cmd clean package -DskipTests
```

## Testing

### Run Unit Tests
```bash
./mvnw.cmd test
```

## Troubleshooting

### Port Already in Use
If port 8080 is already in use, update `application.properties`:
```properties
server.port=8081
```

### Database Connection Failed
- Verify MySQL is running
- Check database credentials in `application.properties`
- Verify database exists: `banking_db`

### CORS Errors
- Verify frontend URL in security configuration
- Check that frontend is running on `http://localhost:5173`
- Browser console will show CORS error details

### JWT Token Issues
- Token may be expired (check expiration in properties)
- Verify token is included in Authorization header
- Ensure token format is correct: `Bearer {token}`

## Development

### IDE Setup
- Use any IDE that supports Spring Boot (IntelliJ, Eclipse, VS Code)
- Maven will download all dependencies automatically

### Hot Reload
Spring Boot DevTools is included. Changes to Java code will trigger application restart.

## Performance Considerations

- JWT token validation on each request
- Database update mode set to `update` - change to `validate` in production
- H2 console disabled for security

## Production Deployment

For production deployment:
1. Change `ddl-auto` to `validate` in `application.properties`
2. Use external database (not embedded)
3. Update JWT secret to a strong, random value
4. Set appropriate CORS origins
5. Enable HTTPS
6. Update frontend API endpoint to production URL
