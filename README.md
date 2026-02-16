# 🏥 Healthcare Management System

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
</p>

<p align="center">
  A comprehensive, full-stack platform for managing patient records, appointments, and medical billing — built with modern web technologies and enterprise-grade security features.
</p>

---

## 📑 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
  - [Frontend UI](#-frontend-ui)
  - [Backend — Data Management](#-backend--data-management)
  - [Database — MongoDB Atlas](#-database--mongodb-atlas)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#-prerequisites)
  - [Installation](#-installation)
  - [Environment Setup](#️-environment-setup)
  - [Seed Database](#-seed-database)
  - [Run Application](#️-run-application)
  - [Access Points](#-access-points)
- [Default Login Credentials](#-default-login-credentials)
- [MongoDB Atlas Setup](#️-mongodb-atlas-setup)
- [API Documentation](#-api-documentation)
  - [Authentication](#-authentication)
  - [Patients](#-patients)
  - [Appointments](#-appointments)
  - [Billing](#-billing)
- [Security Features](#-security-features)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)
- [Changelog](#-changelog)
- [Contributing](#-contributing)
- [Contributors](#-contributors)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 👥 **Patient Management** | Full CRUD operations for patient records with search and filtering |
| 📅 **Appointment Scheduling** | Schedule, manage, and track appointments with doctor assignment |
| 💰 **Billing & Invoices** | Generate invoices with line items, track payment status (Pending/Paid) |
| 🔒 **Role-Based Access Control** | Granular permissions for Admin, Doctor, and Staff roles |
| 🎫 **JWT Authentication** | Secure token-based authentication with session management |
| 🛡️ **Admin Token Gate** | Registration requires a valid admin token to prevent unauthorized signups |
| ⏱️ **Rate Limiting** | Brute-force protection on login and registration endpoints |
| ✅ **Input Validation** | Server-side validation with detailed error messages on all endpoints |
| 🌐 **Environment Config** | Centralized API URL management via environment variables |
| 🎨 **Modern Dark UI** | Responsive dark sidebar with teal accents and smooth animations |

---

## 📸 Screenshots

### 🖥️ Frontend UI

#### Login Page
*Clean, minimal authentication interface with username/password fields and registration link.*

<p align="center">
  <img src="assets/Web%20Application%20Screen%20Designs/Web%20Application%20UI/Screenshot%202026-01-30%20054346.png" alt="Login Page" width="700"/>
</p>

#### Dashboard Overview
*Admin dashboard displaying real-time statistics, quick actions, upcoming appointments, and recent patients.*

<p align="center">
  <img src="assets/Web%20Application%20Screen%20Designs/Web%20Application%20UI/Screenshot%202026-01-30%20061507.png" alt="Dashboard with Data" width="900"/>
</p>

#### Appointments Management
*View all scheduled appointments with patient details, dates, status badges, and inline edit/delete actions.*

<p align="center">
  <img src="assets/Web%20Application%20Screen%20Designs/Web%20Application%20UI/Screenshot%202026-01-30%20061438.png" alt="Appointments List" width="900"/>
</p>

---

### 📊 Backend — Data Management

#### Patient Management
*Tabular patient records with search by name/contact. Supports full CRUD with add, edit, and delete actions.*

<p align="center">
  <img src="assets/Web%20Application%20Screen%20Designs/Database%20Development/Screenshot%202026-01-30%20060620.png" alt="Patient Management — List View" width="900"/>
</p>

#### Add New Patient Modal
*Detailed patient registration form capturing full name, age, gender, contact, address, and medical history.*

<p align="center">
  <img src="assets/Web%20Application%20Screen%20Designs/Database%20Development/Screenshot%202026-01-30%20055800.png" alt="Add Patient Modal" width="700"/>
</p>

#### Schedule Appointment Modal
*Appointment booking with patient/doctor dropdowns, date-time picker, and reason field.*

<p align="center">
  <img src="assets/Web%20Application%20Screen%20Designs/Database%20Development/Screenshot%202026-01-30%20054532.png" alt="Schedule Appointment Modal" width="700"/>
</p>

#### Create Invoice Modal
*Invoice creation with dynamic line items, auto-calculated total, and patient selection.*

<p align="center">
  <img src="assets/Web%20Application%20Screen%20Designs/Database%20Development/Screenshot%202026-01-30%20055450.png" alt="Create Invoice Modal" width="700"/>
</p>

#### Billing & Invoices — List View
*Invoice management dashboard with summary cards (Total, Pending, Paid) and status tracking per patient.*

<p align="center">
  <img src="assets/Web%20Application%20Screen%20Designs/Database%20Development/Screenshot%202026-01-30%20061202.png" alt="Billing List View" width="900"/>
</p>

---

### 🗄️ Database — MongoDB Atlas

#### Billing Record (Single Invoice)
*Individual invoice record showing patient name, amount, status badge, date, and action buttons.*

<p align="center">
  <img src="assets/Web%20Application%20Screen%20Designs/Database%20Development/Screenshot%202026-01-30%20055503.png" alt="Single Invoice Record" width="900"/>
</p>

#### Patient Records (2 Entries)
*Patient collection with structured columns: Name, Age, Gender, Contact, and CRUD actions.*

<p align="center">
  <img src="assets/Web%20Application%20Screen%20Designs/Database%20Development/Screenshot%202026-01-30%20055826.png" alt="Patient Records Table" width="900"/>
</p>

#### Appointments List (Full Data)
*Complete appointments view with all scheduled check-ups, dates, and status badges.*

<p align="center">
  <img src="assets/Web%20Application%20Screen%20Designs/Database%20Development/Screenshot%202026-01-30%20061002.png" alt="Appointments Full Data" width="900"/>
</p>

#### Dashboard (Initial State)
*Fresh dashboard with single patient record and no appointments — demonstrating clean initial state.*

<p align="center">
  <img src="assets/Web%20Application%20Screen%20Designs/Web%20Application%20UI/Screenshot%202026-01-30%20054404.png" alt="Dashboard Initial State" width="900"/>
</p>

---

## 🛠️ Tech Stack

| Layer | Technologies |  
|-------|-------------|
| **Frontend** | React, Vite, TailwindCSS, Framer Motion |
| **Backend** | Node.js, Express, MongoDB, Mongoose ODM |
| **Auth** | JWT, bcrypt, RBAC (Admin, Doctor, Staff) |
| **Security** | express-rate-limit, express-validator, Admin Token Gate |
| **Dev Tools** | nodemon, dotenv, cors |

---

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd Healthcare-management-system

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### ⚙️ Environment Setup

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hms_db?appName=Cluster0
JWT_SECRET=your_jwt_secret_key_here
ADMIN_REGISTER_TOKEN=hms_admin_register_2024_!@#
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Important:** Both `.env` files are excluded from version control via `.gitignore`.

### 🌱 Seed Database

```bash
cd server
node seed.js
```

### ▶️ Run Application

| Terminal | Command | Directory |
|----------|---------|-----------|
| 1️⃣ Server | `npm run dev` | `/server` |
| 2️⃣ Client | `npm run dev` | `/client` |

### 🌐 Access Points

| Service | URL |
|---------|-----|
| 🖥️ Frontend | http://localhost:5173 |
| ⚡ Backend API | http://localhost:5000 |

---

## 🔐 Default Login Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin` | `password123` | 👑 Admin |
| `doctor` | `password123` | 🩺 Doctor |
| `staff` | `password123` | 👤 Staff |

> 💡 Run `node seed.js` in the server folder to create these users.

---

## ☁️ MongoDB Atlas Setup

1. 🌐 Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. 🗄️ Create a free M0 cluster
3. 👤 **Database Access**: Add a database user with read/write permissions
4. 🌍 **Network Access**: Whitelist your IP (or `0.0.0.0/0` for development)
5. 🔗 **Connect**: Get connection string and update `server/.env`

> ⚠️ **Important:** Add `/hms_db` to the connection string before the `?` to specify the database name.

---

## 📡 API Documentation

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user *(requires `x-admin-token` header)* |
| POST | `/api/auth/login` | Login user *(rate-limited: 10 req/15 min)* |

### 👥 Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | Get all patients |
| POST | `/api/patients` | Create patient *(validated: name, age, gender, contact)* |
| PUT | `/api/patients/:id` | Update patient |
| DELETE | `/api/patients/:id` | Delete patient |

### 📅 Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | Get all appointments |
| POST | `/api/appointments` | Create appointment *(validated: patient, doctor, date)* |
| PUT | `/api/appointments/:id` | Update appointment |
| DELETE | `/api/appointments/:id` | Delete appointment |

### 💳 Billing
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/billing` | Get all invoices |
| POST | `/api/billing` | Create invoice *(validated: patient, amount, status)* |
| PUT | `/api/billing/:id` | Update invoice |
| DELETE | `/api/billing/:id` | Delete invoice |

---

## 🛡️ Security Features

| Feature | Description |
|---------|-------------|
| **Admin Token Registration** | User registration requires a valid `x-admin-token` header (configured in `server/.env`) |
| **Rate Limiting** | Login: 10 req/15 min · Registration: 5 req/15 min per IP |
| **Input Validation** | `express-validator` schemas on all endpoints with detailed error messages |
| **JWT Authentication** | Secure token-based auth with expiration |
| **Role-Based Access** | 3 roles (Admin, Doctor, Staff) with granular permissions |
| **Password Hashing** | bcrypt with salt rounds for secure password storage |
| **Environment Variables** | All secrets isolated in `.env` files (not committed to repo) |

> 💡 **Admin Token:** Share the `ADMIN_REGISTER_TOKEN` only with authorized personnel who need to create new user accounts.

---

## 📁 Project Structure

```
Healthcare-management-system/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components (Sidebar, Layout)
│   │   ├── config/             # API URL configuration
│   │   ├── context/            # Auth context (login, register, token)
│   │   └── pages/              # Page components (Dashboard, Patients, etc.)
│   ├── .env                    # Client environment variables
│   └── package.json
├── server/                     # Node.js + Express backend
│   ├── controllers/            # Route handlers (auth, patients, etc.)
│   ├── middleware/              # Auth, rate limiting, validation
│   ├── models/                 # Mongoose schemas (User, Patient, etc.)
│   ├── routes/                 # API route definitions
│   ├── seed.js                 # Database seeder for default users
│   ├── .env                    # Server environment variables
│   └── package.json
├── assets/                     # Screenshots and design references
│   └── Web Application Screen Designs/
│       ├── Web Application UI/
│       └── Database Development/
└── README.md
```

---

## 🔧 Troubleshooting

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` | MongoDB not running. Check Atlas connection or start local MongoDB |
| `Authentication failed` | Verify username/password in `server/.env` |
| `IP not whitelisted` | Add your IP in Atlas → Network Access |
| `User not found` | Run `node seed.js` to create default users |
| `403 - Registration requires admin token` | Provide valid `ADMIN_REGISTER_TOKEN` in the registration form |
| `429 - Too many requests` | Rate limit reached. Wait 15 minutes before retrying |
| `400 - Validation errors` | Check request body matches required field formats |

---

## 📝 Changelog

### v1.2.0 (2026-02-16) — Security Hardening & Input Validation
- **🔒 Security**
    - Implemented admin token authentication gate for user registration (`x-admin-token` header)
    - Added `express-rate-limit` for login (10 req/15 min) and registration (5 req/15 min)  
    - Created comprehensive input validation with `express-validator` for all API endpoints
- **✨ Features**  
    - Environment-based API URL configuration with `VITE_API_URL`
    - Centralized API config module at `client/src/config/api.js`
    - Admin Token field added to the registration UI form
- **🔧 Middleware**
    - New: `rateLimiter.js` — Rate limiting middleware for auth routes
    - New: `validators.js` — Schema validation for auth, patients, appointments, billing
    - New: `handleValidation.js` — Unified validation error response handler
- **📝 Configuration**
    - Added `ADMIN_REGISTER_TOKEN` to server environment variables
    - Added `VITE_API_URL` to client environment variables

---

### v1.1.0 (2026-01-30) — Database Integration & Full UI Implementation
- **🗄️ Database**
    - Connected MongoDB Atlas with production cluster configuration
    - Implemented 4 core collections: Users, Patients, Appointments, Invoices
    - Added seed script (`seed.js`) for default user accounts
- **📸 Documentation**
    - Captured frontend UI screenshots (Login, Dashboard, Appointments)
    - Captured database/backend screenshots (Patient Management, Billing, Modals)
    - Documented MongoDB Atlas setup process
- **🎨 UI Enhancements**
    - Finalized responsive design across all dashboard views
    - Implemented patient search functionality with real-time filtering
    - Enhanced billing invoice management with dynamic line items
    - Added appointment scheduling modal with doctor/patient dropdowns

---

### v1.0.1 (2026-01-12) — UI/UX Modernization
- **💄 Design**
    - Implemented modern dark sidebar theme (`Slate-900`) to reduce eye strain
    - Added `Teal-400` accents for active navigation states
    - Updated main content background to `Slate-50` for better contrast
- **🔧 Fixes**
    - Resolved UI brightness uniformity issues
    - Improved navigation link visibility and hover states
    - Reference: *User Feedback — "Left side is too bright"*

---

### v1.0.0 (2026-01-05) — Initial Release
- **🎉 Core Features**
    - Patient management with full CRUD operations
    - Appointment scheduling system with date/time and doctor assignment
    - Billing and invoice generation with line items
    - JWT-based authentication with token management
    - Role-based access control (Admin, Doctor, Staff)
- **🏗️ Architecture**
    - React frontend with Vite build tool and hot module replacement
    - Express backend with RESTful API design
    - MongoDB database with Mongoose ODM
    - TailwindCSS + Framer Motion for responsive UI animations
- **📦 Initial Setup**
    - Project structure, dependencies, and scripts
    - Development server with nodemon auto-restart
    - Basic README documentation

---

## 🤝 Contributing

Contributions are welcome! 

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔃 Open a Pull Request


<!-- Contributors down below, kindly paste your github URL thanks and also you can revise your suited job title position -->
### 👋 Contributors
### Special thanks to all my groupmates: 
 * ####  😎 [Jay Arre Talosig](https://github.com/flexycode) - Machine Learning Engineer | Blockchain Developer | Bioinformatics Scientist    
 * ####  🕵️ [Alexander Castilo](https://github.com/xandercastillo0305-dev) - Penetration Tester | Software Engineer | Threat Researcher
 * ####  🧑‍💻 [Mark Jhoshua Taberna](https://github.com/MjTaberna) - Digital Forensics Analyst | UI Specialist | Full Stack Engineer 
 * ####  🧑‍💻 [Charles Medio](https://github.com/charles41onlyy) - Machine Learning Engineer | Software Engineer
 * ####  🕵️ [Tristan Jhay Salamat](https://github.com/tristanjhay) - Full Stack Engineer | Forensics Analyst | QA Engineer


 * ####  🕵️‍♀️ [Rinoah Venedict Dela Rama](https://github.com/Noah-dev2217) - Forensic Analyst | QA Engineer | Data Engineer 
 * ####  🥷 [Nicko Nehcterg Dalida](https://github.com/nicknicndin) - Digital Forensics Analyst | QA Engineer | Smart Contract Auditor
---

## 📄 License

This project is licensed under the **[MIT License](LICENSE)**.

> The MIT License is a permissive license that is short and to the point. It lets people do anything they want with your code as long as they provide attribution back to you and don't hold you liable.

**Permissions**: ✅ Commercial use, ✅ Modification, ✅ Distribution, ✅ Private use
**Limitations**: ❌ Liability, ❌ Warranty

#### Git Commit Message: 🏥 Healthcare Management System
---

<p align="center">
  Made with ❤️ by <a href="https://github.com/flexycode">flexycode</a>
</p>

<!-- End point line insert Thanks for visiting enjoy your day, feel free to modify this  -->
---
<p align="center">
<img src="https://readme-typing-svg.demolab.com/?lines=Thanks+For+Visiting+Enjoy+Your+Day+~!;" alt="mystreak"/>
</p>

<!-- Genshin Impact -->
<div align="center">
<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGxxeWR5bzJjajBnc3o5YTc5dGhzc2xsYWJ4aW5rOGZuamNtMjdnayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1rL7L4GaUTe55s5Sfm/giphy.gif" width="300">
<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXk2cnByenBzdHR2Y2plYmxyYnVoY2pjaWRlOTRjcTBrMWV3czI0diZlcD12MV9naWZzX3NlYXJjaCZjdD1n/TH1EAFhvE2ucRSMkPC/giphy.gif" width="300">
</div>

<!-- End point line insert Comeback again next time, feel free to modify this  -->
<p align="center">
<img src="https://readme-typing-svg.demolab.com/?lines=Come+Back+Again+next+time" alt="mystreak"/>
</p>

</p>
    
<br>
<!-- End point insert background effect line of sight color red -->
<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="1000">


