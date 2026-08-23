const express = require('express');
const router = express.Router();
const { getCriteria, updateCriteria } = require('../controllers/criteriaController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleGuardMiddleware');

router.get('/', getCriteria);
router.put('/', protect, requireRole('superadmin'), updateCriteria);

module.exports = router;
