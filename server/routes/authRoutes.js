const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');
const { validateRegister, validateLogin } = require('../middleware/validators');
const handleValidation = require('../middleware/handleValidation');

router.post('/register', registerLimiter, validateRegister, handleValidation, authController.register);
router.post('/login', loginLimiter, validateLogin, handleValidation, authController.login);

module.exports = router;
