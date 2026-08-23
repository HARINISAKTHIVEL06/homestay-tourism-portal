const express = require('express');
const router = express.Router();
const {
    getAssignedInspections,
    submitScorecard,
    getInspectionHistory,
    downloadCertificate,
} = require('../controllers/inspectionController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleGuardMiddleware');

router.get('/certificate/:id', downloadCertificate);

router.use(protect);

router.get('/assigned', requireRole('inspector'), getAssignedInspections);
router.post('/:homestayId', requireRole('inspector'), submitScorecard);
router.get('/:homestayId/history', getInspectionHistory);

module.exports = router;
