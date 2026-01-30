# Self-Paced Activities - Healthcare Management System

**Student Name:** _______________  
**Section:** _______________  
**Date:** _______________

---

# Activity 3: Threat Modeling

## IDENTIFYING SECURITY OBJECTIVES

### Business Case Description
A Healthcare Management System (HMS) designed to manage patient records, appointments, and medical billing with HIPAA compliance requirements.

### Company and Industry
Healthcare / Medical Software Provider

### Solution Requirements
- Secure patient data management (PHI - Protected Health Information)
- Role-based access control (Admin, Doctor, Staff)
- Appointment scheduling and billing management
- JWT-based authentication

### Compliance Requirements
- HIPAA (Health Insurance Portability and Accountability Act)
- Data encryption requirements for PHI
- Audit logging for access to patient records

### Quality of Service Requirements
- 99.9% uptime for critical healthcare operations
- < 2 second response time for patient lookups
- Secure backup and recovery procedures

### Assets
| Asset | Description | Value |
|-------|-------------|-------|
| Patient Records | Personal health information | Critical |
| User Credentials | Usernames, hashed passwords | High |
| JWT Tokens | Authentication tokens | High |
| MongoDB Database | All system data | Critical |
| Billing Information | Financial patient data | High |

### Team
- Full-stack developers
- Security engineers
- Database administrators
- Healthcare compliance officers

### Security Objectives
1. Protect patient data confidentiality (HIPAA compliance)
2. Ensure data integrity for medical records
3. Maintain system availability for healthcare operations
4. Implement proper authentication and authorization
5. Audit all access to sensitive data

---

## CREATE AN APPLICATION OVERVIEW

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INTERNET ZONE                                │
│  ┌─────────────┐                                                     │
│  │   Browser   │ ◄──── User (Admin/Doctor/Staff)                    │
│  └──────┬──────┘                                                     │
└─────────┼───────────────────────────────────────────────────────────┘
          │ HTTPS (Port 5173)
┌─────────┼───────────────────────────────────────────────────────────┐
│         ▼              DMZ ZONE                                      │
│  ┌─────────────┐       ┌─────────────┐                              │
│  │   React     │ HTTP  │   Express   │                              │
│  │   Client    │◄─────►│   Server    │                              │
│  │  (Vite)     │5000   │  (Node.js)  │                              │
│  └─────────────┘       └──────┬──────┘                              │
└────────────────────────────────┼────────────────────────────────────┘
                                 │ MongoDB Driver
┌────────────────────────────────┼────────────────────────────────────┐
│                                ▼    DATABASE ZONE                    │
│                        ┌─────────────┐                              │
│                        │  MongoDB    │                              │
│                        │   Atlas     │                              │
│                        └─────────────┘                              │
└─────────────────────────────────────────────────────────────────────┘
```

### Application Overview Description
The Healthcare Management System is a full-stack web application consisting of:
- **Frontend**: React.js with Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js with Express.js REST API
- **Database**: MongoDB Atlas (NoSQL)
- **Authentication**: JWT tokens with bcrypt password hashing

### Roles
| Role | Permissions |
|------|-------------|
| Admin | Full CRUD on all resources, user management |
| Doctor | Read/Update patients, Full appointments |
| Staff | Read patients, Create appointments, Billing |

### Key Usages
1. Patient registration and record management
2. Appointment scheduling with doctors
3. Invoice generation and billing
4. User authentication and role-based access

### Technologies
- React 18.2.0, Vite 5.1.6, TailwindCSS 3.4.1
- Node.js, Express 5.1.0
- MongoDB/Mongoose 9.0.0
- JWT (jsonwebtoken 9.0.2), bcryptjs 3.0.3
- Helmet 8.1.0 for security headers

### Security Mechanisms
1. JWT-based authentication (1-hour expiry)
2. bcrypt password hashing (10 rounds)
3. Role-based authorization middleware
4. Helmet.js for HTTP security headers
5. CORS enabled

---

## DECOMPOSE YOUR APPLICATION

### Data Flow Diagram

```
                              ┌────────────────┐
                              │   External     │
                              │   User         │
                              └───────┬────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
            ┌───────────┐     ┌───────────┐     ┌───────────┐
            │  Login    │     │  Patient  │     │  Billing  │
            │  Process  │     │  Mgmt     │     │  Process  │
            └─────┬─────┘     └─────┬─────┘     └─────┬─────┘
                  │                 │                 │
                  ▼                 ▼                 ▼
            ┌─────────────────────────────────────────────┐
            │              Express API Layer              │
            │  /api/auth  /api/patients  /api/billing     │
            └──────────────────┬──────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │   Auth Middleware    │
                    │   verifyToken()      │
                    │   authorizeRoles()   │
                    └──────────┬──────────┘
                               │
                               ▼
            ┌─────────────────────────────────────────────┐
            │            MongoDB Atlas                     │
            │  Users | Patients | Appointments | Invoices │
            └─────────────────────────────────────────────┘
