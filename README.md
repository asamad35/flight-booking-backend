# Flight Booking API Backend

## Overview

This is the backend service for a Flight Booking application, built with NestJS. It provides robust APIs for flight search, booking management, and user authentication with role-based access control. The service connects to a Supabase database for data storage and uses JWT for secure authentication.

## Features

- 🔍 **Flight Search**: Advanced filtering by destination, date, price, and airlines
- 🛫 **Flight Booking Management**: Create, view, update, and cancel bookings
- 👤 **User Management**: Registration, authentication, and profile management
- 👑 **Admin Dashboard**: Administrative features for managing flights, bookings, and users
- 🔒 **Role-Based Access Control**: Different permissions for users and administrators
- 🔐 **JWT-based Authentication**: Secure token-based authentication system
- 📖 **API Documentation**: Interactive Swagger UI documentation
- 🐳 **Docker Support**: Containerized deployment with Docker and Docker Compose
- 🧪 **Testing**: Comprehensive unit and e2e tests

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose
- **API Design**: RESTful principles
- **Error Handling**: Global exception filters

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)
- Supabase account and project setup
- Git

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd flight-booking/backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**:

   - Copy `.env.example` to `.env` (or create a new `.env` file)
   - Update the environment variables with your Supabase credentials and other settings:

   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   PORT=3333
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRATION=8h
   ```

## Development

### Start the development server:

```bash
npm run start:dev
# or
yarn start:dev
```

The API will be available at http://localhost:3333.

### Linting and formatting:

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## Database Setup

This application requires a Supabase database with specific tables for flights, cities, users, and bookings.

### Auto Setup

You can set up the database automatically using the provided scripts:

```bash
npm run setup
```

### Manual Database Setup

If you prefer to set up tables manually, create the following tables in your Supabase project:

1. **Users Table**:

   - id (UUID, primary key)
   - email (string, unique)
   - password (string, hashed)
   - firstName (string)
   - lastName (string)
   - role (string: 'user' or 'admin')
   - created_at (timestamp)

2. **Flights Table**:

   - id (UUID, primary key)
   - destination (string)
   - departureDate (date)
   - price (decimal)
   - airline (string)
   - flightNumber (string)
   - departureAirport (string)
   - arrivalAirport (string)
   - departureTime (time)
   - arrivalTime (time)
   - duration (string)
   - stops (integer)

3. **Bookings Table**:
   - id (UUID, primary key)
   - bookingId (string)
   - userId (UUID, foreign key)
   - flightId (UUID, foreign key)
   - bookingDate (timestamp)
   - departureDate (date)
   - totalPrice (decimal)
   - passengers (integer)
   - cabinClass (string)
   - status (string)
   - created_at (timestamp)

## API Documentation

The API is documented using Swagger UI. When the application is running, you can access the interactive documentation at:

```
http://localhost:3333/api/docs
```

## Project Structure

```
flight-booking/backend/
├── dist/                        # Compiled JavaScript output
│   ├── app.controller.d.ts
│   ├── app.controller.js
│   ├── app.controller.js.map
│   ├── app.module.d.ts
│   ├── app.module.js
│   ├── app.module.js.map
│   ├── app.service.d.ts
│   ├── app.service.js
│   ├── app.service.js.map
│   ├── data/
│   │   ├── mock-booking.d.ts
│   │   ├── mock-booking.js
│   │   ├── mock-booking.js.map
│   │   ├── mock-cities.d.ts
│   │   ├── mock-cities.js
│   │   ├── mock-cities.js.map
│   │   ├── mock-flights.d.ts
│   │   ├── mock-flights.js
│   │   └── mock-flights.js.map
│   ├── decorators/
│   │   ├── user.decorator.d.ts
│   │   ├── user.decorator.js
│   │   ├── user.decorator.js.map
│   │   ├── roles.decorator.d.ts
│   │   ├── roles.decorator.js
│   │   └── roles.decorator.js.map
│   ├── filters/
│   │   ├── http-exception.filter.d.ts
│   │   ├── http-exception.filter.js
│   │   └── http-exception.filter.js.map
│   ├── flights/
│   │   ├── dto/
│   │   ├── interfaces/
│   │   ├── utils/
│   │   ├── flights.controller.js
│   │   ├── flights.module.js
│   │   ├── flights.service.js
│   │   └── flights.repository.js
│   ├── users/
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── interfaces/
│   │   │   └── user.interface.ts
│   │   ├── user.controller.js
│   │   ├── user.module.js
│   │   ├── user.service.js
│   │   └── user.repository.js
│   ├── jwt/
│   │   ├── jwt.module.js
│   │   ├── jwt.service.js
│   │   └── jwt.strategy.js
│   ├── guards/
│   │   ├── jwt-auth.guard.js
│   │   └── roles.guard.js
│   └── main.js
├── node_modules/              # Node.js dependencies
├── src/                       # Source code
│   ├── main.ts                # Application entry point
│   ├── app.module.ts          # Root module
│   ├── app.controller.ts      # Root controller
│   ├── app.service.ts         # Root service
│   ├── data/                  # Mock/seed data
│   │   ├── mock-booking.ts
│   │   ├── mock-cities.ts
│   │   └── mock-flights.ts
│   ├── flights/               # Flight-related features
│   │   ├── dto/               # Data Transfer Objects
│   │   │   ├── create-flight.dto.ts
│   │   │   ├── update-flight.dto.ts
│   │   │   ├── flight-search.dto.ts
│   │   │   └── booking.dto.ts
│   │   ├── interfaces/        # TypeScript interfaces
│   │   │   ├── flight.interface.ts
│   │   │   └── booking.interface.ts
│   │   ├── utils/
│   │   │   └── flight.enums.ts
│   │   ├── flights.controller.ts
│   │   ├── flights.module.ts
│   │   ├── flights.service.ts
│   │   └── flights.repository.ts
│   ├── users/                 # User management features
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── interfaces/
│   │   │   └── user.interface.ts
│   │   ├── user.controller.ts
│   │   ├── user.module.ts
│   │   ├── user.service.ts
│   │   └── user.repository.ts
│   ├── jwt/                   # JWT authentication
│   │   ├── jwt.module.ts
│   │   ├── jwt.service.ts
│   │   └── jwt.strategy.ts
│   ├── guards/                # Authentication guards
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts     # Role-based authorization guard
│   ├── decorators/            # Custom decorators
│   │   ├── user.decorator.ts
│   │   └── roles.decorator.ts # Role-based access control decorator
│   ├── filters/               # Exception filters
│   │   └── http-exception.filter.ts
│   └── utils/                 # Utility functions
│       └── validation.helpers.ts
├── test/                      # Test files
│   ├── app.e2e-spec.ts
│   ├── flights.e2e-spec.ts
│   ├── users.e2e-spec.ts
│   └── jest-e2e.json
├── .dockerignore              # Docker ignore file
├── .env                       # Environment variables
├── .gitignore                 # Git ignore file
├── .prettierrc                # Prettier configuration
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Docker configuration
├── launch.json                # VS Code debug configuration
├── nest-cli.json              # NestJS CLI configuration
├── package.json               # Node.js package configuration
├── package-lock.json          # Node.js package lock
├── README.md                  # Project documentation
├── tsconfig.json              # TypeScript configuration
└── tsconfig.build.json        # TypeScript build configuration
```

## Testing

### Unit Tests

Run unit tests with Jest:

```bash
npm run test
```

### End-to-End Tests

Run E2E tests that test the entire application flow:

```bash
npm run test:e2e
```

### Test Coverage

Generate test coverage reports:

```bash
npm run test:cov
```

## Building for Production

Build the application for production deployment:

```bash
npm run build
```

The compiled files will be in the `dist/` directory.

## Docker Deployment

You can run the application in a Docker container:

1. **Build the Docker image**:

   ```bash
   docker-compose build
   ```

2. **Run the container**:
   ```bash
   docker-compose up -d
   ```

The API will be available at http://localhost:3333.

## Role-Based Access Control

The application implements role-based access control with two main roles:

### User Role

- Register and manage personal account
- Search for flights
- Create, view, and manage personal bookings
- Update personal profile information

### Admin Role

- Access to all user functionalities
- Manage all flight data (create, update, delete flights)
- View and manage all user bookings
- Access user management features
- View system statistics and analytics
- Special admin-only endpoints

Admin authentication is required for accessing admin-specific routes, which is handled by the roles guard and roles decorator.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](LICENSE)
