# 🚠 TaskFlow API - Technical Documentation & Revision Guide

This project is a production-grade backend API built with scalability and security in mind. It follows modern design patterns used in enterprise-level Node.js applications.

## 🏗️ Architecture & Organization

The codebase follows a clear **Separation of Concerns**:

- **Controllers**: Implementation of business logic and request handling.
- **Models**: Mongoose schemas defining our data structures and relationships.
- **Routes**: Definition of API endpoints and mapping to controllers.
- **Middleware**: Interceptor layers for Security, Authentication, and Error Handling.

---

## 🏛️ Core Design Patterns & Senior Wisdom

### 1. Centralized Error Handling 🚨

Instead of messy `try-catch` blocks in every function, we implemented a global safety net:

- **AppError Class**: A custom class used to distinguish between expected operational errors (e.g., validation failures) and unexpected programming bugs.
- **asyncHandler**: A Higher-Order Function that wraps our controllers, ensuring any thrown error is automatically caught and passed to the Express Global Error Handler.

### 2. Identity Persistence (Authentication Strategy) 🛡️

Our `authHandler` middleware doesn't just verify the JWT; it re-fetches the user from the database.

- **Why**: JWTs are stateless. If a user is banned, deleted, or their permissions change _after_ the token was issued, the token would still be "valid." By fetching the user on every request, we ensure we are always working with the current, persistent state of the user account.

### 3. Atomic Security Pattern (IDOR Protection) ⚛️

To prevent **Insecure Direct Object Reference (IDOR)** attacks, we never trust the client's provided IDs alone.

- **The Strategy**: When updating or deleting a project/task, we include the `owner` ID directly in the database query (e.g., `Project.findOne({ _id: projectId, owner: req.user._id })`).
- **Result**: Even if a user knows a specific ID, they cannot modify it unless they are the verified owner in the database record.

### 4. RESTful Nested Routing & `mergeParams` 🚠

We used nested routes to reflect the relationship between Projects and Tasks.

- **Mount Point**: `/api/project/:projectId/tasks`
- **mergeParams**: We enabled `{ mergeParams: true }` in the Task router. This allows the child router to access parameters from its parent, making the `projectId` available without passing it in the request body.

---

## 🚀 API Endpoints Reference

### 🔐 Authentication

- `POST /api/auth/sign-up`: Create a new account.
- `POST /api/auth/sign-in`: Authenticate user and receive a JWT.

### 📁 Projects

- `POST /api/project`: Initialize a new project.
- `GET /api/project`: Retrieve all projects owned by the authenticated user.
- `GET /api/project/:id`: Get detailed information about a specific project.

### 📑 Tasks

- `POST /api/project/:projectId/tasks`: Create a task linked to a project.
- `GET /api/project/:projectId/tasks`: List all tasks for a specific project (Includes User Population).
- `PATCH /api/tasks/:taskId`: Update status/priority of a standalone task.
- `DELETE /api/tasks/:taskId`: Remove a task from the system.

---

## 💡 Engineering Roadmap

When adding new modules, follow this sequence:

1. **Define Schema** (Models) -> 2. **Implement Logic** (Controllers) -> 3. **Expose Entrypoints** (Routes) -> 4. **Apply Protections** (Middleware).