```

### Trust Boundaries
1. **Internet → Client**: Untrusted user input
2. **Client → Server**: Crosses trust boundary (requires JWT)
3. **Server → Database**: Internal trusted zone

### Entry Points
| Entry Point | Method | Authentication |
|-------------|--------|----------------|
| /api/auth/login | POST | None |
| /api/auth/register | POST | None (VULNERABILITY!) |
| /api/patients | CRUD | JWT + Role |
| /api/appointments | CRUD | JWT + Role |
| /api/billing | CRUD | JWT + Role |

### Exit Points
- JSON responses with patient data
- JWT tokens returned on login
- Error messages (may leak info)

---

## IDENTIFY THREATS AND VULNERABILITIES (STRIDE)

| Component | Threat Type | Threat Description | Current State |
|-----------|-------------|--------------------| --------------|
| Registration | **S**poofing | Anyone can register as admin | ❌ Vulnerable |
| Login | **S**poofing | Brute force attacks possible | ❌ No rate limit |
| Patient API | **T**ampering | Raw req.body allows injection | ❌ No validation |
| JWT Token | **R**epudiation | No audit logging of actions | ❌ Missing |
| Error Messages | **I**nfo Disclosure | Internal errors exposed | ❌ Leaks info |
| Patient Data | **D**enial of Service | No request size limits | ❌ Vulnerable |
| Authorization | **E**levation of Privilege | Role in JWT could be modified | ⚠️ Partial |

### Detailed STRIDE Analysis

| ID | Category | Threat | Affected Component |
|----|----------|--------|-------------------|
| T1 | Spoofing | Unauthorized user registration | authRoutes.js |
| T2 | Spoofing | JWT token theft via XSS | AuthContext.jsx |
| T3 | Tampering | NoSQL injection via req.body | All controllers |
| T4 | Tampering | Modifying other users' records | patientController.js |
| T5 | Repudiation | No audit trail for data changes | All models |
| T6 | Info Disclosure | Error messages reveal stack traces | All controllers |
| T7 | Info Disclosure | CORS allows any origin | index.js |
| T8 | DoS | No rate limiting on endpoints | index.js |
| T9 | DoS | No request body size limit | index.js |
| T10 | Elevation | Role set by user during registration | authController.js |

---

## RATE AND PRIORITIZE THREATS (DREAD)

| Threat ID | Damage | Reproducibility | Exploitability | Affected Users | Discoverability | DREAD Score | Priority |
|-----------|--------|-----------------|----------------|----------------|-----------------|-------------|----------|
| T1 | 10 | 10 | 10 | 10 | 10 | **10.0** | Critical |
| T2 | 9 | 8 | 7 | 10 | 6 | **8.0** | High |
| T3 | 9 | 9 | 7 | 10 | 5 | **8.0** | High |
| T6 | 5 | 10 | 10 | 5 | 8 | **7.6** | High |
| T10 | 10 | 10 | 9 | 10 | 3 | **8.4** | Critical |
| T8 | 6 | 10 | 10 | 10 | 8 | **8.8** | High |
| T5 | 7 | 10 | N/A | 10 | 3 | **7.5** | Medium |
| T7 | 5 | 10 | 8 | 5 | 7 | **7.0** | Medium |
| T9 | 4 | 8 | 8 | 8 | 5 | **6.6** | Medium |
| T4 | 8 | 6 | 5 | 8 | 4 | **6.2** | Medium |

---

## IDENTIFY COUNTERMEASURES AND MITIGATIONS

| Threat ID | Threat | Countermeasure | Implementation |
|-----------|--------|----------------|----------------|
| T1 | Unprotected registration | Protect with admin auth | `verifyToken, authorizeRoles('admin')` |
| T2 | JWT in localStorage | HTTP-only cookies | Set via `res.cookie()` with httpOnly flag |
| T3 | NoSQL injection | Input validation | Use `express-validator` |
| T5 | No audit logging | Add audit middleware | Log user actions to DB |
| T6 | Error info disclosure | Sanitize errors | Generic error messages |
| T7 | Open CORS | Restrict origins | Configure allowed origins |
| T8 | No rate limiting | Add rate limiter | Use `express-rate-limit` |
| T9 | No body limit | Limit request size | `express.json({ limit: '10kb' })` |
| T10 | User-controlled role | Validate role assignment | Admin-only role changes |

---
---
---

# Activity 4: Secure Coding Practices

## INPUT VALIDATION & DATA SANITIZATION

### Secure Coding Practices Implementation Checklist

| # | Practice | Status | Implementation |
|---|----------|--------|----------------|
| 1 | Validate all input on server-side | ⚠️ Partial | Mongoose schema validation only |
| 2 | Use allowlist validation | ❌ Missing | Need express-validator |
| 3 | Sanitize user input | ❌ Missing | Need input sanitization |
| 4 | Validate data types | ✅ Done | Mongoose enforces types |
| 5 | Escape special characters | ❌ Missing | XSS protection needed |
| 6 | Validate ObjectId format | ❌ Missing | No ID validation |

### Source Code Snippet - Current State

**File: `server/controllers/patientController.js`**
```javascript
// ❌ VULNERABLE: Directly using req.body without validation
exports.createPatient = async (req, res) => {
    try {
        const newPatient = new Patient(req.body);  // No validation!
        await newPatient.save();
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
```

### Recommended Fix
```javascript
// ✅ SECURE: With input validation
const { body, validationResult } = require('express-validator');

const validatePatient = [
    body('name').trim().notEmpty().escape(),
    body('age').isInt({ min: 0, max: 150 }),
    body('gender').isIn(['Male', 'Female', 'Other']),
    body('contact').isMobilePhone(),
];

exports.createPatient = [validatePatient, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Safe to proceed...
}];
```

---

## AUTHENTICATION & SESSION MANAGEMENT

### Secure Coding Practices Implementation Checklist

| # | Practice | Status | Implementation |
|---|----------|--------|----------------|
| 1 | Hash passwords with strong algorithm | ✅ Done | bcrypt with 10 rounds |
| 2 | Implement session timeout | ✅ Done | JWT expires in 1 hour |
| 3 | Use secure token storage | ❌ Issue | localStorage (XSS vulnerable) |
| 4 | Implement MFA | ❌ Missing | Not implemented |
| 5 | Prevent brute force attacks | ❌ Missing | No rate limiting |
| 6 | Validate password strength | ❌ Missing | No requirements |
| 7 | Secure password reset | ❌ Missing | Not implemented |

### Source Code Snippet - Authentication

**File: `server/controllers/authController.js`**
```javascript
// ✅ Password hashing with bcrypt
exports.register = async (req, res) => {
    try {
        const { username, password, role, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);  // ✅ Good
        const newUser = new User({ 
            username, 
            password: hashedPassword,  // ✅ Stored as hash
            role, 
            name 
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });  // ❌ Leaks error
    }
};

// ✅ JWT token generation
exports.login = async (req, res) => {
    // ...
    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }  // ✅ Token expiry
    );
    res.json({ token, user: {...} });
};
```

---

## AUTHORIZATION & ACCESS CONTROL

### Secure Coding Practices Implementation Checklist

| # | Practice | Status | Implementation |
|---|----------|--------|----------------|
| 1 | Implement RBAC | ✅ Done | Admin/Doctor/Staff roles |
| 2 | Verify authorization on every request | ✅ Done | `authorizeRoles()` middleware |
| 3 | Use least privilege principle | ✅ Done | Role-specific permissions |
| 4 | Protect sensitive routes | ⚠️ Partial | Registration unprotected! |
| 5 | Validate user owns resource | ❌ Missing | No ownership checks |

### Source Code Snippet - Authorization Middleware

**File: `server/middleware/authMiddleware.js`**
```javascript
// ✅ JWT Token Verification
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// ✅ Role-Based Access Control
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access Forbidden' });
        }
        next();
    };
};
```

**File: `server/routes/patientRoutes.js`**
```javascript
// ✅ Protected routes with RBAC
router.use(verifyToken);  // All routes require auth

