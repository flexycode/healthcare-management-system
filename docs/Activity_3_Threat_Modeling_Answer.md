# Self-Paced Activity 3: Threat Modeling

---

## IDENTIFYING SECURITY OBJECTIVES

### Business Case Description
A Healthcare Management System (HMS) designed to manage patient records, appointments, and medical billing with HIPAA compliance requirements.

### Company and Industry
**Healthcare / Medical Software Provider**

### Solution Requirements
- Secure patient data management (PHI - Protected Health Information)
- Role-based access control (Admin, Doctor, Staff)
- Appointment scheduling and billing management
- JWT-based authentication with secure session handling

### Compliance Requirements
- **HIPAA** (Health Insurance Portability and Accountability Act)
- Data encryption requirements for PHI
- Audit logging for access to patient records
- Secure data backup and recovery

### Quality of Service Requirements
- 99.9% uptime for critical healthcare operations
- Response time < 2 seconds for patient lookups
- Secure real-time data synchronization
- Automated backup procedures

### Assets

| Asset | Description | Value | Owner |
|-------|-------------|-------|-------|
| Patient Records | Personal health information, medical history | Critical | Healthcare Provider |
| User Credentials | Usernames, hashed passwords | High | IT Security |
| JWT Tokens | Authentication tokens for API access | High | Backend System |
| MongoDB Database | All persistent system data | Critical | Database Admin |
| Billing Information | Financial data, invoices | High | Billing Dept |
| Appointment Data | Scheduling records | Medium | Operations |

### Team
- Full-stack Developers
- Security Engineers
- Database Administrators
- Healthcare Compliance Officers
- QA Engineers

### Security Objectives
1. **Confidentiality**: Protect patient data from unauthorized access (HIPAA compliance)
2. **Integrity**: Ensure medical records cannot be tampered with
3. **Availability**: Maintain 99.9% uptime for healthcare operations
4. **Authentication**: Verify user identity before granting access
5. **Authorization**: Enforce role-based access control
6. **Auditability**: Log all access to sensitive data for compliance

---

## CREATE AN APPLICATION OVERVIEW

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           INTERNET ZONE (Untrusted)                     │
│   ┌─────────────┐                                                       │
│   │   Browser   │ ◄──── External Users (Admin / Doctor / Staff)         │
│   └──────┬──────┘                                                       │
└──────────┼──────────────────────────────────────────────────────────────┘
           │ HTTPS Request (Port 5173)
           │
┌──────────┼──────────────────────────────────────────────────────────────┐
│          ▼                    DMZ ZONE                                  │
│   ┌─────────────────┐         ┌─────────────────┐                       │
│   │   React.js      │  REST   │   Express.js    │                       │
│   │   Frontend      │◄───────►│   Backend API   │                       │
│   │   (Vite)        │  :5000  │   (Node.js)     │                       │
│   │   Port: 5173    │         │   Port: 5000    │                       │
│   └─────────────────┘         └────────┬────────┘                       │
│                                        │                                │
│                              ┌─────────┴─────────┐                      │
│                              │  Auth Middleware  │                      │
│                              │ -verifyToken()    │                      │
│                              │ -authorizeRoles() │                      │
│                              └─────────┬─────────┘                      │
└────────────────────────────────────────┼────────────────────────────────┘
                                         │ MongoDB Driver (Encrypted)
┌────────────────────────────────────────┼────────────────────────────────┐
│                                        ▼    DATABASE ZONE (Trusted)     │
│                              ┌─────────────────┐                        │
│                              │   MongoDB Atla  │                        │
│                              │   (Cloud DB)    │                        │
│                              │                 │                        │
│                              │  Collections:   │                        │
│                              │  - users        │                        │
│                              │  - patients     │                        │
│                              │  - appointments │                        │
│                              │  - invoices     │                        │
│                              └─────────────────┘                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Application Overview Description

| Attribute | Description |
|-----------|-------------|
| **Application Name** | Healthcare Management System (HMS) |
| **Type** | Full-stack Web Application |
| **Architecture** | Client-Server with REST API |
| **Frontend** | React.js 18.2.0 with Vite 5.1.6, TailwindCSS 3.4.1, Framer Motion |
| **Backend** | Node.js with Express.js 5.1.0 |
| **Database** | MongoDB Atlas (NoSQL, Cloud-hosted) |
| **Authentication** | JWT (jsonwebtoken 9.0.2) with bcryptjs password hashing |

### Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **Admin** | System administrator | Full CRUD on all resources, user management, system configuration |
| **Doctor** | Medical practitioner | Read/Update patients, full appointment management |
| **Staff** | Administrative staff | Read patients, create appointments, billing operations |

### Key Usages
1. **Patient Management**: Register, view, update, and delete patient records
2. **Appointment Scheduling**: Schedule, modify, and cancel doctor appointments
3. **Billing & Invoicing**: Generate and manage patient invoices
4. **User Authentication**: Secure login/logout with role-based access
5. **Dashboard Analytics**: View statistics and reports

