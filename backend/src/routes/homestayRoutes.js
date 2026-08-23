const express = require('express');
const router = express.Router();
const {
    saveHomestayDraft,
    submitHomestay,
    getMyHomestays,
    getHomestays,
    getPublicHomestays,
    getPublicHomestayById,
    getHomestayById,
    reviewHomestay,
    assignInspector,
    uploadDocument,
    uploadPhoto,
    verifyHomestay,
    downloadCertificate,
} = require('../controllers/homestayController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleGuardMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/public', getPublicHomestays);
router.get('/public/:id', getPublicHomestayById);
router.get('/verify/:regNumber', verifyHomestay);
router.get('/:id/certificate', downloadCertificate);

// Protected routes
router.use(protect);

router.post('/', requireRole('owner'), saveHomestayDraft);
router.post('/:id/submit', requireRole('owner'), submitHomestay);
router.get('/mine', requireRole('owner'), getMyHomestays);

router.get('/', requireRole('superadmin', 'districtadmin', 'inspector'), getHomestays);
router.get('/:id', getHomestayById);

router.patch('/:id/review', requireRole('superadmin', 'districtadmin'), reviewHomestay);
router.patch('/:id/assign-inspector', requireRole('superadmin', 'districtadmin'), assignInspector);

router.post('/:id/documents', requireRole('owner'), upload.single('file'), uploadDocument);
router.post('/:id/photos', requireRole('owner'), upload.single('file'), uploadPhoto);

module.exports = router;
