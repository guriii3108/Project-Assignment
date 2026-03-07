# TaskFlow - Full-Stack Task Management Platform

A highly aesthetic, scalable REST API and functional frontend designed for modern task management. Built with Node.js, Express, MongoDB, and React.js (Vite), this application implements secure role-based access control (RBAC), robust authentication, and comprehensive task CRUD operations.

## ✨ Features Evaluated

- **✅ RESTful API Design:** Clean, modularized architecture conforming to REST principles with proper error handling and HTTP status codes.
- **✅ Authentication & Security:** Secure user registration and login using `bcrypt` for password hashing and robust session management utilizing HTTP-only, secure JWT cookies.
- **✅ Role-Based Access Control (RBAC):** Distinct access levels for `user` and `admin`. Users manage their own tasks, while Admins have an ecosystem-wide view and destructive access.
- **✅ Database Schema Management:** Modeled seamlessly with MongoDB & Mongoose utilizing interconnected schemas (User/Task refs).
- **✅ Functional Frontend Integration:** Ultra-premium React UI with glassmorphism components, protected routes via context providers, and dynamic API syncing.
- **✅ Scalability & Portability:** Modular MVC file structure prepared for horizontal scaling. See `SCALABILITY.md` for the architectural review.

## 🛠️ Technology Stack

**Backend:**

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JSON Web Tokens (jsonwebtoken), cookie-parser
- **Security:** bcryptjs, cors, dotenv

**Frontend:**

- **Framework:** React.js (Vite)
- **Routing:** react-router-dom
- **Styling:** TailwindCSS v4
- **State/Form Management:** React Hook Form
- **Data Fetching:** Axios (with pre-configured withCredentials interceptors)

## 📦 Setup & Installation

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file and configure your variables
echo "PORT=4000" > .env
echo "MONGODB_URI=mongodb+srv://<your-cluster-url>" >> .env
echo "JWT_SECRET=your_super_secret_jwt_key" >> .env
echo "FRONTEND_URL=http://localhost:5173" >> .env

# Run the development server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

## 📚 API Deliverables

- **API Documentation:** A fully configured Postman collection is included. Import `TaskFlow_API_Collection.json` into Postman to test all endpoints.
- **Scalability Note:** See `SCALABILITY.md` for a short architectural study on caching, horizontal scaling, and microservices readiness.

## 🔗 Endpoint Summary

### Authentication (`/api/v1/auth`)

- `POST /register` - Register a new User/Admin
- `POST /login` - Log in and receive HTTP-only JWT
- `GET /profile` - Verify token and get user profile
- `POST /logout` - Clear JWT HTTP-only cookie

### User Tasks (`/api/v1/tasks`)

- `POST /` - Create a new task (tied to logged-in user)
- `GET /` - Retreive all tasks associated with logged-in user
- `PUT /:id` - Update an existing user task
- `DELETE /:id` - Delete a user task

### Admin Controls (`/api/v1/tasks/admin`)

- `GET /all` - Retrieve absolutely ALL tasks across the system with owner population.
- `DELETE /:id` - Force-delete any system task.
