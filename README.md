# TaskFlow — Modern Full-Stack Task Management App

[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Icons](https://img.shields.io/badge/Icons-Lucide%20React-F56565)](https://lucide.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A modern, high-performance, responsive full-stack **Task Management Application** featuring an interactive glassmorphic dashboard, persistent SQLite database storage, full CRUD capabilities, intuitive task filtering and search, and custom notification toasts.

Repository: [https://github.com/hariharanofficially/task-management-app](https://github.com/hariharanofficially/task-management-app)

---

## ✨ Features

- **📊 Modern Analytics Dashboard**:
  - Live metric cards tracking **Total Tasks**, **Completed Tasks** (with animated progress bar), **Active / Pending Tasks**, and **High Priority** items.
- **⚡ Full CRUD Operations**:
  - **Create**: Modal dialog with title, description, priority, category, and due date.
  - **Read**: Fast listing with server-side query filters and search.
  - **Update**: Modal dialog to edit title, description, priority, category, due date, and status.
  - **Toggle**: Instant checkbox toggle between *Pending* and *Completed* with optimistic UI feedback.
  - **Delete**: Safe removal with a delete confirmation dialog.
- **🔍 Comprehensive Search & Filtering**:
  - Instant live keyword search across titles and descriptions.
  - Segmented status tabs (**All**, **Active**, **Completed**) with live counter badges.
  - Filter dropdowns by **Priority** (*High*, *Medium*, *Low*) and **Category** (*Work*, *Personal*, *Study*, *Health*, *Finance*, *General*).
  - Multi-criteria sorting (*Newest First*, *Oldest First*, *Due Date Soonest*, *Due Date Latest*, *Highest Priority*).
- **🎨 Glassmorphic & Responsive Aesthetics**:
  - Deep sleek slate dark mode with subtle neon gradients and backdrop blurs.
  - Built-in theme switcher (toggle between Dark and Light modes stored in `localStorage`).
  - Mobile, tablet, and desktop responsive layouts.
- **🔔 Toast Notification System**:
  - Interactive floating notifications for success, status updates, and deletions with auto-dismissal.
- **🛡️ Robust Input Validation & Error Handling**:
  - Client-side validation with real-time feedback.
  - Server-side validation middleware rejecting malformed payloads and returning clear error messages.
- **💾 Persistent SQLite Database**:
  - Local database file (`tasks.db`) initialized with WAL (Write-Ahead Logging) mode and automatic table creation & initial seed data.
  - Clean separation: database files and `.env` secrets are strictly ignored by `.gitignore`.

---

## 📁 Repository Directory Structure

```text
task-management-app/
├── .gitignore                    # Prevents node_modules, *.db, and .env from being committed
├── package.json                  # Root npm workspace commands for convenient development
├── README.md                     # Complete documentation & setup instructions
├── backend/                      # Node.js + Express.js REST API
│   ├── .env.example              # Template environment configuration
│   ├── package.json              # Backend dependencies (express, better-sqlite3, cors, dotenv)
│   └── src/
│       ├── config/
│       │   └── constants.js      # App constants (priorities, statuses, categories)
│       ├── controllers/
│       │   └── taskController.js # CRUD business logic, stats calculations & SQLite queries
│       ├── database/
│       │   └── db.js             # SQLite connection, table schema creation & seeding
│       ├── middleware/
│       │   ├── errorHandler.js   # 404 handler and global exception middleware
│       │   └── validator.js      # Request body & parameter validation
│       ├── routes/
│       │   └── taskRoutes.js     # REST API route endpoints mapping
│       └── server.js             # Express app bootstrap, CORS configuration & logger
└── frontend/                     # React + Vite Client Application
    ├── index.html                # App shell with SEO meta tags & Google Fonts
    ├── package.json              # Frontend dependencies (react, lucide-react, vite)
    ├── vite.config.js            # Vite configuration with API reverse proxy to port 5000
    └── src/
        ├── App.jsx               # Master state management, CRUD handlers & modal control
        ├── index.css             # Complete modern CSS design system with CSS custom properties
        ├── main.jsx              # React DOM entry point
        ├── components/
        │   ├── DashboardStats.jsx    # Analytics metrics cards
        │   ├── DeleteConfirmModal.jsx# Deletion confirmation modal
        │   ├── Navbar.jsx            # Header with logo, theme switcher & new task trigger
        │   ├── TaskControls.jsx      # Search input, filter tabs, priority & sort selectors
        │   ├── TaskItem.jsx          # Individual task card with status checkbox & actions
        │   ├── TaskList.jsx          # Loading skeleton, empty state & task grid
        │   ├── TaskModal.jsx         # Accessible task create/edit modal dialog
        │   └── Toast.jsx             # Floating toast notification cards
        └── services/
            └── api.js                # Fetch API client connecting to Express endpoints
```

---

## 🚀 Installation & Local Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (comes with Node.js)

### Step 1: Clone the Repository
```bash
git clone https://github.com/hariharanofficially/task-management-app.git
cd task-management-app
```

### Step 2: Install Dependencies

You can install all dependencies for both backend and frontend at once using the root script:
```bash
npm run install:all
```

*Or install them individually:*
```bash
# Backend dependencies
cd backend
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: Configure Environment Variables

The backend includes a `.env.example` file. You can create your local `.env`:
```bash
# In the backend directory:
cp backend/.env.example backend/.env
```
Default configuration:
```env
PORT=5000
NODE_ENV=development
DB_PATH=./tasks.db
```

---

## 🏃 Running the Application Locally

Run the backend and frontend in two separate terminal windows:

### Terminal 1: Start the Backend Server
```bash
cd backend
npm run dev
```
*(Runs with Node `--watch` for auto-reloading on `http://localhost:5000`)*

Expected console output:
```text
===============================================
🚀 Task Management Server is running!
📡 URL: http://localhost:5000
🩺 Health check: http://localhost:5000/api/health
📋 API Docs: http://localhost:5000/api/tasks
===============================================
```

### Terminal 2: Start the Frontend React App
```bash
cd frontend
npm run dev
```
*(Starts Vite dev server on `http://localhost:5173`)*

Now open **`http://localhost:5173`** in your browser!

---

## 📡 REST API Reference

All API routes are prefixed with `/api`.

| Method | Endpoint | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Service health check | None |
| **GET** | `/api/tasks` | Get all tasks | `search`, `status`, `priority`, `category`, `sort` |
| **GET** | `/api/tasks/stats` | Get analytics summary | None |
| **GET** | `/api/tasks/:id` | Get single task by ID | None |
| **POST** | `/api/tasks` | Create a new task | `{ title, description, priority, category, due_date }` |
| **PUT** | `/api/tasks/:id` | Update an existing task | `{ title, description, priority, category, due_date, status }` |
| **PATCH** | `/api/tasks/:id/toggle` | Toggle between pending & completed | None |
| **DELETE** | `/api/tasks/:id` | Delete task permanently | None |

### Example Request Payloads

#### Create Task (`POST /api/tasks`)
```json
{
  "title": "Build production release bundle",
  "description": "Optimize bundle chunks and run regression tests",
  "priority": "high",
  "category": "Work",
  "due_date": "2026-10-30"
}
```

#### Successful Response (`201 Created`)
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 5,
    "title": "Build production release bundle",
    "description": "Optimize bundle chunks and run regression tests",
    "status": "pending",
    "priority": "high",
    "category": "Work",
    "due_date": "2026-10-30",
    "created_at": "2026-10-12 13:12:00",
    "updated_at": "2026-10-12 13:12:00"
  }
}
```

---

## 🧪 Testing Each CRUD Operation

### 1. In the Web UI (`http://localhost:5173`)
1. **Create (C)**:
   - Click the **"New Task"** button in the top navigation bar (or press `Ctrl+N` / `Cmd+N`).
   - Fill in Title, Description, Priority (High/Medium/Low), Category, and Due Date.
   - Click **"Create Task"**. Verify the new task card appears instantly and a green toast notification shows up.
