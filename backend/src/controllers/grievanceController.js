const Grievance = require('../models/Grievance');
const Homestay = require('../models/Homestay');

// @desc    Submit Grievance / Complaint against homestay
// @route   POST /api/v1/grievances
// @access  Public / Authorized
const createGrievance = async (req, res, next) => {
    try {
        const { homestayId, homestayRegNumber, name, email, phone, subject, description } = req.body;

        let targetId = homestayId;
        if (!targetId && homestayRegNumber) {
            const hs = await Homestay.findOne({ registrationNumber: homestayRegNumber });
            if (hs) targetId = hs._id;
        }

        const homestay = await Homestay.findById(targetId);
        if (!homestay) {
            return res.status(404).json({ success: false, message: 'Homestay not found' });
        }

        const grievance = await Grievance.create({
            homestay: targetId,
            submittedBy: {
                name: name || (req.user ? req.user.name : 'Tourist Guest'),
                email: email || (req.user ? req.user.email : 'guest@example.com'),
                phone: phone || (req.user ? req.user.phone : ''),
                isPublic: !req.user,
            },
            subject,
            description,
        });

        return res.status(201).json({
            success: true,
            message: 'Grievance submitted successfully. It has been forwarded to the District Officer.',
            data: grievance,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Grievances (Admin Queue)
// @route   GET /api/v1/grievances
// @access  Private (Admin / District Officer)
const getGrievances = async (req, res, next) => {
    try {
        const { status, homestayId } = req.query;
        const query = {};

        if (status) query.status = status;
        if (homestayId) query.homestay = homestayId;

        const grievances = await Grievance.find(query)
            .populate('homestay', 'propertyName address district registrationNumber')
            .populate('handledBy', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: grievances.length,
            data: grievances,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update Grievance Status & Resolution
// @route   PATCH /api/v1/grievances/:id
// @access  Private (Admin / District Officer)
const updateGrievance = async (req, res, next) => {
    try {
        const { status, resolutionNote } = req.body;
        const grievance = await Grievance.findById(req.params.id);

        if (!grievance) {
            return res.status(404).json({ success: false, message: 'Grievance record not found' });
        }

        if (status) grievance.status = status;
        if (resolutionNote) grievance.resolutionNote = resolutionNote;
        grievance.handledBy = req.user._id;

        await grievance.save();

        return res.status(200).json({
            success: true,
            message: `Grievance status updated to ${grievance.status}`,
            data: grievance,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createGrievance,
    getGrievances,
    updateGrievance,
};
