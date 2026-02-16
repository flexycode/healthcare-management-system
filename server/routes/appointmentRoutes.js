const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validateAppointment, validateMongoId } = require('../middleware/validators');
const handleValidation = require('../middleware/handleValidation');

router.use(verifyToken);

router.post('/', authorizeRoles('admin', 'doctor', 'staff'), validateAppointment, handleValidation, appointmentController.createAppointment);
router.get('/', authorizeRoles('admin', 'doctor', 'staff'), appointmentController.getAppointments);
router.put('/:id', authorizeRoles('admin', 'doctor', 'staff'), validateMongoId, handleValidation, appointmentController.updateAppointment);
router.delete('/:id', authorizeRoles('admin', 'doctor'), validateMongoId, handleValidation, appointmentController.deleteAppointment);

module.exports = router;
