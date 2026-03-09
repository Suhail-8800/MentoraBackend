# Mentora Backend Assignment

A simplified backend for a mentorship platform where **parents, students, and mentors interact** through lessons and sessions.

This project simulates the core backend of the **Mentora platform**, including authentication, lesson management, bookings, sessions, and an LLM-based text summarization endpoint.

---

# Tech Stack

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **JWT Authentication**
* **bcrypt Password Hashing**
* **Google Gemini API (LLM Integration)**
* **express-rate-limit (API protection)**

---

# Project Structure

```
mentora-backend
│
├── src
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── lessonController.js
│   │   ├── bookingController.js
│   │   ├── sessionController.js
│   │   └── llmController.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── lessonRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── sessionRoutes.js
│   │   └── llmRoutes.js
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   ├── rateLimiter.js
│   │   └── errorHandler.js
│   │
│   └── services
│       └── llmService.js
│
├── database
│   └── schema.sql
│
├── server.js
├── package.json
├── .env
└── README.md
```

---

# System Overview

There are **three types of users**:

| Role    | Capabilities                                 |
| ------- | -------------------------------------------- |
| Parent  | Create students, book lessons, join sessions |
| Student | Attend lessons                               |
| Mentor  | Create lessons and manage sessions           |

Relationship flow:

```
Parent → Student → Booking → Lesson → Sessions
                          ↑
                        Mentor
```

---

# Setup Instructions

## 1. Clone Repository

```
git clone https://github.com/YOUR_USERNAME/mentora-backend.git
cd mentora-backend
```

---

## 2. Install Dependencies

```
npm install
```

---

## 3. Setup Environment Variables

Create a `.env` file in the root directory.

```
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=mentora_db

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

**Important:** Never commit `.env` to GitHub.

---

## 4. Setup PostgreSQL Database

Create the database:

```
CREATE DATABASE mentora_db;
```

Run the schema file:

```
database/schema.sql
```

---

## 5. Start the Server

```
npm run dev
```

Server will start at:

```
http://localhost:5000
```

---

# API Endpoints

## Authentication

### Signup

```
POST /auth/signup
```

Body:

```
{
 "name": "John",
 "email": "john@test.com",
 "password": "123456",
 "role": "parent"
}
```

---

### Login

```
POST /auth/login
```

Body:

```
{
 "email": "john@test.com",
 "password": "123456"
}
```

Response returns JWT token.

---

### Get Current User

```
GET /auth/me
```

Header:

```
Authorization: Bearer TOKEN
```

---

# Students (Parent Only)

### Create Student

```
POST /students
```

Body:

```
{
 "name": "Student One",
 "age": 12
}
```

---

### Get Students

```
GET /students
```

Returns all students created by the parent.

---

# Lessons (Mentor Only)

### Create Lesson

```
POST /lessons
```

Body:

```
{
 "title": "Math Basics",
 "description": "Introduction to Algebra"
}
```

---

### Get Lessons

```
GET /lessons
```

Returns available lessons.

---

# Booking System

Parents can assign students to lessons.

```
POST /bookings
```

Body:

```
{
 "studentId": 1,
 "lessonId": 1
}
```

---

# Session System

### Create Session (Mentor)

```
POST /sessions
```

Body:

```
{
 "lessonId": 1,
 "date": "2026-03-10",
 "topic": "Algebra Basics",
 "summary": "Introduction to algebra"
}
```

---

### Get Lesson Sessions

```
GET /sessions/lesson/:id
```

Example:

```
GET /sessions/lesson/1
```

---

# Bonus Feature — Join Session

Parents can register students to join a session.

```
POST /sessions/:id/join
```

Body:

```
{
 "studentId": 1
}
```

---

# LLM Integration — Text Summarization

Endpoint:

```
POST /llm/summarize
```

Body:

```
{
 "text": "Long text that needs summarization..."
}
```

Response:

```
{
 "summary": "...",
 "model": "gemini-2.5-flash"
}
```

The endpoint calls the **Google Gemini API** to summarize the text.

---

# Validation Rules

The endpoint validates:

| Condition            | Response |
| -------------------- | -------- |
| Missing text         | 400      |
| Text < 50 characters | 400      |
| Text too large       | 413      |

---

# Rate Limiting

The LLM endpoint is protected using **express-rate-limit**.

```
10 requests per minute
```

This prevents abuse of the API.

---

# Security Practices

* Passwords hashed using **bcrypt**
* **JWT authentication** for protected routes
* **Environment variables** for API keys
* `.env` excluded from GitHub
* **Rate limiting** for LLM endpoint

---

# Assumptions Made

* Parents manage student accounts.
* Students do not sign up directly.
* Mentor ID is extracted from the JWT token instead of being passed in requests for better security.

---

# Future Improvements

Possible enhancements for production:

* Pagination for lesson lists
* Session attendance tracking
* WebSocket notifications
* Payment integration
* Role-based authorization middleware

---

# Author

Suhail Rajput

Computer Science Student
Backend Developer

---
