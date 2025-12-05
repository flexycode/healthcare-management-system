const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', authorizeRoles('admin', 'doctor', 'staff'), patientController.createPatient);
router.get('/', authorizeRoles('admin', 'doctor', 'staff'), patientController.getPatients);
router.get('/:id', authorizeRoles('admin', 'doctor', 'staff'), patientController.getPatientById);
router.put('/:id', authorizeRoles('admin', 'doctor'), patientController.updatePatient);
router.delete('/:id', authorizeRoles('admin'), patientController.deletePatient);

module.exports = router;
