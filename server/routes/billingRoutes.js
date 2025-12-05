const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', authorizeRoles('admin', 'staff'), billingController.createInvoice);
router.get('/', authorizeRoles('admin', 'staff'), billingController.getInvoices);
router.put('/:id', authorizeRoles('admin', 'staff'), billingController.updateInvoice);
router.delete('/:id', authorizeRoles('admin'), billingController.deleteInvoice);

module.exports = router;
