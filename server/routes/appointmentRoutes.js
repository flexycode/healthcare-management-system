const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', authorizeRoles('admin', 'doctor', 'staff'), appointmentController.createAppointment);
router.get('/', authorizeRoles('admin', 'doctor', 'staff'), appointmentController.getAppointments);
router.put('/:id', authorizeRoles('admin', 'doctor', 'staff'), appointmentController.updateAppointment);
router.delete('/:id', authorizeRoles('admin', 'doctor'), appointmentController.deleteAppointment);

module.exports = router;
