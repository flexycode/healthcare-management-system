# Self-Paced Activity 4: Secure Coding Practices

**Student Name:** _______________  
**Section:** _______________  
**Date:** _______________

---

## INPUT VALIDATION & DATA SANITIZATION

### Secure Coding Practices Checklist

| # | Practice | Status | Notes |
|---|----------|--------|-------|
| 1 | Validate all input on server-side | ⚠️ Partial | Only Mongoose schema validation |
| 2 | Use allowlist validation for expected values | ❌ Missing | No express-validator |
| 3 | Sanitize user input to prevent XSS | ❌ Missing | No input sanitization |
| 4 | Validate data types match expected | ✅ Implemented | Mongoose type enforcement |
| 5 | Escape special characters | ❌ Missing | No HTML/SQL escaping |
| 6 | Validate MongoDB ObjectId format | ❌ Missing | Direct usage of req.params.id |
| 7 | Limit input length | ⚠️ Partial | Only via Mongoose maxlength |

### Source Code Snippet - Current Implementation

**File: `server/controllers/patientController.js` (Lines 3-11)**

```javascript
// ❌ VULNERABLE: No input validation - directly using req.body
exports.createPatient = async (req, res) => {
    try {
        const newPatient = new Patient(req.body);  // No validation!
        await newPatient.save();
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(500).json({ error: err.message });  // Leaks error details
    }
};
```

### Recommended Secure Implementation

```javascript
// ✅ SECURE: With proper input validation
const { body, validationResult } = require('express-validator');

const validatePatient = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name too long')
        .escape(),
    body('age')
        .isInt({ min: 0, max: 150 }).withMessage('Invalid age'),
    body('gender')
        .isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
    body('contact')
        .trim()
        .notEmpty().withMessage('Contact is required')
        .isMobilePhone().withMessage('Invalid phone number'),
    body('address')
        .optional()
        .trim()
        .escape(),
    body('medicalHistory')
        .optional()
        .isArray().withMessage('Medical history must be an array'),
];

exports.createPatient = [validatePatient, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    // Only use validated fields
    const { name, age, gender, contact, address, medicalHistory } = req.body;
    
    try {
        const newPatient = new Patient({ 
            name, age, gender, contact, address, medicalHistory 
        });
        await newPatient.save();
        res.status(201).json(newPatient);
    } catch (err) {
        console.error('Create patient error:', err);
        res.status(500).json({ message: 'Failed to create patient' });
    }
}];
```

---

## AUTHENTICATION & SESSION MANAGEMENT

### Secure Coding Practices Checklist

| # | Practice | Status | Notes |
|---|----------|--------|-------|
| 1 | Hash passwords with strong algorithm | ✅ Implemented | bcrypt with 10 rounds |
| 2 | Implement session timeout | ✅ Implemented | JWT expires in 1 hour |
| 3 | Use secure token storage | ❌ Vulnerable | localStorage (XSS risk) |
| 4 | Implement MFA (Multi-Factor Auth) | ❌ Missing | Not implemented |
| 5 | Prevent brute force attacks | ❌ Missing | No rate limiting |
| 6 | Enforce password strength | ❌ Missing | No password requirements |
| 7 | Secure password reset flow | ❌ Missing | Not implemented |
| 8 | Invalidate sessions on logout | ⚠️ Partial | Only client-side removal |

### Source Code Snippet - Current Implementation

**File: `server/controllers/authController.js` (Lines 5-31)**

```javascript
// ✅ Password hashing with bcrypt (GOOD)
exports.register = async (req, res) => {
    try {
        const { username, password, role, name } = req.body;
        // ❌ Missing: Password strength validation
        // ❌ Missing: Check if username already exists
        const hashedPassword = await bcrypt.hash(password, 10);  // ✅ Good
        const newUser = new User({ 
            username, 
            password: hashedPassword,  // ✅ Stored as hash
            role,  // ❌ User controls their own role!
            name 
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });  // ❌ Leaks error
    }
};

// ✅ JWT token generation (GOOD)
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);  // ✅ Good
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }  // ✅ Token expiry
        );
        res.json({ token, user: { id: user._id, username: user.username, role: user.role, name: user.name } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
```

