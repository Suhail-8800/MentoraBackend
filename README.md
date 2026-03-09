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

## API Overview

| Method | Endpoint | Description |
|------|------|------|
POST | /auth/signup | Register parent or mentor |
POST | /auth/login | Login and receive JWT |
GET | /auth/me | Get current authenticated user |
POST | /students | Create student (Parent only) |
GET | /students | Get students of parent |
POST | /lessons | Create lesson (Mentor only) |
GET | /lessons | Get all lessons |
POST | /bookings | Assign student to lesson |
POST | /sessions | Create session for lesson |
GET | /sessions/lesson/:id | Get sessions of lesson |
POST | /sessions/:id/join | Student joins session |
POST | /llm/summarize | Summarize text using LLM |

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


## Database Design

The platform uses PostgreSQL with the following core tables:

- users
- students
- lessons
- bookings
- sessions
- session_participants

Relationships:

Parent → Students  
Students → Bookings  
Bookings → Lessons  
Lessons → Sessions  
Sessions → Participants

This relational structure ensures proper ownership and access control across users.
---

# Setup Instructions

## 1. Clone Repository

```
git clone https://github.com/Suhail-8800/MentoraBackend.git
cd MentoraBackend
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

**Remember:** Never commit `.env` to GitHub because it keeps the secret information.

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

### Example Test Request

POST /llm/summarize

Request Body

{
"text": "Artificial intelligence is transforming industries by enabling automation, improving decision-making through data analytics, and enhancing user experiences."
}

Example Response

{
 "summary": "• AI enables automation  
 • Improves decision-making through data analytics  
 • Enhances personalized user experiences  
 • Drives efficiency and innovation",
 "model": "gemini-2.5-flash"
}

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

## Health Check

The API includes a simple health check endpoint.

GET /health

Response

{
 "status": "ok",
 "service": "mentora-backend"
}

---

# Future Improvements

Possible enhancements for production:

* Pagination for lesson lists
* Session attendance tracking
* WebSocket notifications
* Payment integration
* Role-based authorization middleware

---

## Author

**Suhail Rajput**  
Computer Science Graduate | Backend Developer

🌐 **Portfolio:** [View Portfolio](https://suhail-8800.github.io/suhail_rajput_portfolio)

📄 **Resume:** [View Resume](https://drive.google.com/file/d/1gd9Cab4OrcDCsDucHhca75TXT_3aBlSG/view)

🔗 **LinkedIn:** https://www.linkedin.com/in/suhail-rajput-64158722b/

📧 **Email:** suhailrajput325@gmail.com

📱 **Contact Number:** +91 9368056263  

💻 **GitHub:** https://github.com/Suhail-8800

---

If you have any questions regarding the implementation or need clarification about the project setup, feel free to reach out.

---
