const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema(
    {
        homestay: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Homestay',
            required: true,
        },
        submittedBy: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String },
            isPublic: { type: Boolean, default: true },
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        status: {
            type: String,
            enum: ['open', 'investigating', 'resolved', 'dismissed'],
            default: 'open',
        },
        resolutionNote: String,
        handledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Grievance', grievanceSchema);