### Recommended Secure Implementation

```javascript
// ✅ SECURE: With password validation and duplicate check
exports.register = async (req, res) => {
    try {
        const { username, password, name } = req.body;
        
        // Check for duplicate username
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        
        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: 'Password must be 8+ chars with uppercase, lowercase, number, and symbol' 
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);  // Increased rounds
        const newUser = new User({ 
            username, 
            password: hashedPassword,
            role: 'staff',  // ✅ Default role, admin-assigned only
            name 
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Registration failed' });
    }
};
```

---

## AUTHORIZATION & ACCESS CONTROL

### Secure Coding Practices Checklist

| # | Practice | Status | Notes |
|---|----------|--------|-------|
| 1 | Implement RBAC (Role-Based Access Control) | ✅ Implemented | Admin/Doctor/Staff roles |
| 2 | Verify authorization on every request | ✅ Implemented | `authorizeRoles()` middleware |
| 3 | Apply least privilege principle | ✅ Implemented | Role-specific permissions |
| 4 | Protect all sensitive routes | ⚠️ Partial | Registration is unprotected! |
| 5 | Validate resource ownership | ❌ Missing | No ownership checks |
| 6 | Fail secure (deny by default) | ✅ Implemented | 403 on unauthorized |

### Source Code Snippet - Current Implementation

**File: `server/middleware/authMiddleware.js` (Lines 1-25)**

```javascript
const jwt = require('jsonwebtoken');

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

module.exports = { verifyToken, authorizeRoles };
```

**File: `server/routes/patientRoutes.js` (Lines 1-14)**

```javascript
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);  // ✅ All routes require authentication

// ✅ Role-based permissions
router.post('/', authorizeRoles('admin', 'doctor', 'staff'), patientController.createPatient);
router.get('/', authorizeRoles('admin', 'doctor', 'staff'), patientController.getPatients);
router.get('/:id', authorizeRoles('admin', 'doctor', 'staff'), patientController.getPatientById);
router.put('/:id', authorizeRoles('admin', 'doctor'), patientController.updatePatient);
router.delete('/:id', authorizeRoles('admin'), patientController.deletePatient);  // Admin only

module.exports = router;
```

### Issue: Unprotected Registration Route

**File: `server/routes/authRoutes.js` (Lines 1-9)**

```javascript
// ❌ VULNERABLE: No protection on register endpoint
router.post('/register', authController.register);  // Anyone can register!
router.post('/login', authController.login);
```

### Recommended Secure Implementation

```javascript
// ✅ SECURE: Protected registration
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
// Only admins can create new users
router.post('/register', verifyToken, authorizeRoles('admin'), authController.register);
```

---

## SECURE DATA STORAGE & ENCRYPTION

### Secure Coding Practices Checklist

| # | Practice | Status | Notes |
|---|----------|--------|-------|
| 1 | Encrypt sensitive data at rest | ❌ Missing | PHI stored as plain text |
| 2 | Use TLS/HTTPS for data in transit | ⚠️ Dev Only | HTTP in development |
| 3 | Secure environment variables | ✅ Implemented | dotenv for secrets |
| 4 | Hash passwords (never plain text) | ✅ Implemented | bcrypt hashing |
| 5 | Secure key management | ⚠️ Basic | JWT_SECRET in .env only |
| 6 | Database connection encryption | ✅ Implemented | MongoDB Atlas TLS |

### Source Code Snippet - Data Models

**File: `server/models/Patient.js` (Lines 1-13)**

```javascript
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },        // ⚠️ PII
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    contact: { type: String, required: true },     // ⚠️ PHI - Consider encryption
    address: { type: String },                      // ⚠️ PHI - Consider encryption
    medicalHistory: [{ type: String }],             // ⚠️ PHI - Consider encryption
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
```

