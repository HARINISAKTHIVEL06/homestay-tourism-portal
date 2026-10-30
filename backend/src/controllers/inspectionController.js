const Homestay = require('../models/Homestay');
const InspectionReport = require('../models/InspectionReport');
const RatingCriteria = require('../models/RatingCriteria');
const { calculateRating } = require('../services/ratingCalculator');
const { generateCertificatePDF } = require('../services/certificateGenerator');

// @desc    Get assigned inspections for inspector
// @route   GET /api/v1/inspections/assigned
// @access  Private (Inspector)
const getAssignedInspections = async (req, res, next) => {
    try {
        const query = {
            status: { $in: ['inspection_scheduled', 'inspected', 'approved'] },
            $or: [
                { assignedInspector: req.user._id },
                { district: req.user.district, assignedInspector: { $exists: true, $ne: null } },
                { assignedInspector: { $exists: true, $ne: null } },
            ],
        };

        const homestays = await Homestay.find(query)
            .populate('owner', 'name email phone')
            .populate('assignedInspector', 'name email phone')
            .sort({ inspectionDate: 1, updatedAt: -1 });

        return res.status(200).json({
            success: true,
            count: homestays.length,
            data: homestays,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit Digital Scorecard for Homestay
// @route   POST /api/v1/inspections/:homestayId
// @access  Private (Inspector)
const submitScorecard = async (req, res, next) => {
    try {
        const { homestayId } = req.params;
        const { scores, overallRemarks, photos } = req.body; // scores: [{ category, weightPercent, score(1-5), remarks }]

        const homestay = await Homestay.findById(homestayId).populate('owner', 'name email');
        if (!homestay) {
            return res.status(404).json({ success: false, message: 'Homestay not found' });
        }

        if (!scores || !Array.isArray(scores) || scores.length === 0) {
            return res.status(400).json({ success: false, message: 'Scorecard criteria items required' });
        }

        // Calculate rating
        const { totalWeightedScore, starRating } = calculateRating(scores);

        // Create Inspection Report
        const report = await InspectionReport.create({
            homestay: homestayId,
            inspector: req.user._id,
            inspectionDate: new Date(),
            scores,
            totalWeightedScore,
            starRating,
            overallRemarks,
            photos: photos || [],
            status: 'submitted',
        });

        // Generate unique Registration Number if not already approved
        if (!homestay.registrationNumber) {
            const distCode = homestay.district.substring(0, 3).toUpperCase();
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            homestay.registrationNumber = `STATE-${distCode}-2026-${randomNum}`;
        }

        // Update Homestay status to Approved / Certified
        homestay.status = 'approved';
        homestay.currentRating = starRating;
        homestay.certificateIssuedAt = new Date();
        // Valid for 2 years
        homestay.certificateValidTill = new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000);
        homestay.ratingHistory.push(report._id);

        await homestay.save();

        return res.status(200).json({
            success: true,
            message: `Scorecard submitted successfully! Homestay certified with ${starRating} Star Rating (${totalWeightedScore}%)`,
            data: {
                report,
                registrationNumber: homestay.registrationNumber,
                starRating,
                totalWeightedScore,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Inspection History for Homestay
// @route   GET /api/v1/inspections/:homestayId/history
// @access  Private
const getInspectionHistory = async (req, res, next) => {
    try {
        const reports = await InspectionReport.find({ homestay: req.params.homestayId })
            .populate('inspector', 'name email phone')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Download Homestay Certificate PDF
// @route   GET /api/v1/homestays/:id/certificate
// @access  Private / Public
const downloadCertificate = async (req, res, next) => {
    try {
        const homestay = await Homestay.findById(req.params.id).populate('owner', 'name email');
        if (!homestay) {
            return res.status(404).json({ success: false, message: 'Homestay not found' });
        }

        if (homestay.status !== 'approved') {
            return res.status(400).json({ success: false, message: 'Homestay is not certified yet' });
        }

        generateCertificatePDF(homestay, res);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAssignedInspections,
    submitScorecard,
    getInspectionHistory,
    downloadCertificate,
};
