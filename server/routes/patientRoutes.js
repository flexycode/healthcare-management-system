const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validatePatient, validateMongoId } = require('../middleware/validators');
const handleValidation = require('../middleware/handleValidation');

router.use(verifyToken);

router.post('/', authorizeRoles('admin', 'doctor', 'staff'), validatePatient, handleValidation, patientController.createPatient);
router.get('/', authorizeRoles('admin', 'doctor', 'staff'), patientController.getPatients);
router.get('/:id', authorizeRoles('admin', 'doctor', 'staff'), validateMongoId, handleValidation, patientController.getPatientById);
router.put('/:id', authorizeRoles('admin', 'doctor'), validateMongoId, handleValidation, patientController.updatePatient);
router.delete('/:id', authorizeRoles('admin'), validateMongoId, handleValidation, patientController.deletePatient);

module.exports = router;
