# CTINASSL AY 2025-2026 - Course Project Documentation
## Healthcare Management System

---

| | |
|---|---|
| **Group Name** | **ALTAEGIS INFINITE** |
| **Course** | CTINASSL - Information Assurance and Security |
| **Academic Year** | AY 2025-2026 |
| **Project Title** | Healthcare Management System (HMS) |
| **Date** | February 13, 2026 |

### Group Members

| # | Name |
|---|------|
| 1 | CASTILLO, ALEXANDER |
| 2 | MEDIO, CHARLES |
| 3 | SALAMAT, TRISTAN JHAY |
| 4 | TABERNA, MARK JHOSHUA |
| 5 | TALOSIG, JAY ARRE |

---

## Table of Contents

- [Section 5: Server Hardening Techniques Checklist Summary](#section-5-server-hardening-techniques-checklist-summary)
- [Section 6: Web Vulnerability Assessment Report (OWASP ZAP)](#section-6-web-vulnerability-assessment-report-owasp-zap)
- [Section 7: Reflection (Individual)](#section-7-reflection-individual)

---

# Section 5: Server Hardening Techniques Checklist Summary

## Overview

The following checklist summarizes all server hardening techniques implemented on the Healthcare Management System web server configurations. The HMS runs on a **Node.js/Express.js** backend (Port 5000) with **MongoDB Atlas** as the database and a **React.js/Vite** frontend (Port 5173).

## Server Hardening Techniques - Consolidated Checklist

### 5.1 Service Management

| # | Technique | Before (Vulnerable) | After (Hardened) | Status |
|---|-----------|---------------------|------------------|--------|
| 1 | Unnecessary services disabled | ⚠️ Default setup, all services running | ✅ Only Express API (Port 5000) and MongoDB connection active; Vite dev server isolated | ✅ Implemented |
| 2 | Service enumeration review | ❌ No review performed | ✅ Confirmed only required services (Express, MongoDB driver) loaded in `server/index.js` | ✅ Implemented |

### 5.2 Express/Node.js Configuration Hardening

| # | Technique | Before (Vulnerable) | After (Hardened) | Status |
|---|-----------|---------------------|------------------|--------|
| 3 | Rate Limiting | ❌ No rate limiting, brute force possible | ✅ `express-rate-limit` configured: 100 req/15min (general), 5 req/15min (auth endpoints) | ✅ Implemented |
| 4 | CORS Restriction | ❌ `cors()` allows ANY origin | ✅ CORS restricted to `CLIENT_URL` (localhost:5173) with specific methods and allowed headers | ✅ Implemented |
| 5 | Request Body Size Limit | ❌ No payload size limit, DoS risk | ✅ `express.json({ limit: '10kb' })` and `express.urlencoded({ limit: '10kb' })` | ✅ Implemented |
| 6 | Helmet Security Headers (CSP) | ⚠️ Default `helmet()` config only | ✅ Full CSP directives configured: `defaultSrc`, `scriptSrc`, `styleSrc`, `imgSrc`, `frameSrc`, etc. | ✅ Implemented |
| 7 | X-Powered-By Header Hidden | ⚠️ Helmet default may expose this | ✅ `hidePoweredBy: true` explicitly configured | ✅ Implemented |
| 8 | HSTS Enabled | ❌ Not configured | ✅ `hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }` | ✅ Implemented |
| 9 | Clickjacking Protection | ⚠️ Default only | ✅ `frameguard: { action: "deny" }`, blocks embedding in iframes | ✅ Implemented |
| 10 | XSS Filter | ⚠️ Default only | ✅ `xssFilter: true` explicitly enabled | ✅ Implemented |
| 11 | MIME Sniffing Prevention | ⚠️ Default only | ✅ `noSniff: true`, prevents MIME type sniffing | ✅ Implemented |
| 12 | Referrer Policy | ❌ Not configured | ✅ `referrerPolicy: { policy: "strict-origin-when-cross-origin" }` | ✅ Implemented |
| 13 | Cross-Origin Policies | ❌ Not configured | ✅ `crossOriginEmbedderPolicy`, `crossOriginOpenerPolicy`, `crossOriginResourcePolicy` all configured | ✅ Implemented |
| 14 | DNS Prefetch Control | ❌ Not configured | ✅ `dnsPrefetchControl: { allow: false }`, prevents DNS prefetching leaks | ✅ Implemented |

### 5.3 Authentication Endpoint Hardening

| # | Technique | Before (Vulnerable) | After (Hardened) | Status |
|---|-----------|---------------------|------------------|--------|
| 15 | Registration Endpoint Protection | ❌ `/api/auth/register` publicly accessible, anyone can create admin accounts | ✅ Protected with `verifyToken` + `authorizeRoles('admin')` middleware | ✅ Implemented |
| 16 | Auth Route Rate Limiting | ❌ No rate limit on login attempts | ✅ Auth-specific limiter: 5 attempts/15 minutes, skips successful requests | ✅ Implemented |
| 17 | Password Strength Enforcement | ❌ No password requirements, "123" accepted | ✅ Regex enforcement: 8+ chars, uppercase, lowercase, number, special character | ✅ Implemented |

### 5.4 Error Handling & Information Disclosure Prevention

| # | Technique | Before (Vulnerable) | After (Hardened) | Status |
|---|-----------|---------------------|------------------|--------|
| 18 | Error Message Sanitization | ❌ `res.status(500).json({ error: err.message })`, exposes internal errors | ✅ Generic messages in production: `'Internal server error'`; details only in development | ✅ Implemented |
| 19 | Centralized Error Handler | ❌ Per-controller try/catch with no centralized handler | ✅ Global error handler with 404 catch-all and environment-aware error responses | ✅ Implemented |
| 20 | Structured Error Logging | ❌ No logging system | ✅ Structured `console.error` with timestamp, path, method, and userId for internal tracking | ✅ Implemented |

### 5.5 Database Security (MongoDB Atlas)

| # | Technique | Before (Vulnerable) | After (Hardened) | Status |
|---|-----------|---------------------|------------------|--------|
| 21 | IP Whitelisting | ⚠️ Default Atlas setting | ✅ Only allowed IPs can connect to MongoDB Atlas | ✅ Implemented |
| 22 | Database Authentication | ✅ Already in place | ✅ Username/password required via connection string | ✅ Verified |
| 23 | TLS/SSL Encryption (in transit) | ✅ Enabled by default on Atlas | ✅ MongoDB Atlas enforces TLS for all connections | ✅ Verified |
| 24 | Role-Based Database Access | ⚠️ Single DB user | ✅ Limited permissions for application user; admin access restricted | ✅ Implemented |
| 25 | Automated Backups | ⚠️ Not verified | ✅ Configured in MongoDB Atlas dashboard | ✅ Implemented |
| 26 | Connection Error Handling | ❌ No graceful failure | ✅ `process.exit(1)` on DB connection failure, prevents running without DB | ✅ Implemented |

### 5.6 File & Directory Permissions

| # | Technique | Before (Vulnerable) | After (Hardened) | Status |
|---|-----------|---------------------|------------------|--------|
| 27 | `.env` Excluded from Git | ⚠️ Not verified | ✅ `.gitignore` includes `.env`, `.env.local`, `.env.development`, `.env.production`, `*.env` | ✅ Verified |
| 28 | Sensitive File Permissions | ❌ Default permissions | ✅ `server/.env` set to Mode 600 (owner read/write only) | ✅ Implemented |
| 29 | Node Modules Excluded | ✅ Already in .gitignore | ✅ `node_modules/` excluded from version control | ✅ Verified |
| 30 | Log Files Secured | ❌ Logs not managed | ✅ `logs/`, `*.log`, `npm-debug.log*` added to `.gitignore` | ✅ Implemented |

### 5.7 Environment Configuration Hardening

| # | Technique | Before (Vulnerable) | After (Hardened) | Status |
|---|-----------|---------------------|------------------|--------|
| 31 | Environment-Based API URL | ❌ Hardcoded `http://localhost:5000` | ✅ Uses `process.env.CLIENT_URL` with localhost fallback | ✅ Implemented |
| 32 | JWT Secret Management | ⚠️ Stored in `.env` only | ✅ JWT_SECRET stored in `.env`; different secrets recommended for production | ✅ Implemented |
| 33 | JWT Expiration Configuration | ✅ 1-hour expiry set | ✅ `JWT_EXPIRES_IN=1h` configurable via environment | ✅ Verified |
| 34 | Rate Limit Configuration | ❌ Not configurable | ✅ `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`, `AUTH_RATE_LIMIT_MAX` in `.env` | ✅ Implemented |

### 5.8 Required Security Package Installations

| # | Package | Purpose | Command | Status |
|---|---------|---------|---------|--------|
| 35 | `express-rate-limit` | Rate limiting middleware | `npm install express-rate-limit --save` | ✅ Installed |
| 36 | `winston` | Structured logging | `npm install winston --save` | ⚠️ Optional |
| 37 | `express-mongo-sanitize` | NoSQL injection protection | `npm install express-mongo-sanitize --save` | ✅ Installed |
| 38 | `hpp` | HTTP Parameter Pollution protection | `npm install hpp --save` | ✅ Installed |

---

## Hardening Summary Statistics

| Metric | Count |
|--------|-------|
| **Total Hardening Techniques Applied** | 38 |
| ✅ Fully Implemented | 32 |
| ⚠️ Verified / Optional | 6 |
| ❌ Remaining Gaps | 0 |
| **Categories Covered** | 8 |

| Category | Techniques Applied |
|----------|-------------------|
| Service Management | 2 |
| Express/Node.js Configuration | 12 |
| Authentication Hardening | 3 |
| Error Handling & Logging | 3 |
| Database Security | 6 |
| File & Directory Permissions | 4 |
| Environment Configuration | 4 |
| Security Packages | 4 |

---

# Section 6: Web Vulnerability Assessment Report (OWASP ZAP)

## Overview

This section provides a checklist summary of the OWASP ZAP web vulnerability assessment conducted on the Healthcare Management System. The assessment was performed in two phases:

1. **Initial Scan** - Baseline vulnerability assessment before applying security hardening measures
2. **Post-Hardening Scan** - Follow-up assessment after implementing server hardening and secure coding practices

**Tool Used**: OWASP ZAP (Zed Attack Proxy)  
**Target URL**: `http://localhost:5000` (Express.js Backend API)  
**Scan Type**: Active Scan + Spider Crawl

---

## 6.1 Initial Vulnerability Assessment (Pre-Hardening)

### Scan Configuration

| Parameter | Value |
|-----------|-------|
| **Target** | `http://localhost:5000/api` |
| **Scan Mode** | Standard Active Scan |
| **Authentication** | None (testing unauthenticated access) |
| **Spider Depth** | Default |
| **Date Performed** | _[2-13-2026]_ |

### Initial Scan - Alert Summary

| Risk Level | Alert Count | Description |
|------------|-------------|-------------|
| 🔴 **High** | 3 | Critical vulnerabilities requiring immediate action |
| 🟠 **Medium** | 5 | Significant security concerns |
| 🟡 **Low** | 4 | Minor issues and best practice recommendations |
| 🔵 **Informational** | 3 | Non-critical observations |
| **Total Alerts** | **15** | |

### Initial Scan - Detailed Findings

| # | Alert Name | Risk | Confidence | CWE ID | Description |
|---|-----------|------|------------|--------|-------------|
| 1 | Missing Anti-CSRF Tokens | 🟠 Medium | Medium | CWE-352 | No CSRF protection on POST endpoints |
| 2 | X-Frame-Options Header Not Set | 🟠 Medium | Medium | CWE-1021 | Application can be embedded in iframes (clickjacking) |
| 3 | Content Security Policy (CSP) Not Set | 🟠 Medium | High | CWE-693 | No CSP header to prevent XSS |
| 4 | Server Leaks Information via X-Powered-By | 🟡 Low | High | CWE-200 | Express server identity exposed |
| 5 | X-Content-Type-Options Header Missing | 🟡 Low | Medium | CWE-693 | MIME sniffing not prevented |
| 6 | Absence of Anti-Clickjacking Header | 🟠 Medium | Medium | CWE-1021 | Duplicate of X-Frame-Options finding |
| 7 | Cross-Domain Misconfiguration | 🟠 Medium | Medium | CWE-264 | CORS allows any origin (`*`) |
| 8 | Application Error Disclosure | 🔴 High | Medium | CWE-200 | Internal error messages exposed in API responses |
| 9 | No Rate Limiting | 🔴 High | High | CWE-307 | Authentication endpoints vulnerable to brute force |
| 10 | Unprotected API Endpoint | 🔴 High | High | CWE-284 | `/api/auth/register` accessible without authentication |
| 11 | Cookie No HttpOnly Flag | 🟡 Low | Medium | CWE-1004 | Session tokens accessible via JavaScript |
| 12 | Strict-Transport-Security Header Not Set | 🟡 Low | High | CWE-319 | HSTS not enforced |
| 13 | Modern Web Application | 🔵 Info | Medium | — | Application identified as React SPA |
| 14 | Timestamp Disclosure | 🔵 Info | Low | CWE-200 | Timestamps exposed in responses |
| 15 | User Agent Fuzzer | 🔵 Info | Medium | — | Various user agents accepted |

> **📎 Attachment**: See OWASP ZAP Initial HTML Report - [healthcare-management-system/docs](https://github.com/flexycode/healthcare-management-system/tree/main/docs)

---

## 6.2 Post-Hardening Vulnerability Assessment

### Scan Configuration

| Parameter | Value |
|-----------|-------|
| **Target** | `http://localhost:5000/api` |
| **Scan Mode** | Standard Active Scan |
| **Authentication** | JWT Bearer Token (authenticated scan) |
| **Spider Depth** | Default |
| **Date Performed** | _[2-13-2026]_ |

### Post-Hardening Scan - Alert Summary

| Risk Level | Alert Count (Before) | Alert Count (After) | Change |
|------------|---------------------|---------------------|--------|
| 🔴 **High** | 3 | 0 | ✅ -3 (All resolved) |
| 🟠 **Medium** | 5 | 1 | ✅ -4 |
| 🟡 **Low** | 4 | 1 | ✅ -3 |
| 🔵 **Informational** | 3 | 2 | ✅ -1 |
| **Total Alerts** | **15** | **4** | **✅ -11 (73% reduction)** |

### Post-Hardening - Remaining Findings

| # | Alert Name | Risk | Status | Remarks |
|---|-----------|------|--------|---------|
| 1 | Missing Anti-CSRF Tokens | 🟠 Medium | ⚠️ Remaining | JWT-based API uses token auth instead of CSRF tokens; risk is mitigated by same-origin policy and CORS restrictions |
| 2 | Strict-Transport-Security (Production) | 🟡 Low | ⚠️ Remaining | HSTS configured but not enforceable in localhost development; will be active in production with HTTPS |
| 3 | Modern Web Application | 🔵 Info | ℹ️ Informational | Non-actionable |
| 4 | Timestamp Disclosure | 🔵 Info | ℹ️ Informational | MongoDB `createdAt`/`updatedAt` timestamps, acceptable for application functionality |

> **📎 Attachment**: See OWASP ZAP Post-Hardening HTML Report - [healthcare-management-system/docs](https://github.com/flexycode/healthcare-management-system/tree/main/docs)

---

## 6.3 Vulnerability Resolution Comparison Matrix

| # | Vulnerability | CWE | Initial Risk | Post Status | Hardening Technique Applied |
|---|--------------|------|-------------|-------------|---------------------------|
| 1 | Missing Anti-CSRF Tokens | CWE-352 | 🟠 Medium | ⚠️ Mitigated | JWT auth + CORS restriction replaces CSRF tokens for API |
| 2 | X-Frame-Options Not Set | CWE-1021 | 🟠 Medium | ✅ Resolved | `helmet({ frameguard: { action: "deny" } })` |
| 3 | CSP Not Set | CWE-693 | 🟠 Medium | ✅ Resolved | Full CSP directives in Helmet configuration |
| 4 | X-Powered-By Exposed | CWE-200 | 🟡 Low | ✅ Resolved | `helmet({ hidePoweredBy: true })` |
| 5 | X-Content-Type-Options Missing | CWE-693 | 🟡 Low | ✅ Resolved | `helmet({ noSniff: true })` |
| 6 | Anti-Clickjacking Header Missing | CWE-1021 | 🟠 Medium | ✅ Resolved | Frameguard + CSP frame-ancestors |
| 7 | Cross-Domain Misconfiguration | CWE-264 | 🟠 Medium | ✅ Resolved | CORS restricted to `CLIENT_URL` with whitelisted methods |
| 8 | Application Error Disclosure | CWE-200 | 🔴 High | ✅ Resolved | Centralized error handler; generic messages in production |
| 9 | No Rate Limiting | CWE-307 | 🔴 High | ✅ Resolved | `express-rate-limit`: 100 req/15min general, 5/15min auth |
| 10 | Unprotected API Endpoint | CWE-284 | 🔴 High | ✅ Resolved | Admin-only auth on `/api/auth/register` |
| 11 | Cookie No HttpOnly Flag | CWE-1004 | 🟡 Low | ✅ Resolved | HTTP-only cookie implementation for JWT tokens |
| 12 | HSTS Not Set | CWE-319 | 🟡 Low | ⚠️ Configured | HSTS header set (active in production with HTTPS) |
| 13 | Modern Web Application | — | 🔵 Info | ℹ️ N/A | Informational only |
| 14 | Timestamp Disclosure | CWE-200 | 🔵 Info | ℹ️ Accepted | Required for application functionality |
| 15 | User Agent Fuzzer | — | 🔵 Info | ✅ Resolved | Helmet security headers applied |

---

## 6.4 Resolution Summary

| Metric | Value |
|--------|-------|
| **Total Initial Vulnerabilities** | 15 |
| **Resolved** | 11 |
| **Mitigated / Configured** | 2 |
| **Informational (No Action)** | 2 |
| **Overall Improvement** | **73% vulnerability reduction** |
| **Critical/High Vulnerabilities Remaining** | **0** |

---

# Section 7: Reflection (Individual)

> _Each team member reflects on their learnings about performing secure coding practices and the implications on business applications._

---

## 7.1 CASTILLO, ALEXANDER - Individual Reflection

### Key Learnings

Working on the Healthcare Management System opened my eyes to the critical importance of security in web application development. Before this project, I viewed security as an afterthought, something you add at the end. Through implementing secure coding practices, I learned that security must be baked into the development lifecycle from day one. The concept of "defense in depth" became real to me when I saw how multiple layers (input validation, authentication, authorization, and error handling) each serve as a safety net for the others.

One of the most impactful lessons was understanding OWASP Top 10 vulnerabilities in a hands-on context. Seeing our Healthcare Management System vulnerable to broken access control (A01:2021) because the registration endpoint was unprotected was alarming. Anyone could have created an admin account and accessed all patient records. This is not a hypothetical scenario. It is exactly the kind of vulnerability that leads to real-world data breaches.

The threat modeling exercise using STRIDE was equally transformative. By systematically analyzing each component for Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege, I developed a security-first mindset that I will carry into all future projects.

### Implications on Business Applications

In the healthcare industry, a single data breach can cost millions of dollars in regulatory fines, lawsuits, and reputational damage. HIPAA regulations mandate that Protected Health Information (PHI) must be encrypted at rest and in transit, with audit trails for every access event. Our initial implementation lacked these controls, which would have made any healthcare organization using this software liable for non-compliance.

Beyond compliance, secure coding practices directly impact patient trust. If patients learn that their medical history, contact information, or billing data was exposed due to poor security practices, the institutional credibility of the healthcare provider is permanently damaged. By implementing server hardening, rate limiting, and proper error handling, we demonstrated that a well-secured application protects not only data but also the trust relationship between patients and their healthcare providers.

### Personal Takeaways

I now understand that every line of code I write has security implications. I commit to always considering the OWASP Top 10 when building any web application and to performing threat modeling before writing the first line of implementation code.

---

## 7.2 MEDIO, CHARLES - Individual Reflection

### Key Learnings

This project was my first real experience with implementing server-side security measures on a production-grade web application. The server hardening activity (Activity 5) was particularly enlightening because it showed me how many "invisible" attack surfaces exist in a default Express.js configuration. Before hardening, our application accepted unlimited-size request bodies, allowed CORS from any origin, and returned full internal error stack traces to the client. Each of these default behaviors is a potential entry point for attackers.

I gained deep practical knowledge of HTTP security headers through configuring Helmet.js. Understanding what Content-Security-Policy, X-Frame-Options, Strict-Transport-Security, and Referrer-Policy do individually, and how they work together to create a defense-in-depth strategy, has fundamentally changed how I approach backend development. Previously, I would just use `app.use(helmet())` with defaults and move on. Now I understand why each directive matters and how to configure them for the specific needs of a healthcare application.

The vulnerability assessment using OWASP ZAP was another critical learning experience. Seeing the scan results visualize vulnerabilities I had not even considered, like timestamp disclosure and user agent fingerprinting, taught me that security assessment requires automated tools that think differently from developers.

### Implications on Business Applications

For any business application, especially in regulated industries like healthcare, finance, or government, server configuration is the foundation of security. A misconfigured server renders all application-level security controls useless. If CORS allows any origin, an attacker can make authenticated requests from a malicious site. If error messages expose internal details, attackers gain reconnaissance information for free.

In a business context, the cost of implementing server hardening is negligible compared to the cost of a data breach. According to IBM's 2024 Cost of a Data Breach Report, the average healthcare data breach costs $10.93 million. The hardening techniques we implemented (rate limiting, CORS restriction, security headers, error sanitization) require only a few hours of development time but protect against the most common attack vectors. This is an ROI that every business should prioritize.

### Personal Takeaways

I now treat server configuration as a first-class citizen in my development workflow. Before deploying any application, I will run OWASP ZAP scans and verify that all security headers are correctly configured. Security is not optional; it is a professional responsibility.

---

## 7.3 SALAMAT, TRISTAN JHAY - Individual Reflection

### Key Learnings

The secure coding practices activity (Activity 4) was the most technically challenging part of this project for me, and also the most rewarding. I learned that secure coding is not about adding a security library and hoping for the best. It requires a disciplined, methodical approach to how data flows through every layer of the application.

Input validation was the area where I saw the biggest gap between our initial implementation and best practices. Our controllers directly used `req.body` to create database documents: `new Patient(req.body)`. This is a textbook mass assignment vulnerability. An attacker could inject unexpected fields, including MongoDB operators like `$gt` or `$where`, leading to NoSQL injection attacks. Learning to use `express-validator` to validate and sanitize every input field, and to only destructure expected fields, was a fundamental shift in how I write controller logic.

Authentication and session management also presented important lessons. We were storing JWT tokens in `localStorage`, which is vulnerable to Cross-Site Scripting (XSS) attacks. If any part of our frontend has an XSS vulnerability, all user tokens are compromised. Migrating to HTTP-only cookies ensures that tokens are inaccessible to JavaScript, adding a critical layer of protection.

### Implications on Business Applications

In business applications that handle sensitive data such as patient records, financial information, and personal identifiers, the consequences of insecure coding practices extend beyond technical incidents. They create legal liability. Under HIPAA, healthcare organizations face fines of up to $1.5 million per violation category per year. Under the Philippine Data Privacy Act of 2012 (RA 10173), organizations processing personal data must implement reasonable and appropriate measures to protect it.

The secure coding practices we implemented (input validation, access control enforcement, secure token storage, and comprehensive error handling) are not just technical best practices. They are legal requirements. Business applications that fail to implement these practices expose their organizations to regulatory penalties, civil lawsuits, and criminal liability.

### Personal Takeaways

I have learned that every `req.body` is untrusted. Every response should be sanitized. Every route should be protected. These are not optional enhancements; they are the minimum standard for professional software development. Going forward, I will use security checklists (like OWASP's Secure Coding Practices Guide) as a mandatory part of my development workflow.

---

## 7.4 TABERNA, MARK JHOSHUA - Individual Reflection

### Key Learnings

This project gave me hands-on experience with the full spectrum of application security, from threat modeling to secure coding to server hardening to vulnerability assessment. The most valuable lesson I learned is that security is a continuous process, not a one-time activity. Our initial application passed all functional tests but failed spectacularly on security. This taught me that functional correctness and security are two completely different domains that must both be addressed.

The DREAD risk assessment methodology was particularly impactful for me. By scoring each threat on Damage, Reproducibility, Exploitability, Affected Users, and Discoverability, I learned to prioritize security fixes based on quantitative risk analysis rather than gut feeling. For example, the unprotected registration endpoint scored a perfect 10.0 DREAD score because it was trivially exploitable, affected all users, and caused maximum damage. This systematic approach to risk prioritization is something I will apply in every future project.

Working with error handling and logging taught me about the tension between developer convenience and security. During development, we want detailed error messages for debugging. In production, those same messages become an information goldmine for attackers. Implementing environment-aware error handling (verbose in development, generic in production) solved this tension elegantly.

### Implications on Business Applications

For business applications in the healthcare sector, the implications are life-or-death. If a healthcare management system is compromised, attackers gain access to Protected Health Information (PHI) that includes medical histories, diagnoses, medications, and personal identifiers. This data can be used for identity theft, insurance fraud, or even blackmail.

Beyond the direct harm to patients, a data breach destroys the business itself. Healthcare organizations that suffer breaches face mandatory public disclosure, regulatory investigations, class-action lawsuits, and loss of patient trust. The average time to identify and contain a healthcare data breach is 329 days (IBM, 2024). During that time, attackers have unrestricted access to the most sensitive data imaginable.

The security practices we implemented, including threat modeling, access control, encrypted data storage, error sanitization, and vulnerability assessment, are the industry-standard defenses against these threats. They are not academic exercises; they are the practices that separate secure applications from breached ones.

### Personal Takeaways

I now approach every application I build with the mindset: "How would an attacker exploit this?" This adversarial thinking, combined with systematic methodologies like STRIDE and DREAD, gives me a framework for building secure software. Security is not a feature; it is a quality attribute that must be present in every layer of the application.

---

## 7.5 TALOSIG, JAY ARRE - Individual Reflection

### Key Learnings

Leading the development of the Healthcare Management System taught me that security is fundamentally a design problem, not an implementation problem. When we designed our initial architecture (React frontend, Express API, MongoDB database), we made security decisions, or failed to make them, that propagated through every layer of the application. The unprotected registration endpoint was a design flaw, not a coding bug. The use of `localStorage` for JWT tokens was an architectural decision, not a simple oversight.

The comprehensive threat modeling exercise using STRIDE methodology across all 10 identified threats gave me a structured way to think about security at the architectural level. By mapping threats to specific components (`authRoutes.js` for spoofing, `AuthContext.jsx` for information disclosure, `patientController.js` for tampering), I learned to trace security vulnerabilities to their root causes rather than treating symptoms.

The OWASP ZAP vulnerability assessment was the most eye-opening activity. Running an automated scanner against our own application and seeing 15 alerts across High, Medium, and Low severity levels was humbling. It confirmed that even experienced developers cannot manually identify all vulnerabilities. Automated security testing tools must be part of every development pipeline. After implementing our hardening measures and re-scanning, seeing the alert count drop from 15 to 4 (73% reduction) with zero High-severity alerts remaining was deeply satisfying.

The secure coding practices I am most proud of implementing include the comprehensive Helmet.js configuration with 12+ security directives, the dual-layer rate limiting system (general + auth-specific), and the environment-aware centralized error handler. Each of these demonstrates that enterprise-grade security is achievable even in academic projects.

### Implications on Business Applications

The implications of secure coding practices on business applications cannot be overstated, particularly in healthcare. The Healthcare Management System we built handles patient names, contact information, medical histories, appointment records, and billing data. All of these are classified as Protected Health Information (PHI) under HIPAA and sensitive personal information under the Philippine Data Privacy Act.

In a real business deployment, the vulnerabilities we identified in our initial scan would have constituted a compliance violation before a single patient record was entered. An unprotected registration endpoint means unauthorized access. Missing security headers mean vulnerability to XSS and clickjacking. Exposed error messages mean free reconnaissance for attackers. Each of these is not just a technical issue. It is a regulatory, legal, and ethical failure.

The business case for secure coding practices is clear: prevention is orders of magnitude cheaper than remediation. The hours we spent implementing server hardening, input validation, and access control cost nothing compared to the millions of pesos in regulatory fines, legal fees, and reputational damage that a data breach would cause. For any business building applications that process personal or sensitive data, secure coding practices are not a cost center. They are an insurance policy and a competitive advantage.

### Personal Takeaways

This project transformed my understanding of secure software development. I no longer view security as a separate phase or an additional feature. It is an integral quality attribute that must be present in every design decision, every line of code, and every deployment configuration. I commit to advocating for security-first development in every team I work with and to continuously updating my knowledge of evolving threats and countermeasures. The OWASP Top 10, STRIDE, and DREAD are now permanent tools in my development toolkit.

---

## References

- OWASP Foundation. (2021). *OWASP Top 10:2021*. https://owasp.org/www-project-top-ten/
- OWASP Foundation. (n.d.). *OWASP Secure Coding Practices Quick Reference Guide*. https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/
- OWASP Foundation. (n.d.). *OWASP ZAP - Zed Attack Proxy*. https://www.zaproxy.org/
- IBM Security. (2024). *Cost of a Data Breach Report 2024*. https://www.ibm.com/reports/data-breach
- Microsoft. (n.d.). *The STRIDE Threat Model*. https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats
- U.S. Department of Health and Human Services. (n.d.). *HIPAA Security Rule*. https://www.hhs.gov/hipaa/for-professionals/security/
- Republic Act No. 10173. (2012). *Data Privacy Act of 2012*. https://www.privacy.gov.ph/data-privacy-act/
- Express.js. (n.d.). *Production Best Practices: Security*. https://expressjs.com/en/advanced/best-practice-security.html

---

> **Document prepared by**: ALTAEGIS INFINITE  
> **Healthcare Management System** - CTINASSL AY 2025-2026  
> **Date**: February 13, 2026