### Technologies

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend Framework | React.js | 18.2.0 |
| Build Tool | Vite | 5.1.6 |
| Styling | TailwindCSS | 3.4.1 |
| Animations | Framer Motion | 11.0.8 |
| HTTP Client | Axios | 1.6.7 |
| Backend Framework | Express.js | 5.1.0 |
| Database ODM | Mongoose | 9.0.0 |
| Authentication | JWT | 9.0.2 |
| Password Hashing | bcryptjs | 3.0.3 |
| Security Headers | Helmet | 8.1.0 |

### Security Mechanisms

| Mechanism | Description | Implementation |
|-----------|-------------|----------------|
| **JWT Authentication** | Token-based auth with 1-hour expiry | `jsonwebtoken` library |
| **Password Hashing** | bcrypt with 10 salt rounds | `bcryptjs` library |
| **RBAC** | Role-based access control | Custom `authorizeRoles()` middleware |
| **HTTP Security Headers** | XSS, clickjacking protection | `helmet` middleware |
| **CORS** | Cross-origin resource sharing | `cors` middleware |

---

## DECOMPOSE YOUR APPLICATION

### Data Flow Diagram (DFD)

```
                                   ┌─────────────────────┐
                                   │    External User    │
                                   │ (Admin/Doctor/Staff)│
                                   └─────────┬───────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
                    ▼                        ▼                        ▼
          ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
          │   1.0 Login     │      │   2.0 Patient   │      │   3.0 Billing   │
          │   Process       │      │   Management    │      │   Process       │
          │                 │      │                 │      │                 │
          │ - Authenticate  │      │ - CRUD Patients │      │ - Create Invoice│
          │ - Generate JWT  │      │ - View Records  │      │ - View Invoices │
          └────────┬────────┘      └────────┬────────┘      └────────┬────────┘
                   │                        │                        │
                   │                        │                        │
                   ▼                        ▼                        ▼
          ┌───────────────────────────────────────────────────────────────────┐
          │                       EXPRESS API LAYER                           │
          │                                                                   │
          │   /api/auth/login    /api/patients    /api/billing                │
          │   /api/auth/register /api/appointments                            │
          └───────────────────────────────┬───────────────────────────────────┘
                                          │
                               ┌──────────┴──────────┐
                               │   AUTH MIDDLEWARE   │
                               │                     │
                               │   verifyToken()     │
                               │   authorizeRoles()  │
                               └──────────┬──────────┘
                                          │
                                          ▼
          ┌───────────────────────────────────────────────────────────────────┐
          │                         DATA STORE                                │
          │                       MongoDB Atlas                               │
          │                                                                   │
          │   ┌─────────┐  ┌──────────┐  ┌──────────────┐  ┌─────────┐        │
          │   │  Users  │  │ Patients │  │ Appointments │  │ Invoices│        │
          │   └─────────┘  └──────────┘  └──────────────┘  └─────────┘        │
          └───────────────────────────────────────────────────────────────────┘
```

### Trust Boundaries

| Boundary | From | To | Security Control |
|----------|------|----|-----------------| 
| TB1 | Internet | Client | HTTPS encryption |
| TB2 | Client | Server | JWT token validation |
| TB3 | Server | Database | MongoDB authentication |

### Entry Points

| ID | Entry Point | Method | Auth Required | Trust Level |
|----|-------------|--------|---------------|-------------|
| EP1 | /api/auth/login | POST | No | Anonymous |
| EP2 | /api/auth/register | POST | No | **VULNERABILITY** |
| EP3 | /api/patients | GET/POST | JWT + Role | Authenticated |
| EP4 | /api/patients/:id | GET/PUT/DELETE | JWT + Role | Authenticated |
| EP5 | /api/appointments | GET/POST | JWT + Role | Authenticated |
| EP6 | /api/billing | GET/POST | JWT + Role | Authenticated |

### Exit Points

| ID | Exit Point | Data Returned | Sensitivity |
|----|------------|---------------|-------------|
| EX1 | Login Response | JWT Token, User Info | High |
| EX2 | Patient API | Patient Records (PHI) | Critical |
| EX3 | Error Messages | Internal Error Details | Medium |
| EX4 | Billing API | Financial Data | High |

---

## IDENTIFY THREATS AND VULNERABILITIES (STRIDE)

### STRIDE Threat Analysis

