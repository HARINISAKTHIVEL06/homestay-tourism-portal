const express = require('express');
const router = express.Router();
const {
    createStaff,
    getUsers,
    updateUser,
    deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleGuardMiddleware');

router.use(protect);

router.post('/staff', requireRole('superadmin'), createStaff);
router.get('/', requireRole('superadmin', 'districtadmin'), getUsers);
router.patch('/:id', requireRole('superadmin'), updateUser);
router.delete('/:id', requireRole('superadmin'), deleteUser);

module.exports = router;
