# Hire a Counsellor

A full-stack web application for connecting users with professional counsellors. This platform allows users to find, filter, and book counselling sessions based on their specific needs and counsellor availability.

## Features

### Admin Panel
- Manage counsellors (add/edit/delete, approve/reject, enable/disable)
- Manage users (view, enable/disable)
- Manage topics and locations
- View all bookings and sessions
- Basic analytics dashboard

### Counsellor Module
- Registration form (requires admin approval)
- Set availability calendar with date/time slots
- Set pricing for 1, 5, and 10 sessions packages
- View and manage bookings
- Mark sessions as completed
- Manage profile, topics, and locations

### User Module
- Sign up / login
- Filter counsellors by location and topic/issue type
- View counsellor profiles and package options
- Book sessions based on availability
- View and manage booked sessions

## Tech Stack

### Frontend
- Angular 16
- Angular Material UI
- Angular Calendar for booking system
- JWT authentication
- Responsive design for mobile and desktop

### Backend
- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose ODM
- JWT-based authentication
- RESTful API architecture

### Database
- MongoDB (MongoDB Atlas free tier)

### Hosting
- Frontend: Static hosting (Windsurf)
- Backend: Minimal compute instance (Windsurf)

## Project Structure

```
hire-a-counseller/
├── frontend/               # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/      # Admin module and components
│   │   │   ├── auth/       # Authentication module and components
│   │   │   ├── core/       # Core module with shared services
│   │   │   ├── counsellor/ # Counsellor module and components
│   │   │   ├── shared/     # Shared components and services
│   │   │   └── user/       # User module and components
│   │   └── ...
│   └── ...
├── backend/                # Node.js backend application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # API controllers
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hire-a-counseller
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env file with your MongoDB URI and JWT secret
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

3. Access the application:
- Frontend: http://localhost:4200
- Backend API: http://localhost:5000

## API Documentation

The API follows RESTful principles with the following main endpoints:

- `/api/users` - User registration and authentication
- `/api/counsellors` - Counsellor management and profiles
- `/api/sessions` - Session booking and management
- `/api/topics` - Counselling topics
- `/api/locations` - Location management
- `/api/admin` - Admin-specific operations

## Deployment

The application is designed to be deployed on Windsurf:
- Frontend: Deploy as a static site
- Backend: Deploy on a minimal compute instance

## Cost Optimization

- Using MongoDB Atlas free tier
- Minimal compute instance for backend
- Static hosting for frontend
- No server-side rendering
- Free email service (Nodemailer with Gmail)
- No paid third-party APIs or plugins

## License

This project is licensed under the MIT License - see the LICENSE file for details.
