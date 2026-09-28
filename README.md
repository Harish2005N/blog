# Blog Platform

A full-stack blog platform where users can read blog posts and admins can create, edit, and manage posts. Built with the MERN-like stack (MongoDB, Express, React, Node.js) using JWT authentication and role-based authorization.

## Features

- **JWT Authentication** with bcrypt password hashing
- **Role-based access control** (Admin / User)
- **REST API** with complete CRUD operations for blog posts
- **Responsive React frontend** with React Router
- **Admin dashboard** with post management, search, and filtering
- **Confirmation dialogs** before destructive actions
- **Loading and empty states** for better UX
- **Notification system** for success/error feedback

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js, Vite, HTML, CSS, Axios, React Router |
| Backend    | Node.js, Express.js, REST API       |
| Database   | MongoDB, Mongoose                   |
| Auth       | JWT, bcrypt                         |

## Project Structure

```
blog-platform/
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── api/
│       │   ├── index.js          # Axios instance
│       │   ├── auth.js           # Auth API calls
│       │   └── posts.js          # Post API calls
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── BlogCard.jsx
│       │   ├── PostForm.jsx
│       │   ├── Loading.jsx
│       │   ├── EmptyState.jsx
│       │   ├── ConfirmDialog.jsx
│       │   ├── Notification.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── AdminRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx   # Auth state management
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── BlogDetails.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── CreatePost.jsx
│       │   └── EditPost.jsx
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
├── backend/
│   ├── server.js                 # Express entry point
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── postController.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── posts.js
│   ├── middleware/
│   │   └── authMiddleware.js     # auth & admin guard
│   ├── utils/
│   │   ├── authUtils.js
│   │   └── errorHandler.js
│   └── scripts/
│       └── seedAdmin.js          # First admin account creation
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **MongoDB** — either:
  - Local installation (MongoDB Community Server running on `localhost:27017`)
  - Or a cloud instance (MongoDB Atlas)

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure MongoDB

If using local MongoDB, ensure the server is running:
```bash
# macOS (with Homebrew)
brew tap mongodb/brew
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod

# Windows (PowerShell as Administrator)
net start MongoDB
```

For a cloud database, create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and obtain the connection string.

### 3. Configure Environment Variables

**Backend** — copy `.env.example` to `.env` and fill in values:
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your_super_secret_jwt_key_here  # use a long random string
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
CLIENT_URL=http://localhost:5173
```

**Frontend** — copy `.env.example` to `.env`:
```bash
cd frontend
cp .env.example .env
```

Edit `.env` (adjust if backend runs on a different port):
```env
VITE_API_URL=http://localhost:5000/api
```

> **Note:** The Vite proxy in `vite.config.js` routes `/api` to the backend during development, so you only need to change `VITE_API_URL` if deploying to production with a different setup.

### 4. Create the First Admin Account

A secure seed script creates an admin account using environment variables — no hardcoded passwords in source code:

```bash
cd backend
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=your_secure_password npm run seed
```

This creates a user with `role: "admin"`. You can log in with these credentials.

### 5. Start the Application

**Start the backend:**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

**Start the frontend:**
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:5173`

## API Endpoints

### Authentication

| Method | Endpoint              | Access | Body                          |
|--------|-----------------------|--------|-------------------------------|
| POST   | `/api/auth/register`  | Public | `{name, email, password}`     |
| POST   | `/api/auth/login`     | Public | `{email, password}`           |
| GET    | `/api/auth/me`        | Auth   | —                             |

### Posts

| Method   | Endpoint             | Access      | Body                          |
|----------|----------------------|-------------|-------------------------------|
| GET      | `/api/posts`         | Public/User | `?search=...&status=publish\|draft` |
| GET      | `/api/posts/:id`     | Public/User | —                             |
| GET      | `/api/posts/published`| Public     | —                             |
| POST     | `/api/posts`         | Admin only  | `{title, content, author, category, image?, status}` |
| PUT      | `/api/posts/:id`     | Admin only  | `{title, content, author, category, image?, status}` |
| DELETE   | `/api/posts/:id`     | Admin only  | —                             |

### JWT & Authorization

- The login/register endpoints return a JWT token in the response body.
- The token is also stored as an `httpOnly` cookie.
- Protected routes require the `Authorization: Bearer <token>` header.
- Admin-only routes additionally verify the user's `role` is `"admin"`.
- Passwords are never returned in any API response.

## Usage

1. Register a new account at `/register` (default role: `user`).
2. Log in at `/login`.
3. **Users** can browse and read published posts on the home page.
4. **Admins** can access `/admin` to view the dashboard, create/edit/delete posts, search, and filter by status.

## Frontend Pages

| Page                 | Route              | Description                          |
|----------------------|--------------------|--------------------------------------|
| Home                 | `/`                | Lists all published blog posts       |
| Blog Details         | `/posts/:id`       | Displays a full blog post            |
| Login                | `/login`           | User login form                      |
| Register             | `/register`        | User registration form               |
| Admin Dashboard      | `/admin`           | Post management (admin only)         |
| Create Post          | `/admin/create`    | New post form (admin only)           |
| Edit Post            | `/admin/edit/:id`  | Edit existing post (admin only)      |

## Security

- Passwords are hashed with **bcrypt** — never stored in plain text.
- **JWT** tokens are signed with a strong secret and stored as `httpOnly` cookies.
- Admin CRUD endpoints are protected by both `protect` (verification) and `admin` (role check) middleware.
- The `password` field has `select: false` in the User schema, so it is never exposed in API responses.
- CORS is configured with credentials support.
- Secrets and the database URI are loaded from environment variables.