router.post('/', authorizeRoles('admin', 'doctor', 'staff'), patientController.createPatient);
router.get('/', authorizeRoles('admin', 'doctor', 'staff'), patientController.getPatients);
router.put('/:id', authorizeRoles('admin', 'doctor'), patientController.updatePatient);
router.delete('/:id', authorizeRoles('admin'), patientController.deletePatient);  // Admin only
```

---

## SECURE DATA STORAGE & ENCRYPTION

### Secure Coding Practices Implementation Checklist

| # | Practice | Status | Implementation |
|---|----------|--------|----------------|
| 1 | Encrypt sensitive data at rest | ❌ Missing | PHI stored as plain text |
| 2 | Use TLS for data in transit | ⚠️ Dev only | HTTP in development |
| 3 | Secure environment variables | ✅ Done | dotenv for secrets |
| 4 | Hash passwords | ✅ Done | bcrypt implementation |
| 5 | Secure key management | ⚠️ Basic | JWT_SECRET in .env |
| 6 | Database encryption | ✅ Done | MongoDB Atlas encrypts |

### Source Code Snippet - Data Storage

**File: `server/models/Patient.js`**
```javascript
const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    contact: { type: String, required: true },  // ⚠️ PHI - should encrypt
    address: { type: String },                   // ⚠️ PHI - should encrypt
    medicalHistory: [{ type: String }],          // ⚠️ PHI - should encrypt
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
```

**File: `server/.env`**
```env
PORT=5000
MONGO_URI=mongodb+srv://...  # ✅ Connection string secured
JWT_SECRET=hms_secure_secret_key_2024_!@#  # ✅ Secret for JWT
```

---

## ERROR HANDLING & LOGGING

### Secure Coding Practices Implementation Checklist

| # | Practice | Status | Implementation |
|---|----------|--------|----------------|
| 1 | Generic error messages to users | ❌ Issue | Internal errors exposed |
| 2 | Log errors securely | ❌ Missing | No logging system |
| 3 | Don't log sensitive data | N/A | No logging exists |
| 4 | Implement audit logging | ❌ Missing | No user action logs |
| 5 | Centralized error handling | ❌ Missing | Per-controller try/catch |

### Source Code Snippet - Current Error Handling

**File: `server/controllers/patientController.js`**
```javascript
// ❌ INSECURE: Exposes internal error details
exports.createPatient = async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(500).json({ error: err.message });  // ❌ Leaks info!
    }
};
```

### Recommended Fix
```javascript
// ✅ SECURE: Generic error message, log internally
exports.createPatient = async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        res.status(201).json(newPatient);
    } catch (err) {
        console.error('Create patient error:', err);  // Log internally
        res.status(500).json({ message: 'Failed to create patient' });  // Generic
    }
};
```

---
---
---

# Activity 5: Server Hardening Technique

## SYSTEM VULNERABILITY CHECKLIST

Based on web vulnerability assessment, the following security hardening techniques are needed:

| # | Vulnerability | Risk | Hardening Technique | Status |
|---|---------------|------|---------------------|--------|
| 1 | Open registration endpoint | Critical | Protect with authentication | ❌ |
| 2 | No rate limiting | High | Add express-rate-limit | ❌ |
| 3 | CORS allows all origins | High | Restrict to known domains | ❌ |
| 4 | No request size limit | Medium | Limit JSON body size | ❌ |
| 5 | Default Helmet config | Low | Configure CSP headers | ⚠️ |
| 6 | Exposed error details | High | Sanitize error responses | ❌ |
| 7 | No HTTPS in production | Critical | Enable TLS/SSL | ⚠️ |

---

## SECURITY HARDENING IMPLEMENTATION

### 1. Service Management

**Current State**: Only required services running (Express, MongoDB connection)

**File: `server/index.js`**
```javascript
// ✅ Minimal services - only what's needed
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

