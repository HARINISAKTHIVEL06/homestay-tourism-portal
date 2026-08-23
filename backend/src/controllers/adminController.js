const Homestay = require('../models/Homestay');
const Grievance = require('../models/Grievance');
const User = require('../models/User');

// @desc    Get Admin Dashboard KPI & Analytics
// @route   GET /api/v1/admin/analytics
// @access  Private (Super Admin / District Admin)
const getDashboardAnalytics = async (req, res, next) => {
    try {
        const { district } = req.query;
        const filter = {};
        if (district) filter.district = district;

        // Total counts by status
        const totalHomestays = await Homestay.countDocuments(filter);
        const submittedCount = await Homestay.countDocuments({ ...filter, status: 'submitted' });
        const underReviewCount = await Homestay.countDocuments({ ...filter, status: 'under_review' });
        const inspectionScheduledCount = await Homestay.countDocuments({ ...filter, status: 'inspection_scheduled' });
        const approvedCount = await Homestay.countDocuments({ ...filter, status: 'approved' });
        const rejectedCount = await Homestay.countDocuments({ ...filter, status: 'rejected' });

        // Star Rating Breakdown
        const ratingBreakdown = await Homestay.aggregate([
            { $match: { ...filter, status: 'approved' } },
            { $group: { _id: '$currentRating', count: { $sum: 1 } } },
            { $sort: { _id: -1 } },
        ]);

        // District-wise Distribution
        const districtDistribution = await Homestay.aggregate([
            { $group: { _id: '$district', count: { $sum: 1 }, approvedCount: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } } } },
        ]);

        // Grievance Counts
        const totalGrievances = await Grievance.countDocuments();
        const openGrievances = await Grievance.countDocuments({ status: 'open' });

        return res.status(200).json({
            success: true,
            data: {
                kpis: {
                    totalHomestays,
                    submittedCount,
                    underReviewCount,
                    inspectionScheduledCount,
                    approvedCount,
                    rejectedCount,
                    avgSlaDays: 12,
                    totalGrievances,
                    openGrievances,
                },
                ratingBreakdown,
                districtDistribution,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardAnalytics,
};
