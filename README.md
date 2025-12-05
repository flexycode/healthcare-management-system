# 🏥 Healthcare Management System

A comprehensive platform for managing patient records, appointments, and medical billing with HIPAA compliance features.

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React, Vite, TailwindCSS, Framer Motion |
| **Backend** | Node.js, Express, MongoDB |
| **Auth** | JWT, bcrypt, RBAC (Admin, Doctor, Staff) |

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

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
JWT_SECRET=your_secret_key_here
```

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

## 🔐 Default Login Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin` | `password123` | 👑 Admin |
| `doctor` | `password123` | 🩺 Doctor |
| `staff` | `password123` | 👤 Staff |

> 💡 Run `node seed.js` in the server folder to create these users.

## ☁️ MongoDB Atlas Setup

1. 🌐 Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. 🗄️ Create a free M0 cluster
3. 👤 **Database Access**: Add a database user with read/write permissions
4. 🌍 **Network Access**: Whitelist your IP (or `0.0.0.0/0` for development)
5. 🔗 **Connect**: Get connection string and update `server/.env`

> ⚠️ **Important:** Add `/hms_db` to the connection string before the `?` to specify the database name.

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### 👥 Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | Get all patients |
| POST | `/api/patients` | Create patient |
| PUT | `/api/patients/:id` | Update patient |
| DELETE | `/api/patients/:id` | Delete patient |

### 📅 Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | Get all appointments |
| POST | `/api/appointments` | Create appointment |
| PUT | `/api/appointments/:id` | Update appointment |
| DELETE | `/api/appointments/:id` | Delete appointment |

### 💳 Billing
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/billing` | Get all invoices |
| POST | `/api/billing` | Create invoice |
| PUT | `/api/billing/:id` | Update invoice |
| DELETE | `/api/billing/:id` | Delete invoice |

## ✨ Features

| Feature | Description |
|---------|-------------|
| 👥 **Patient Management** | CRUD operations for patient records |
| 📅 **Appointment Scheduling** | Schedule and manage appointments |
| 💰 **Billing** | Generate and track invoices |
| 🔒 **Role-Based Access** | Secure access for Admin, Doctor, Staff |
| 🎫 **JWT Authentication** | Secure token-based authentication |

## 🔧 Troubleshooting

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` | MongoDB not running. Check Atlas connection or start local MongoDB |
| `Authentication failed` | Verify username/password in `.env` |
| `IP not whitelisted` | Add your IP in Atlas → Network Access |
| `User not found` | Run `node seed.js` to create default users |

## 📄 License

MIT
