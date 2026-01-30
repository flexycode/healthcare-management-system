# Self-Paced Activity 5: Server Hardening Technique

**Student Name:** _______________  
**Section:** _______________  
**Date:** _______________

---

## SYSTEM VULNERABILITY CHECKLIST

Based on security assessment of the Healthcare Management System, the following vulnerabilities require hardening:

| # | Vulnerability | Category | Risk Level | Hardening Required | Status |
|---|---------------|----------|------------|-------------------|--------|
| 1 | Unprotected registration endpoint | Access Control | 🔴 Critical | Add admin-only authentication | ❌ |
| 2 | No rate limiting on API | DoS Prevention | 🟠 High | Implement express-rate-limit | ❌ |
| 3 | CORS allows all origins | Network Security | 🟠 High | Restrict to known domains | ❌ |
| 4 | No request body size limit | DoS Prevention | 🟡 Medium | Limit JSON payload size | ❌ |
| 5 | Default Helmet configuration | HTTP Headers | 🟡 Medium | Configure CSP and security headers | ⚠️ |
| 6 | Internal errors exposed | Information Disclosure | 🟠 High | Sanitize error responses | ❌ |
| 7 | No HTTPS enforcement | Transport Security | 🔴 Critical | Enable TLS/SSL in production | ⚠️ |
| 8 | JWT in localStorage | Session Security | 🟠 High | Use HTTP-only cookies | ❌ |

---

## SECURITY HARDENING IMPLEMENTATION

### 1. SERVICE MANAGEMENT

**Current Services Running:**
- Express.js (Port 5000) - ✅ Required
- MongoDB Connection - ✅ Required
- Vite Dev Server (Port 5173) - ✅ Required for development

**Source Code: `server/index.js`**

```javascript
// ✅ Current: Only essential services loaded
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
```

**Verification:** Only necessary services (Express API and MongoDB) are enabled. No unnecessary services detected.

---

### 2. EXPRESS/NODE.JS CONFIGURATION

#### Current Configuration Issues

**File: `server/index.js` (Lines 11-14)**

```javascript
// ❌ INSECURE: Default/minimal configurations
app.use(express.json());    // No size limit
app.use(cors());            // Allows ANY origin
app.use(helmet());          // Default settings only
```

#### Hardened Configuration

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');  // NEW

dotenv.config();

const app = express();

// ============================================
// SECURITY HARDENING - RATE LIMITING
// ============================================

// General rate limiter for all routes
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 100,                   // 100 requests per window
    message: { message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 5,                     // Only 5 login attempts
    message: { message: 'Too many login attempts, please try again later' },
    skipSuccessfulRequests: true,
});

// ============================================
// SECURITY HARDENING - MIDDLEWARE
// ============================================

// Apply general rate limiter
app.use(generalLimiter);

// ✅ Request body size limit (prevent DoS via large payloads)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ✅ Restrict CORS to specific origins
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Enhanced Helmet security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true,
}));

// ============================================
// ROUTES WITH AUTH RATE LIMITING
// ============================================

// Apply stricter rate limit to auth routes
app.use('/api/auth', authLimiter);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/billing', require('./routes/billingRoutes'));

// ============================================
// CENTRALIZED ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    
    // Don't expose error details in production
    if (process.env.NODE_ENV === 'production') {
        res.status(500).json({ message: 'Internal server error' });
    } else {
        res.status(500).json({ message: err.message });
    }
});
```

---

### 3. ENVIRONMENT CONFIGURATION

**File: `server/.env`**

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5000
NODE_ENV=development

# ============================================
# DATABASE CONFIGURATION
# ============================================
MONGO_URI=mongodb+srv://flexycode:******@cluster0.nxlweyo.mongodb.net/hms_db?appName=Cluster0

# ============================================
# SECURITY CONFIGURATION
# ============================================
JWT_SECRET=hms_secure_secret_key_2024_!@#
JWT_EXPIRES_IN=1h

# ============================================
# CORS CONFIGURATION
# ============================================
CLIENT_URL=http://localhost:5173

# ============================================
# RATE LIMITING
# ============================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
```

**Security Notes:**
- ✅ MongoDB credentials secured in `.env`
- ✅ JWT secret stored securely
- ⚠️ Ensure `.env` is in `.gitignore`
- ⚠️ Use different secrets for production

