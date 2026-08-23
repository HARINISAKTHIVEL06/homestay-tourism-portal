const RatingCriteria = require('../models/RatingCriteria');

// Default initial criteria set
const DEFAULT_CRITERIA = [
    { category: 'Safety & Hygiene', weightPercent: 30, description: 'CCTV, fire extinguishers, first aid kit, clean bedding, sanitized bathrooms' },
    { category: 'Infrastructure & Amenities', weightPercent: 25, description: 'Room size, ventilation, power backup, Wi-Fi, hot water, parking' },
    { category: 'Guest Services & Hospitality', weightPercent: 20, description: 'Traditional welcome, local cuisine, tour guidance, emergency support' },
    { category: 'Sustainability Practices', weightPercent: 15, description: 'Solar energy, rainwater harvesting, plastic-free policy, waste segregation' },
    { category: 'Location & Accessibility', weightPercent: 10, description: 'All-weather road access, scenic view, proximity to tourist spots' },
];

// @desc    Get Rating Criteria Config
// @route   GET /api/v1/rating-criteria
// @access  Public / Authorized
const getCriteria = async (req, res, next) => {
    try {
        let criteria = await RatingCriteria.find({ isActive: true }).sort({ weightPercent: -1 });

        if (criteria.length === 0) {
            // Seed default if empty
            criteria = await RatingCriteria.insertMany(DEFAULT_CRITERIA);
        }

        return res.status(200).json({
            success: true,
            data: criteria,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update Rating Criteria Weights (Super Admin)
// @route   PUT /api/v1/rating-criteria
// @access  Private (Super Admin)
const updateCriteria = async (req, res, next) => {
    try {
        const { criteria } = req.body; // Array of { category, weightPercent, description }

        if (!Array.isArray(criteria)) {
            return res.status(400).json({ success: false, message: 'Criteria list array required' });
        }

        const totalWeight = criteria.reduce((sum, item) => sum + Number(item.weightPercent), 0);
        if (totalWeight !== 100) {
            return res.status(400).json({ success: false, message: `Weights must total exactly 100%. Provided total: ${totalWeight}%` });
        }

        // Upsert items
        for (const item of criteria) {
            await RatingCriteria.findOneAndUpdate(
                { category: item.category },
                { weightPercent: item.weightPercent, description: item.description, isActive: true },
                { upsert: true, new: true }
            );
        }

        const updated = await RatingCriteria.find({ isActive: true });

        return res.status(200).json({
            success: true,
            message: 'Rating criteria weights updated successfully',
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCriteria,
    updateCriteria,
};
