const { body, param } = require('express-validator');

// ── Auth Validators ──────────────────────────────────────────
const validateRegister = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .isAlphanumeric()
        .withMessage('Username must contain only letters and numbers'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required'),
    body('role')
        .isIn(['admin', 'doctor', 'staff'])
        .withMessage('Role must be one of: admin, doctor, staff'),
];

const validateLogin = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

// ── Patient Validators ───────────────────────────────────────
const validatePatient = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Patient name is required'),
    body('age')
        .isInt({ min: 0, max: 150 })
        .withMessage('Age must be a number between 0 and 150'),
    body('gender')
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be one of: Male, Female, Other'),
    body('contact')
        .trim()
        .notEmpty()
        .withMessage('Contact information is required'),
];

// ── Appointment Validators ───────────────────────────────────
const validateAppointment = [
    body('patient')
        .isMongoId()
        .withMessage('Valid patient ID is required'),
    body('doctor')
        .isMongoId()
        .withMessage('Valid doctor ID is required'),
    body('date')
        .isISO8601()
        .withMessage('Valid date is required (ISO 8601 format)'),
    body('status')
        .optional()
        .isIn(['Scheduled', 'Completed', 'Cancelled'])
        .withMessage('Status must be one of: Scheduled, Completed, Cancelled'),
];

// ── Billing Validators ───────────────────────────────────────
const validateInvoice = [
    body('patient')
        .isMongoId()
        .withMessage('Valid patient ID is required'),
    body('amount')
        .isFloat({ min: 0 })
        .withMessage('Amount must be a positive number'),
    body('status')
        .optional()
        .isIn(['Pending', 'Paid', 'Cancelled'])
        .withMessage('Status must be one of: Pending, Paid, Cancelled'),
];

// ── Common Param Validator ───────────────────────────────────
const validateMongoId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID format'),
];

module.exports = {
    validateRegister,
    validateLogin,
    validatePatient,
    validateAppointment,
    validateInvoice,
    validateMongoId,
};