// Only essential middleware loaded
app.use(express.json());
app.use(cors());
app.use(helmet());
```

### 2. Server Configuration (Express/Node.js)

**Current Configuration Issues:**
```javascript
// ❌ INSECURE: Default configurations
app.use(cors());  // Allows any origin
app.use(express.json());  // No size limit
app.use(helmet());  // Default settings
```

**Hardened Configuration:**
```javascript
// ✅ SECURE: Hardened configuration
const rateLimit = require('express-rate-limit');

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,  // 100 requests per window
    message: { message: 'Too many requests' }
});

// Stricter limits for auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,  // Only 5 login attempts
});

app.use(limiter);
app.use('/api/auth', authLimiter);

// Request size limit
app.use(express.json({ limit: '10kb' }));

// CORS restriction
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Enhanced Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        },
    },
    referrerPolicy: { policy: 'same-origin' },
    hsts: { maxAge: 31536000, includeSubDomains: true },
}));
```

### 3. Environment Configuration

**File: `server/.env`**
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database (secured in MongoDB Atlas)
MONGO_URI=mongodb+srv://...

# Security
JWT_SECRET=hms_secure_secret_key_2024_!@#
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### 4. Database Security (MongoDB Atlas)

**Implemented Security Measures:**
- ✅ IP Whitelisting configured in Atlas
- ✅ Database user with limited permissions
- ✅ TLS encryption for connections
- ✅ Automated backups enabled

### 5. Error Reporting Configuration

**Disable Detailed Errors in Production:**
```javascript
// Centralized error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);  // Log for debugging
    
    // Don't expose stack traces in production
    if (process.env.NODE_ENV === 'production') {
        res.status(500).json({ message: 'Internal server error' });
    } else {
        res.status(500).json({ message: err.message, stack: err.stack });
    }
});
```

### 6. File and Directory Permissions

**Recommended Structure:**
```
Healthcare-management-system/
├── server/
│   ├── .env          # Never commit! (in .gitignore)
│   ├── index.js      # Read-only in production
│   └── ...
├── client/
│   └── .env          # Never commit!
└── .gitignore        # Must include .env files
```

**`.gitignore` verification:**
```gitignore
# Environment files
.env
.env.local
.env.production

# Dependencies
node_modules/

# Logs
*.log
```

---

## SUMMARY OF HARDENING CHANGES NEEDED

| Category | Change | File | Priority |
|----------|--------|------|----------|
| Rate Limiting | Add express-rate-limit | index.js | High |
| CORS | Restrict to specific origins | index.js | High |
| Request Size | Limit JSON body to 10kb | index.js | Medium |
| Helmet | Configure CSP headers | index.js | Medium |
| Error Handling | Centralized error handler | index.js | High |
| Environment | Validate NODE_ENV | index.js | Medium |
| Logging | Add Winston or Morgan | New file | Low |

---

## Configuration Files to Submit

1. **server/index.js** - Main Express configuration
2. **server/.env.example** - Environment template (without secrets)
3. **server/middleware/errorHandler.js** - Centralized error handling
