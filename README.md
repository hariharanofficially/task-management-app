# TaskFlow — Modern Full-Stack Task Management App

[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![.NET](https://img.shields.io/badge/Backend-ASP.NET%20Core%208.0%20Web%20API-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20(EF%20Core%208)-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Swagger](https://img.shields.io/badge/API%20Docs-Swagger%20%2F%20OpenAPI-85EA2D?logo=swagger&logoColor=black)](http://localhost:5000/swagger)
[![Icons](https://img.shields.io/badge/Icons-Lucide%20React-F56565)](https://lucide.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A modern, high-performance, responsive full-stack **Task Management Application** built with a **React + Vite** frontend and an **ASP.NET Core (.NET 8 Web API)** backend, backed by persistent **SQLite** storage via Entity Framework Core.

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
  - ASP.NET Core model validation rejecting malformed payloads and returning clear error messages.
- **💾 Persistent SQLite Database via EF Core 8**:
  - Local database file (`tasks.db`) managed via `Microsoft.EntityFrameworkCore.Sqlite`.
  - Automatic database schema creation and sample seed data on startup.
  - Database files, `.env`, and compilation artifacts are strictly excluded by `.gitignore`.
- **📑 Interactive Swagger UI**:
  - Explore and test all endpoints visually at `http://localhost:5000/swagger`.

---

## 📁 Repository Directory Structure

```text
task-management-app/
├── .gitignore                    # Ignores bin/, obj/, *.db, node_modules/, and .env
├── package.json                  # Root convenience scripts for backend & frontend
├── README.md                     # Complete documentation & setup instructions
├── backend/                      # ASP.NET Core (.NET 8 Web API) Backend
│   ├── backend.csproj            # .NET 8 Project file with EF Core SQLite & Swagger
│   ├── appsettings.json          # SQLite connection string & logging configuration
│   ├── Program.cs                # App bootstrap, CORS, DbContext, and request logger
│   ├── Controllers/
│   │   ├── HealthController.cs   # GET /api/health endpoint
│   │   └── TasksController.cs    # Full CRUD, filtering, search, and stats endpoints
│   ├── Data/
│   │   └── AppDbContext.cs       # EF Core SQLite DbContext & auto-seeding logic
│   └── Models/
│       ├── ApiResponse.cs        # Standard API envelope matching React frontend schema
│       ├── CreateTaskDto.cs      # Request DTO for task creation
│       ├── TaskItem.cs           # Task entity mapped to SQLite 'tasks' table
│       ├── TaskStatsDto.cs       # Analytics response DTO
│       └── UpdateTaskDto.cs      # Request DTO for task updates
└── frontend/                     # React + Vite Client Application
    ├── index.html                # HTML shell with Google Fonts & SEO meta tags
    ├── package.json              # Frontend dependencies (react, lucide-react, vite)
    ├── vite.config.js            # Vite configuration with reverse proxy to port 5000
    └── src/
        ├── App.jsx               # Master state management, CRUD handlers & modal control
        ├── index.css             # Modern CSS design system with CSS custom properties
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
            └── api.js                # Fetch API client connecting to .NET backend
```

---

## 🚀 Installation & Local Setup

### Prerequisites
- **.NET 8 SDK** (installed on system; run `dotnet --version` to verify)
- **Node.js** (v18.0.0 or higher) & **npm**

### Step 1: Clone the Repository
```bash
git clone https://github.com/hariharanofficially/task-management-app.git
cd task-management-app
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 3: Restore .NET Backend Dependencies
```bash
cd backend
dotnet restore
cd ..
```

---

## 🏃 Running the Application Locally

Run the backend and frontend in two separate terminal windows:

### Terminal 1: Start the ASP.NET Core Backend
```bash
cd backend
dotnet run
```
*(Starts on `http://localhost:5000` with SQLite persistence in `tasks.db`)*

Expected console output:
```text
===============================================
🚀 TaskFlow .NET 8 Web API is running!
📡 URL: http://localhost:5000
🩺 Health check: http://localhost:5000/api/health
📋 Swagger Docs: http://localhost:5000/swagger
===============================================
```

### Terminal 2: Start the Frontend React App
```bash
cd frontend
npm run dev
```
*(Starts Vite dev server on `http://localhost:5173`)*

Now open **`http://localhost:5173`** in your browser!

You can also view interactive Swagger documentation at **`http://localhost:5000/swagger`**.

---

## 📡 REST API Reference

All API routes are prefixed with `/api`.

| Method | Endpoint | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Service health check | None |
| **GET** | `/api/tasks` | Get all tasks | `search`, `status`, `priority`, `category`, `sort` |
| **GET** | `/api/tasks/stats` | Get analytics summary | None |
| **GET** | `/api/tasks/{id}` | Get single task by ID | None |
| **POST** | `/api/tasks` | Create a new task | `{ title, description, priority, category, due_date }` |
| **PUT** | `/api/tasks/{id}` | Update an existing task | `{ title, description, priority, category, due_date, status }` |
| **PATCH** | `/api/tasks/{id}/toggle` | Toggle between pending & completed | None |
| **DELETE** | `/api/tasks/{id}` | Delete task permanently | None |

---

## 🧪 Testing Each CRUD Operation

### 1. In the Web UI (`http://localhost:5173`)
1. **Create (C)**: Click **"New Task"** in the top navigation bar (or press `Ctrl+N`). Enter Title, Description, Priority, Category, and Due Date, then click **"Create Task"**.
2. **Read / Search / Filter (R)**: Type in the search box to filter in real time. Switch between **All**, **Active**, and **Completed** tabs. Filter by **Priority** or **Category**.
3. **Update (U)**: Click the **Pencil (Edit)** button on any task card, edit details, and click **"Save Changes"**.
4. **Toggle Status (U)**: Click the checkbox next to any task card to toggle completion.
5. **Delete (D)**: Click the **Trash** icon on a task card and confirm deletion in the modal dialog.

### 2. Via Swagger UI
Visit **`http://localhost:5000/swagger`** in your browser to test each endpoint directly with an interactive GUI.

### 3. Via cURL
```powershell
# Check Health
curl http://localhost:5000/api/health

# Get All Tasks
curl http://localhost:5000/api/tasks

# Get Dashboard Stats
curl http://localhost:5000/api/tasks/stats

# Create Task
curl -X POST http://localhost:5000/api/tasks -H "Content-Type: application/json" -d "{\"title\":\".NET Task\",\"priority\":\"high\",\"category\":\"Work\"}"

# Toggle Completion on Task #1
curl -X PATCH http://localhost:5000/api/tasks/1/toggle

# Delete Task #1
curl -X DELETE http://localhost:5000/api/tasks/1
```

---

## 📦 Git & GitHub Deployment Instructions

To commit and push all newly created code to your repository:

```bash
# 1. Review status (verify no .env, bin/, obj/, or .db files are staged)
git status

# 2. Stage all project files
git add .

# 3. Create a descriptive commit
git commit -m "feat: migrate backend to ASP.NET Core (.NET 8 Web API) with EF Core SQLite and Swagger"

# 4. Ensure you are on the main branch
git branch -M main

# 5. Push to your GitHub repository
git push -u origin main
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