| ID | Component | S | T | R | I | D | E | Threat Description |
|----|-----------|---|---|---|---|---|---|-------------------|
| T1 | /api/auth/register | ✓ |   |   |   |   | ✓ | Unprotected registration allows anyone to create admin accounts |
| T2 | AuthContext.jsx |   |   |   | ✓ |   |   | JWT stored in localStorage vulnerable to XSS |
| T3 | All Controllers |   | ✓ |   |   |   |   | No input validation allows NoSQL injection |
| T4 | Patient Records |   | ✓ |   |   |   |   | Raw req.body can modify unintended fields |
| T5 | All Models |   |   | ✓ |   |   |   | No audit logging for data changes |
| T6 | Error Handlers |   |   |   | ✓ |   |   | Internal errors exposed to clients |
| T7 | CORS Config |   |   |   | ✓ |   |   | Allows any origin to make requests |
| T8 | Auth Endpoints |   |   |   |   | ✓ |   | No rate limiting allows brute force |
| T9 | Express Config |   |   |   |   | ✓ |   | No request size limit allows DoS |
| T10 | Registration |   |   |   |   |   | ✓ | User controls their own role assignment |

### Detailed Threat Descriptions

**T1 - Spoofing via Unprotected Registration**
- **File**: `server/routes/authRoutes.js`
- **Vulnerability**: Registration endpoint has no authentication
- **Attack**: Attacker registers with `role: "admin"` to gain full access

**T2 - Information Disclosure via XSS**
- **File**: `client/src/context/AuthContext.jsx`
- **Vulnerability**: JWT token stored in `localStorage`
- **Attack**: XSS attack steals token for session hijacking

**T3 - Tampering via NoSQL Injection**
- **File**: `server/controllers/patientController.js`
- **Vulnerability**: `new Patient(req.body)` without validation
- **Attack**: Inject `$gt`, `$where` operators to modify queries

---

## RATE AND PRIORITIZE THREATS (DREAD)

### DREAD Risk Assessment

| ID | Threat | Damage (0-10) | Reproducibility (0-10) | Exploitability (0-10) | Affected Users (0-10) | Discoverability (0-10) | **DREAD Score** | **Priority** |
|----|--------|---------------|------------------------|----------------------|----------------------|------------------------|-----------------|--------------|
| T1 | Unprotected Registration | 10 | 10 | 10 | 10 | 10 | **10.0** | 🔴 Critical |
| T10 | User-Controlled Role | 10 | 10 | 9 | 10 | 5 | **8.8** | 🔴 Critical |
| T8 | No Rate Limiting | 6 | 10 | 10 | 10 | 8 | **8.8** | 🟠 High |
| T3 | NoSQL Injection | 9 | 9 | 7 | 10 | 5 | **8.0** | 🟠 High |
| T2 | JWT in localStorage | 9 | 8 | 7 | 10 | 6 | **8.0** | 🟠 High |
| T6 | Error Info Disclosure | 5 | 10 | 10 | 5 | 8 | **7.6** | 🟠 High |
| T5 | No Audit Logging | 7 | 10 | N/A | 10 | 3 | **7.5** | 🟡 Medium |
| T7 | Open CORS | 5 | 10 | 8 | 5 | 7 | **7.0** | 🟡 Medium |
| T9 | No Body Size Limit | 4 | 8 | 8 | 8 | 5 | **6.6** | 🟡 Medium |
| T4 | Field Pollution | 8 | 6 | 5 | 8 | 4 | **6.2** | 🟡 Medium |

---

## IDENTIFY COUNTERMEASURES AND MITIGATIONS

| Threat ID | Threat | Risk Level | Countermeasure | Implementation |
|-----------|--------|------------|----------------|----------------|
| T1 | Unprotected Registration | Critical | Protect with admin authentication | Add `verifyToken, authorizeRoles('admin')` to register route |
| T10 | User-Controlled Role | Critical | Server-side role assignment | Remove role from user input, assign default 'staff' |
| T2 | JWT in localStorage | High | HTTP-only cookies | Use `res.cookie()` with `httpOnly: true, secure: true` |
| T3 | NoSQL Injection | High | Input validation | Implement `express-validator` on all endpoints |
| T8 | No Rate Limiting | High | Add rate limiter | Install and configure `express-rate-limit` |
| T6 | Error Info Disclosure | High | Sanitize errors | Return generic messages, log details internally |
| T5 | No Audit Logging | Medium | Implement audit trail | Add `createdBy`, `modifiedBy`, `accessLog` to models |
| T7 | Open CORS | Medium | Restrict origins | Configure `cors({ origin: 'https://yourdomain.com' })` |
| T9 | No Body Size Limit | Medium | Limit request size | Add `express.json({ limit: '10kb' })` |
| T4 | Field Pollution | Medium | Whitelist fields | Destructure only expected fields from req.body |

---

## THREAT MODEL SUMMARY

| Category | Count |
|----------|-------|
| Total Threats Identified | 10 |
| 🔴 Critical Priority | 2 |
| 🟠 High Priority | 4 |
| 🟡 Medium Priority | 4 |

### Recommended Immediate Actions
1. Protect `/api/auth/register` endpoint with admin authentication
2. Add `express-validator` for input validation
3. Implement `express-rate-limit` for brute force protection
4. Configure CORS to allow only trusted origins
