# Advanced To-Do List

A full-stack Kanban-style to-do list application built with **React**, **TypeScript**, **Vite**, **Express**, and **JWT authentication**. The app features a modern drag-and-drop interface, user authentication, and persistent task management.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Backend API](#backend-api)
- [Frontend Overview](#frontend-overview)
- [Testing](#testing)
- [Dependencies](#dependencies)
- [License](#license)

---

## Features

- User registration and login with JWT authentication
- Kanban board with drag-and-drop task management
- Add, update, and delete tasks
- Tasks organized by state: To Do, In Progress, Done
- Responsive, modern UI with Material-UI
- Protected API endpoints for authenticated users
- Local development with hot reloading

---

## Project Structure

```
advanced-to-do-list/
├── public/
├── src/
│   ├── backend/
│   │   ├── auth/           # Authentication logic (JWT, registration, login)
│   │   ├── controllers/    # API controllers for tasks
│   │   ├── db/             # Local database logic
│   │   ├── models/         # Data models (e.g., Task)
│   │   ├── server/         # Express server entry point
│   │   └── backend.test/   # Backend tests
│   └── frontend/
│       ├── components/     # React UI components
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # App pages (Login, Register, Board, etc.)
│       ├── services/       # API service functions
│       └── frontend.test/  # Frontend tests
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- Yarn or npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd advanced-to-do-list
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root or `src/backend` directory.
   - Add your JWT secret:
     ```
     JWT_SECRET=your_jwt_secret
     ```

4. **Run the development servers:**
   - **Backend:**  
     ```bash
     yarn start
     # or
     npm run start
     ```
   - **Frontend:**  
     ```bash
     yarn dev
     # or
     npm run dev
     ```

   The backend runs on [http://localhost:3000](http://localhost:3000) and the frontend on [http://localhost:5173](http://localhost:5173) by default.

---

## Available Scripts

- `yarn dev` / `npm run dev` — Start the frontend (Vite) in development mode
- `yarn start` / `npm run start` — Start the backend server (Express)
- `yarn build` / `npm run build` — Build both backend and frontend
- `yarn lint` / `npm run lint` — Lint the codebase
- `yarn preview` / `npm run preview` — Preview the production build
- `yarn test` / `npm run test` — Run tests (Jest)

---

## Backend API

All endpoints require a valid JWT token (except registration and login).

### **Auth**

- `POST /register` — Register a new user  
  **Body:** `{ "email": string, "password": string }`

- `POST /login` — Login and receive a JWT  
  **Body:** `{ "email": string, "password": string }`  
  **Response:** `{ "token": string }`

### **Tasks** (Authenticated)

- `POST /addTask` — Add a new task  
  **Body:** `{ "content": string }`

- `GET /tasks` — Get all tasks for the user

- `DELETE /removeTask/:id` — Remove a task by ID

- `PUT /updateTaskState/:id` — Update a task's state  
  **Body:** `{ "newState": "TODO" | "IN_PROGRESS" | "DONE" }`

**Note:** All task endpoints require the `Authorization: Bearer <token>` header.

---

## Frontend Overview

- **Login/Register:** Secure authentication with JWT.
- **Kanban Board:**  
  - Drag-and-drop tasks between columns (To Do, In Progress, Done).
  - Delete tasks by dragging to the delete area.
  - Add new tasks via a form.
- **State Management:** Uses React hooks and context.
- **API Integration:** All task actions communicate with the backend via REST API.

---

## Testing

- **Backend:** Jest tests in `src/backend/backend.test/`
- **Frontend:** React Testing Library in `src/frontend/frontend.test/`

Run all tests:
```bash
yarn test
# or
npm run test
```

---

## Dependencies

- **Frontend:** React, React Router, Material-UI, @hello-pangea/dnd, Emotion, Vite, TypeScript
- **Backend:** Express, bcryptjs, jsonwebtoken, cors, dotenv
- **Dev/Test:** Jest, React Testing Library, ESLint, ts-jest, ts-node-dev

See `package.json` for full details.

---

## License

[MIT](LICENSE) (or specify your license here)

---
