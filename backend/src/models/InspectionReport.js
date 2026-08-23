const mongoose = require('mongoose');

const scoreItemSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    weightPercent: {
        type: Number,
        required: true,
    },
    score: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    remarks: String,
});

const inspectionReportSchema = new mongoose.Schema(
    {
        homestay: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Homestay',
            required: true,
        },
        inspector: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        inspectionDate: {
            type: Date,
            default: Date.now,
        },
        scores: [scoreItemSchema],
        totalWeightedScore: {
            type: Number,
            required: true,
        },
        starRating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        photos: [String],
        overallRemarks: String,
        status: {
            type: String,
            enum: ['submitted', 'reviewed'],
            default: 'submitted',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('InspectionReport', inspectionReportSchema);
