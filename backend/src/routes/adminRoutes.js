const express = require('express');
const router = express.Router();
const { getDashboardAnalytics } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleGuardMiddleware');

router.use(protect);
router.get('/analytics', requireRole('superadmin', 'districtadmin'), getDashboardAnalytics);

module.exports = router;
