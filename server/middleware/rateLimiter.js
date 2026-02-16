const rateLimit = require('express-rate-limit');

// Rate limiter for login: 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for registration: 5 attempts per 15 minutes per IP
const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { message: 'Too many registration attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { loginLimiter, registerLimiter };
