const User = require('../models/User');

// @desc    Create staff account (districtadmin / inspector) by Super Admin
// @route   POST /api/v1/users/staff
// @access  Private (Super Admin)
const createStaff = async (req, res, next) => {
    try {
        const { name, email, phone, password, role, district } = req.body;

        if (!['districtadmin', 'inspector'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid staff role' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        const staffUser = await User.create({
            name,
            email,
            phone,
            passwordHash: password,
            role,
            district,
            isVerified: true,
            isActive: true,
        });

        return res.status(201).json({
            success: true,
            message: 'Staff account created successfully',
            data: {
                _id: staffUser._id,
                name: staffUser.name,
                email: staffUser.email,
                phone: staffUser.phone,
                role: staffUser.role,
                district: staffUser.district,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users with optional filtering
// @route   GET /api/v1/users
// @access  Private (Super Admin / District Admin)
const getUsers = async (req, res, next) => {
    try {
        const { role, district, page = 1, limit = 20 } = req.query;
        const query = {};

        if (role) query.role = role;
        if (district) query.district = district;

        // If district admin, restrict view to their district unless searching owners
        if (req.user.role === 'districtadmin' && req.user.district) {
            query.district = req.user.district;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const users = await User.find(query)
            .select('-passwordHash -refreshToken')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        return res.status(200).json({
            success: true,
            count: users.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user status / district
// @route   PATCH /api/v1/users/:id
// @access  Private (Super Admin)
const updateUser = async (req, res, next) => {
    try {
        const { district, isActive, role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (district !== undefined) user.district = district;
        if (isActive !== undefined) user.isActive = isActive;
        if (role !== undefined) user.role = role;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user account
// @route   DELETE /api/v1/users/:id
// @access  Private (Super Admin)
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createStaff,
    getUsers,
    updateUser,
    deleteUser,
};
