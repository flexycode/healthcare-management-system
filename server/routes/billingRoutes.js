const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validateInvoice, validateMongoId } = require('../middleware/validators');
const handleValidation = require('../middleware/handleValidation');

router.use(verifyToken);

router.post('/', authorizeRoles('admin', 'staff'), validateInvoice, handleValidation, billingController.createInvoice);
router.get('/', authorizeRoles('admin', 'staff'), billingController.getInvoices);
router.put('/:id', authorizeRoles('admin', 'staff'), validateMongoId, handleValidation, billingController.updateInvoice);
router.delete('/:id', authorizeRoles('admin'), validateMongoId, handleValidation, billingController.deleteInvoice);

module.exports = router;
