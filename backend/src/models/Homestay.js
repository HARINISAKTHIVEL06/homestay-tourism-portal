const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomType: {
        type: String,
        required: true,
        enum: ['Single', 'Double', 'Suite', 'Family Room', 'Traditional Cottage'],
    },
    count: { type: Number, required: true, default: 1 },
    maxOccupancy: { type: Number, required: true, default: 2 },
    tariff: { type: Number, required: true, default: 1000 },
});

const documentSchema = new mongoose.Schema({
    docType: {
        type: String,
        required: true,
        enum: ['ID Proof', 'Property Ownership / Lease', 'NOC from Local Body', 'Fire Safety Certificate', 'Police Verification'],
    },
    fileUrl: { type: String, required: true },
    verified: { type: Boolean, default: false },
});

const homestaySchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        registrationNumber: {
            type: String,
            unique: true,
            sparse: true, // Only present once approved
        },
        propertyName: {
            type: String,
            required: [true, 'Property name is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        district: {
            type: String,
            required: [true, 'District is required'],
        },
        taluk: {
            type: String,
            required: [true, 'Taluk/Sub-district is required'],
        },
        geoLocation: {
            lat: { type: Number, default: 0 },
            lng: { type: Number, default: 0 },
        },
        contactPhone: {
            type: String,
            required: true,
        },
        contactEmail: {
            type: String,
            required: true,
        },
        rooms: [roomSchema],
        amenities: [
            {
                type: String,
            },
        ],
        documents: [documentSchema],
        photos: [
            {
                type: String,
            },
        ],
        status: {
            type: String,
            enum: [
                'draft',
                'submitted',
                'under_review',
                'inspection_scheduled',
                'inspected',
                'approved',
                'rejected',
                'suspended',
            ],
            default: 'draft',
        },
        rejectionReason: {
            type: String,
        },
        correctionRemarks: {
            type: String,
        },
        assignedInspector: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        assignedOfficer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        inspectionDate: {
            type: Date,
        },
        certificateUrl: {
            type: String,
        },
        certificateIssuedAt: {
            type: Date,
        },
        certificateValidTill: {
            type: Date,
        },
        currentRating: {
            type: Number,
            default: 0,
        },
        digitalSignatureHash: {
            type: String,
        },
        ecoCertified: {
            type: Boolean,
            default: false,
        },
        ratingHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'InspectionReport',
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Search Index
homestaySchema.index({ propertyName: 'text', address: 'text', district: 'text' });

module.exports = mongoose.model('Homestay', homestaySchema);
