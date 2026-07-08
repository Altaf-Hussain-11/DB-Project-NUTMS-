# NUTMS - Namal University Transport Management System

A full-stack web application for managing university transport operations at Namal University, Mianwali. The system supports multiple user roles (Administrator, Faculty, Driver, Student) with role-based dashboards and real-time GPS bus tracking.

---

## 📁 Project Structure

```
DB-Project-NUTMS/
├── Code/
│   ├── NUTMS-Frontend/        # React + TypeScript + Vite frontend
│   └── NUMTMS_Backend/        # Node.js + Express backend
├── Documents/
│   ├── Milestone_03_Report.pdf
│   └── NUTMS_Proposal.pdf
├── ERD/                       # Entity Relationship Diagrams
└── Relation_Schema/           # Relational schema diagrams
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** (build tool)
- **React Router DOM** (client-side routing)
- **Axios** (API calls via custom client)
- **React Leaflet** (live GPS map)
- **CSS Variables** (custom theme system)

### Backend
- **Node.js** with **Express**
- **MySQL** (database)
- **bcrypt** (password hashing)
- **JWT** (authentication tokens)
- **nodemon** (development server)

### Database
- **MySQL** with stored procedures, triggers, and functions
- **Database:** `NUTMS`

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Administrator** | Full system access — manage users, vehicles, routes, schedules, bookings, view reports |
| **Faculty** | Submit special trip requests, view schedules, track buses, manage profile |
| **Driver** | View assigned trips, update trip status, report issues |
| **Student** | View schedules, track buses, view profile |

---

## ✨ Key Features

- 🔐 **JWT Authentication** with role-based route protection
- 🗺️ **Live GPS Bus Tracking** with Leaflet maps (10-second polling)
- 🚌 **Vehicle Management** — add, edit, delete buses, log maintenance, assign drivers
- 👤 **User Management** — manage students, faculty, drivers, administrators
- 📅 **Schedule Management** — create and manage route schedules
- 🗺️ **Route Management** — define routes with stops and distances
- 📋 **Special Trip Requests** — faculty can request trips, admins approve/reject
- 📊 **Reports & Analytics** — route performance, driver performance, vehicle utilization
- 🔔 **Real-time Notifications** — in-app notification system
- 👤 **Profile Management** — update name, email, password

---

## 🗄️ Database Schema

### Core Tables
- `USER` — all system users
- `STUDENT`, `FACULTY`, `DRIVER`, `ADMINISTRATOR` — role-specific details
- `VEHICLE` — fleet management
- `ROUTE`, `STOP`, `ROUTE_STOP` — route and stop definitions
- `SCHEDULE` — recurring transport schedules
- `TRIP` — individual trip instances
- `BOOKING` — special trip requests by faculty
- `BOOKING_PASSENGER` — passenger list per booking
- `DRIVER_VE_ASSIGNMENT` — driver-vehicle assignments
- `GPS` — real-time GPS location logs
- `VEHICLE_MAINTENANCE` — maintenance records

### Database Objects
- **Stored Procedures** — all CRUD operations routed through procedures (e.g. `sp_GetVehicles`, `sp_AdminListUsers`)
- **Triggers** — auto-stamp departure time, resolve booking timestamp, update vehicle status on maintenance
- **Functions** — `fn_TotalMaintenanceCost`, `fn_ActiveVehicleCount`, `fn_PendingBookingsCount`
- **Views** — `VIEW_Active_Trips_Fleet`

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- npm

### 1. Database Setup

Open MySQL Workbench and run the SQL files in order:

```sql
-- Step 1: Create schema and tables
source dbDDL.sql

-- Step 2: Insert sample data
source dbDML.sql

-- Step 3: Create procedures, triggers, functions
source dbProcedures.sql
```

### 2. Backend Setup

```bash
cd Code/NUMTMS_Backend
npm install
```

Create a `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=NUTMS
DB_PORT=3306
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd Code/NUTMS-Frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🔑 Sample Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Administrator | altaf.hussain@namal.edu.pk | *(set in DB)* |
| Faculty | najia.nayab@namal.edu.pk | *(set in DB)* |
| Driver | m.khan@namal.edu.pk | *(set in DB)* |
| Student | rabia.ashraf@namal.edu.pk | *(set in DB)* |

---

## 📡 API Overview

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/login` | User login |
| `GET /api/auth/profile` | Get current user profile |
| `GET /api/vehicles` | List all vehicles |
| `GET /api/admin/dashboard` | Admin dashboard summary |
| `GET /api/admin/users` | List users (filterable by role) |
| `GET /api/admin/assignments` | Driver-vehicle assignments |
| `GET /api/admin/bookings` | Special trip requests |
| `GET /api/admin/reports/*` | Analytics reports |
| `GET /api/gps/latest` | Latest GPS readings for all vehicles |
| `GET /api/driver/trips` | Driver's assigned trips |
| `PUT /api/driver/trips/:id/status` | Update trip status |

---

## 📌 Notes

- `node_modules/` is excluded from the repository — run `npm install` after cloning
- GPS positions are simulated every 12 seconds in development via a built-in simulator
- All database operations use stored procedures — direct table queries are avoided
- The frontend uses a centralized API client at `src/services/client.ts`

---

## 👨‍💻 Developed By

**Namal University — Database Systems Project**  
*Transport Management System for university fleet operations*