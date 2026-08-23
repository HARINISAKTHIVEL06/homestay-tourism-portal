const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// Helper token generators
const generateAccessToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'homestay_portal_jwt_secret_key_super_secure_2026', {
        expiresIn: process.env.JWT_EXPIRE || '1d',
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'homestay_portal_jwt_refresh_secret_key_super_secure_2026', {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    });
};

// @desc    Register a new Homestay Owner (Self Signup)
// @route   POST /api/v1/auth/register
// @access  Public
const registerOwner = async (req, res, next) => {
    try {
        const { name, email, phone, password, district } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        const user = await User.create({
            name,
            email,
            phone,
            passwordHash: password,
            role: 'owner',
            district: district || null,
            isVerified: true, // Auto-verified for dev ease
        });

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return res.status(201).json({
            success: true,
            message: 'Owner registration successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                district: user.district,
                token: accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account is deactivated. Contact Super Admin.' });
        }

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                district: user.district,
                token: accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh Access Token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
const refreshToken = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ success: false, message: 'Refresh token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'homestay_portal_jwt_refresh_secret_key_super_secure_2026');
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ success: false, message: 'Invalid refresh token' });
        }

        const newAccessToken = generateAccessToken(user._id, user.role);
        return res.status(200).json({
            success: true,
            data: { token: newAccessToken },
        });
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Refresh token expired or invalid' });
    }
};

// @desc    Logout User
// @route   POST /api/v1/auth/logout
// @access  Private
const logoutUser = async (req, res, next) => {
    try {
        if (req.user) {
            req.user.refreshToken = undefined;
            await req.user.save({ validateBeforeSave: false });
        }
        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'There is no user with that email' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            success: true,
            message: 'Password reset token generated',
            resetToken, // Returned for dev testing ease
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset Password
// @route   POST /api/v1/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        }

        user.passwordHash = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerOwner,
    loginUser,
    refreshToken,
    logoutUser,
    getMe,
    forgotPassword,
    resetPassword,
};
