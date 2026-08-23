const mongoose = require('mongoose');

const ratingCriteriaSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            unique: true,
        },
        weightPercent: {
            type: Number,
            required: true,
        },
        description: String,
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('RatingCriteria', ratingCriteriaSchema);
