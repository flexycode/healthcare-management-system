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

## 📝 Changelog
 
### v1.0.1 (2025-12-12) - UI/UX Modernization
- **✨ Features**
    - Implemented a **Modern Dark Sidebar Theme** (`Slate-900`) to reduce eye strain and improve visual appeal.
    - Reference: *User Feedback - "Left side is too bright"*
- **💄 Design**
    - Added **Teal-400** accents for active navigation states.
    - Updated main content background to `Slate-50` for better contrast.
- **🔧 Fixes**
    - Resolved UI brightness uniformity issues.
    - Improved navigation link visibility and hover states.


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
 * ####  😎 [Jay Arre Talosig](https://github.com/flexycode) - Machine Learning Engineer | Blockchain Developer | Bioinformatics Scientist    
 * ####  🕵️ [Alexander Castilo](https://github.com/xandercastillo0305-dev) - Penetration Tester | Software Engineer | Threat Researcher
 * ####  🧑‍💻 [Mark Jhoshua Taberna](https://github.com/MjTaberna) - Digital Forensics Analyst | UI Specialist | Full Stack Engineer 
 * ####  🧑‍💻 [Charles Medio](https://github.com/charles41onlyy) - Machine Learning Engineer | Software Engineer
 * ####  🕵️ [Tristan Jhay Salamat](https://github.com/xandercastillo0305-dev) - Full Stack Engineer | Forensics Analyst | QA Engineer


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