2. **Read / Search / Filter (R)**:
   - Type keywords into the search box; matching items update in real time.
   - Click **Active** to view only pending tasks; click **Completed** to view completed tasks.
   - Select a priority filter like **High** or a category like **Work** to verify specific subsets.
3. **Update (U)**:
   - Click the **Pencil (Edit)** button on any task card.
   - Modify the title or details, and click **"Save Changes"**.
4. **Toggle Status (U)**:
   - Click the checkbox on any task card.
   - The task immediately transitions between active and completed with a strikethrough effect and counter updates.
5. **Delete (D)**:
   - Click the **Trash (Delete)** icon on a task card.
   - A confirmation dialog appears. Click **"Delete Task"** to permanently remove it.

### 2. Using Terminal / cURL Commands

```bash
# 1. Check API Health
curl -X GET http://localhost:5000/api/health

# 2. Get All Tasks
curl -X GET http://localhost:5000/api/tasks

# 3. Get Dashboard Stats
curl -X GET http://localhost:5000/api/tasks/stats

# 4. Create a Task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Verify API CRUD\",\"priority\":\"high\",\"category\":\"Work\"}"

# 5. Update Task #1
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Updated Task Title\",\"priority\":\"low\"}"

# 6. Toggle Completion on Task #1
curl -X PATCH http://localhost:5000/api/tasks/1/toggle

# 7. Delete Task #1
curl -X DELETE http://localhost:5000/api/tasks/1
```

---

## 📦 Git & GitHub Deployment Instructions

To commit and push all newly created code to your repository:

```bash
# 1. Review status (verify no .env or .db files are staged)
git status

# 2. Stage all project files
git add .

# 3. Create a descriptive commit
git commit -m "feat: complete Task Management App with React frontend, Express API, and SQLite database"

# 4. Ensure you are on the main branch
git branch -M main

# 5. Push to your GitHub repository
git push -u origin main
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