---

### 4. DATABASE SECURITY (MongoDB Atlas)

**Implemented Security Measures:**

| Security Feature | Status | Configuration |
|-----------------|--------|---------------|
| IP Whitelisting | ✅ | Only allowed IPs can connect |
| Database Authentication | ✅ | Username/password required |
| TLS/SSL Encryption | ✅ | Enabled by default on Atlas |
| Role-Based Access | ✅ | Limited permissions for app user |
| Automated Backups | ✅ | Configured in Atlas dashboard |
| Network Peering | ⚠️ | Optional for VPC |

**Connection String Security:**
```javascript
// Secure MongoDB connection with options
mongoose.connect(process.env.MONGO_URI, {
    // Connection options handled by driver
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
    console.error('MongoDB Connection Error');
    process.exit(1);  // Exit on DB connection failure
});
```

---

### 5. ERROR REPORTING AND LOGGING

**Current Issue:** Internal errors exposed to clients

**Hardened Implementation:**

```javascript
// ============================================
// CENTRALIZED ERROR HANDLER (add to index.js)
// ============================================

// Catch unhandled routes
app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    // Log error internally (consider using Winston)
    console.error(`[${new Date().toISOString()}] Error:`, {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        userId: req.user?.id || 'anonymous'
    });
    
    // Send generic response in production
    if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ message: 'An error occurred' });
    }
    
    // Include details in development only
    res.status(err.status || 500).json({
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
```

---

### 6. FILE AND DIRECTORY PERMISSIONS

**Project Structure:**

```
Healthcare-management-system/
├── server/
│   ├── .env              # ⚠️ NEVER commit! Mode: 600
│   ├── controllers/      # Mode: 644
│   ├── middleware/       # Mode: 644
│   ├── models/           # Mode: 644
│   ├── routes/           # Mode: 644
│   └── index.js          # Mode: 644
├── client/
│   ├── .env              # ⚠️ NEVER commit!
│   └── src/
└── .gitignore            # MUST include .env files
```

**`.gitignore` Verification:**

```gitignore
# Environment variables (CRITICAL)
.env
.env.local
.env.development
.env.production
*.env

# Dependencies
node_modules/

# Logs
logs/
*.log
npm-debug.log*

# Build output
dist/
build/

# IDE files
.vscode/
.idea/
```

---

## SUMMARY OF HARDENING CHANGES

| # | Category | Change | File | Priority | Effort |
|---|----------|--------|------|----------|--------|
| 1 | Rate Limiting | Add express-rate-limit | index.js | 🔴 High | Low |
| 2 | CORS | Restrict origins | index.js | 🔴 High | Low |
| 3 | Request Size | Limit to 10kb | index.js | 🟡 Medium | Low |
| 4 | Helmet | Configure CSP | index.js | 🟡 Medium | Medium |
| 5 | Error Handling | Centralized handler | index.js | 🔴 High | Medium |
| 6 | Registration | Admin-only | authRoutes.js | 🔴 Critical | Low |
| 7 | Logging | Add Winston | New file | 🟡 Medium | Medium |
| 8 | HTTPS | Enable TLS | Deployment | 🔴 Critical | High |

---

## REQUIRED PACKAGE INSTALLATIONS

```bash
# Install security packages
cd server
npm install express-rate-limit --save
npm install winston --save           # For logging (optional)
npm install express-mongo-sanitize --save  # NoSQL injection protection
npm install hpp --save              # HTTP Parameter Pollution protection
```

---

## CONFIGURATION FILES TO SUBMIT

1. **server/index.js** - Main Express configuration with hardening
2. **server/.env.example** - Environment template (without secrets)
3. **server/package.json** - Updated dependencies
4. **.gitignore** - Updated to exclude sensitive files

---

## VERIFICATION CHECKLIST

After implementing hardening:

- [ ] Rate limiting blocks excessive requests (test with >100 requests)
- [ ] CORS rejects requests from unauthorized origins
- [ ] Large request bodies are rejected (test with >10kb payload)
- [ ] Error messages don't expose internal details
- [ ] Helmet security headers are present (check with browser dev tools)
- [ ] `.env` file is not tracked by git
- [ ] Registration requires admin authentication
