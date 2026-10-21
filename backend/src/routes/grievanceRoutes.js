const express = require('express');
const router = express.Router();
const {
    createGrievance,
    trackGrievance,
    getGrievances,
    updateGrievance,
} = require('../controllers/grievanceController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleGuardMiddleware');

router.post('/', createGrievance);
router.get('/track/:ticketId', trackGrievance);

router.use(protect);
router.get('/', requireRole('superadmin', 'districtadmin'), getGrievances);
router.patch('/:id', requireRole('superadmin', 'districtadmin'), updateGrievance);

module.exports = router;