**File: `server/.env` (Environment Configuration)**

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hms_db
JWT_SECRET=hms_secure_secret_key_2024_!@#
```

### Recommended: Field-Level Encryption

```javascript
// For HIPAA compliance, consider encrypting PHI fields
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes
const IV_LENGTH = 16;

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
```

---

## ERROR HANDLING & LOGGING

### Secure Coding Practices Checklist

| # | Practice | Status | Notes |
|---|----------|--------|-------|
| 1 | Return generic error messages | ❌ Violated | Internal errors exposed |
| 2 | Log errors securely | ❌ Missing | No logging system |
| 3 | Don't log sensitive data | N/A | No logging exists |
| 4 | Implement audit logging | ❌ Missing | No user action tracking |
| 5 | Centralized error handling | ❌ Missing | Per-controller try/catch |
| 6 | Different handling for dev/prod | ❌ Missing | Same behavior everywhere |

### Source Code Snippet - Current Implementation

**File: `server/controllers/patientController.js` (Error Handling Pattern)**

```javascript
// ❌ INSECURE: Exposes internal error details
exports.createPatient = async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(500).json({ error: err.message });  // ❌ Exposes internal error!
    }
};

exports.updatePatient = async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPatient);  // ❌ Returns null if not found (no error check)
    } catch (err) {
        res.status(500).json({ error: err.message });  // ❌ Exposes internal error!
    }
};

exports.deletePatient = async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.json({ message: 'Patient deleted' });  // ❌ Returns success even if ID doesn't exist
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
```

### Recommended Secure Implementation

```javascript
// ✅ SECURE: Generic error messages with proper logging
const logger = require('../utils/logger');  // Use Winston or Morgan

exports.createPatient = async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        
        // Audit log
        logger.info('Patient created', { 
            patientId: newPatient._id, 
            createdBy: req.user.id 
        });
        
        res.status(201).json(newPatient);
    } catch (err) {
        logger.error('Create patient failed', { error: err.message, userId: req.user.id });
        res.status(500).json({ message: 'Failed to create patient' });  // ✅ Generic message
    }
};

exports.updatePatient = async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found' });  // ✅ Check exists
        }
        
        logger.info('Patient updated', { patientId: req.params.id, updatedBy: req.user.id });
        res.json(updatedPatient);
    } catch (err) {
        logger.error('Update patient failed', { error: err.message, patientId: req.params.id });
        res.status(500).json({ message: 'Failed to update patient' });
    }
};

exports.deletePatient = async (req, res) => {
    try {
        const result = await Patient.findByIdAndDelete(req.params.id);
        
        if (!result) {
            return res.status(404).json({ message: 'Patient not found' });  // ✅ Check exists
        }
        
        logger.info('Patient deleted', { patientId: req.params.id, deletedBy: req.user.id });
        res.json({ message: 'Patient deleted successfully' });
    } catch (err) {
        logger.error('Delete patient failed', { error: err.message, patientId: req.params.id });
        res.status(500).json({ message: 'Failed to delete patient' });
    }
};
```

---

## SUMMARY OF SECURE CODING PRACTICES

| Category | Completed | Partial | Missing |
|----------|-----------|---------|---------|
| Input Validation & Data Sanitization | 1 | 2 | 4 |
| Authentication & Session Management | 2 | 2 | 4 |
| Authorization & Access Control | 4 | 1 | 1 |
| Secure Data Storage & Encryption | 3 | 2 | 1 |
| Error Handling & Logging | 0 | 0 | 6 |
| **TOTAL** | **10** | **7** | **16** |

### Priority Fixes Required
1. Add `express-validator` for all endpoints
2. Protect registration with admin authentication
3. Replace `localStorage` with HTTP-only cookies
4. Add centralized error handling
5. Implement audit logging for HIPAA compliance
