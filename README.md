# E-Learning Platform Backend API

This project provides a backend API for an e-learning platform, built with Node.js, Express.js, and PostgreSQL. It includes the following features:

- User registration and authentication
- User profile management
- Course management (CRUD operations for superadmin)
- Course filtering and pagination
- User enrollment in courses
- View enrolled courses for a user

## Getting Started

1. Clone the repository:

2. Install dependencies:


3. Set up PostgreSQL database:
   - Create a new PostgreSQL database
   - Update the `src/config/database.js` file with your PostgreSQL connection details

4. Set environment variables:
   - `JWT_SECRET`: Secret key for JSON Web Token

5. Start the development server:


The API will be available at `http://localhost:3000`.

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: User login

### Users

- `GET /api/users/profile`: Get user profile
- `PUT /api/users/profile`: Update user profile

### Courses

- `GET /api/courses`: Get courses with filtering and pagination
- `POST /api/courses` (superadmin only): Create a new course
- `PUT /api/courses/:courseId` (superadmin only): Update a course
- `DELETE /api/courses/:courseId` (superadmin only): Delete a course

### Enrollments

- `POST /api/enrollments/:courseId`: Enroll in a course
- `GET /api/enrollments`: Get enrolled courses for a user

## Thank You
