const express = require('express');
const router = express.Router();
const {
    createGrievance,
    getGrievances,
    updateGrievance,
} = require('../controllers/grievanceController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleGuardMiddleware');

router.post('/', createGrievance);

router.use(protect);
router.get('/', requireRole('superadmin', 'districtadmin'), getGrievances);
router.patch('/:id', requireRole('superadmin', 'districtadmin'), updateGrievance);

module.exports = router;
