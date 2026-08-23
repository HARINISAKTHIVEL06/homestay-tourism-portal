const Homestay = require('../models/Homestay');
const User = require('../models/User');
const { generateCertificatePDF } = require('../services/certificateGenerator');

// @desc    Create or Update Homestay Draft (Owner)
// @route   POST /api/v1/homestays
// @access  Private (Owner)
const saveHomestayDraft = async (req, res, next) => {
    try {
        const {
            _id,
            propertyName,
            description,
            address,
            district,
            taluk,
            geoLocation,
            contactPhone,
            contactEmail,
            rooms,
            amenities,
        } = req.body;

        let homestay;

        if (_id) {
            // Update existing draft
            homestay = await Homestay.findOne({ _id, owner: req.user._id });
            if (!homestay) {
                return res.status(404).json({ success: false, message: 'Homestay application not found or unauthorized' });
            }

            if (!['draft', 'submitted'].includes(homestay.status)) {
                return res.status(400).json({ success: false, message: `Cannot modify application in '${homestay.status}' status` });
            }

            if (propertyName !== undefined) homestay.propertyName = propertyName;
            if (description !== undefined) homestay.description = description;
            if (address !== undefined) homestay.address = address;
            if (district !== undefined) homestay.district = district;
            if (taluk !== undefined) homestay.taluk = taluk;
            if (geoLocation !== undefined) homestay.geoLocation = geoLocation;
            if (contactPhone !== undefined) homestay.contactPhone = contactPhone;
            if (contactEmail !== undefined) homestay.contactEmail = contactEmail;
            if (rooms !== undefined) homestay.rooms = rooms;
            if (amenities !== undefined) homestay.amenities = amenities;

            await homestay.save();
        } else {
            // Create new draft
            homestay = await Homestay.create({
                owner: req.user._id,
                propertyName: propertyName || 'My Homestay Draft',
                description,
                address: address || 'To be filled',
                district: district || req.user.district || 'Central District',
                taluk: taluk || 'Central Taluk',
                geoLocation,
                contactPhone: contactPhone || req.user.phone,
                contactEmail: contactEmail || req.user.email,
                rooms: rooms || [],
                amenities: amenities || [],
                status: 'draft',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Homestay draft saved successfully',
            data: homestay,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit Homestay for Official Review
// @route   POST /api/v1/homestays/:id/submit
// @access  Private (Owner)
const submitHomestay = async (req, res, next) => {
    try {
        const homestay = await Homestay.findOne({ _id: req.params.id, owner: req.user._id });
        if (!homestay) {
            return res.status(404).json({ success: false, message: 'Homestay not found' });
        }

        if (!['draft'].includes(homestay.status)) {
            return res.status(400).json({ success: false, message: `Application already submitted or in '${homestay.status}' status` });
        }

        // Basic Validation before submission
        if (!homestay.propertyName || !homestay.address || !homestay.district || !homestay.taluk) {
            return res.status(400).json({ success: false, message: 'Property basic details, district, and taluk are required before submission' });
        }

        if (!homestay.rooms || homestay.rooms.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one room configuration must be added' });
        }

        homestay.status = 'submitted';
        await homestay.save();

        return res.status(200).json({
            success: true,
            message: 'Homestay application submitted successfully for District Review',
            data: homestay,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Owner's Homestays
// @route   GET /api/v1/homestays/mine
// @access  Private (Owner)
const getMyHomestays = async (req, res, next) => {
    try {
        const homestays = await Homestay.find({ owner: req.user._id }).sort({ updatedAt: -1 });
        return res.status(200).json({
            success: true,
            count: homestays.length,
            data: homestays,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get All Homestays (Admin / Officer Review Queue)
// @route   GET /api/v1/homestays
// @access  Private (Admin, District Officer, Inspector)
const getHomestays = async (req, res, next) => {
    try {
        const { status, district, search, page = 1, limit = 20 } = req.query;
        const query = {};

        if (status) query.status = status;
        if (district) query.district = district;

        // If district officer, default filter to their district
        if (req.user.role === 'districtadmin' && req.user.district && !district) {
            query.district = req.user.district;
        }

        // If inspector, default filter to assigned homestays
        if (req.user.role === 'inspector') {
            query.assignedInspector = req.user._id;
        }

        if (search) {
            query.$text = { $search: search };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const homestays = await Homestay.find(query)
            .populate('owner', 'name email phone')
            .populate('assignedInspector', 'name email phone')
            .populate('assignedOfficer', 'name email')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Homestay.countDocuments(query);

        return res.status(200).json({
            success: true,
            count: homestays.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: homestays,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Public Certified Homestays Directory
// @route   GET /api/v1/homestays/public
// @access  Public
const getPublicHomestays = async (req, res, next) => {
    try {
        const { district, minRating, maxPrice, search, page = 1, limit = 12 } = req.query;

        // Only approved/certified homestays are visible publicly
        const query = { status: 'approved' };

        if (district) query.district = district;
        if (minRating) query.currentRating = { $gte: parseFloat(minRating) };

        if (search) {
            query.$or = [
                { propertyName: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
                { district: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const homestays = await Homestay.find(query)
            .select('-documents -rejectionReason')
            .sort({ currentRating: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Homestay.countDocuments(query);

        return res.status(200).json({
            success: true,
            count: homestays.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: homestays,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Public Homestay Detail by ID
// @route   GET /api/v1/homestays/public/:id
// @access  Public
const getPublicHomestayById = async (req, res, next) => {
    try {
        const homestay = await Homestay.findOne({ _id: req.params.id, status: 'approved' })
            .select('-documents -rejectionReason')
            .populate('owner', 'name email phone');

        if (!homestay) {
            return res.status(404).json({ success: false, message: 'Certified homestay not found' });
        }

        return res.status(200).json({
            success: true,
            data: homestay,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Full Homestay Detail by ID (Authorized)
// @route   GET /api/v1/homestays/:id
// @access  Private
const getHomestayById = async (req, res, next) => {
    try {
        const homestay = await Homestay.findById(req.params.id)
            .populate('owner', 'name email phone')
            .populate('assignedInspector', 'name email phone')
            .populate('assignedOfficer', 'name email')
            .populate({
                path: 'ratingHistory',
                populate: { path: 'inspector', select: 'name email' },
            });

        if (!homestay) {
            return res.status(404).json({ success: false, message: 'Homestay not found' });
        }

        // Owner check
        if (req.user.role === 'owner' && homestay.owner._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized access to property details' });
        }

        return res.status(200).json({
            success: true,
            data: homestay,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    District Officer Application Review (Approve / Reject / Request Correction)
// @route   PATCH /api/v1/homestays/:id/review
// @access  Private (District Officer / Super Admin)
const reviewHomestay = async (req, res, next) => {
    try {
        const { action, remarks } = req.body; // action: 'approve_for_inspection', 'reject', 'request_changes'
        const homestay = await Homestay.findById(req.params.id);

        if (!homestay) {
            return res.status(404).json({ success: false, message: 'Homestay application not found' });
        }

        if (action === 'approve_for_inspection') {
            homestay.status = 'under_review';
            homestay.assignedOfficer = req.user._id;
        } else if (action === 'reject') {
            homestay.status = 'rejected';
            homestay.rejectionReason = remarks || 'Application rejected by District Officer';
        } else if (action === 'request_changes') {
            homestay.status = 'draft';
            homestay.correctionRemarks = remarks || 'Corrections required';
        } else {
            return res.status(400).json({ success: false, message: 'Invalid review action' });
        }

        await homestay.save();

        return res.status(200).json({
            success: true,
            message: `Homestay status updated to ${homestay.status}`,
            data: homestay,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Assign Inspector to Homestay & Schedule Inspection
// @route   PATCH /api/v1/homestays/:id/assign-inspector
// @access  Private (District Officer / Super Admin)
const assignInspector = async (req, res, next) => {
    try {
        const { inspectorId, inspectionDate } = req.body;
        const homestay = await Homestay.findById(req.params.id);

        if (!homestay) {
            return res.status(404).json({ success: false, message: 'Homestay not found' });
        }

        const inspector = await User.findOne({ _id: inspectorId, role: 'inspector' });
        if (!inspector) {
            return res.status(404).json({ success: false, message: 'Inspector user not found' });
        }

        homestay.assignedInspector = inspector._id;
        homestay.inspectionDate = inspectionDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        homestay.status = 'inspection_scheduled';

        await homestay.save();

        return res.status(200).json({
            success: true,
            message: `Inspector ${inspector.name} assigned and inspection scheduled`,
            data: homestay,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload Document for Homestay
// @route   POST /api/v1/homestays/:id/documents
// @access  Private (Owner)
const uploadDocument = async (req, res, next) => {
    try {
        const { docType } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No document file uploaded' });
        }

        const homestay = await Homestay.findOne({ _id: req.params.id, owner: req.user._id });
        if (!homestay) {
            return res.status(404).json({ success: false, message: 'Homestay not found' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;

        // Remove existing doc of same type if present
        homestay.documents = homestay.documents.filter((d) => d.docType !== docType);
        homestay.documents.push({
            docType: docType || 'ID Proof',
            fileUrl,
            verified: false,
        });

        await homestay.save();

        return res.status(200).json({
            success: true,
            message: 'Document uploaded successfully',
            data: homestay.documents,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload Photo for Homestay
// @route   POST /api/v1/homestays/:id/photos
// @access  Private (Owner)
const uploadPhoto = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No photo file uploaded' });
        }

        const homestay = await Homestay.findOne({ _id: req.params.id, owner: req.user._id });
        if (!homestay) {
            return res.status(404).json({ success: false, message: 'Homestay not found' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        homestay.photos.push(fileUrl);

        await homestay.save();

        return res.status(200).json({
            success: true,
            message: 'Photo uploaded successfully',
            data: homestay.photos,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify Certified Homestay Registration Number
// @route   GET /api/v1/homestays/verify/:regNumber
// @access  Public
const verifyHomestay = async (req, res, next) => {
    try {
        const { regNumber } = req.params;
        const homestay = await Homestay.findOne({
            registrationNumber: { $regex: new RegExp(`^${regNumber.trim()}$`, 'i') },
            status: 'approved',
        }).select('propertyName address district registrationNumber currentRating certificateIssuedAt certificateValidTill owner');

        if (!homestay) {
            return res.status(404).json({ success: false, message: 'No active certified homestay found with this Registration Number' });
        }

        return res.status(200).json({
            success: true,
            data: homestay,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Download Official Quality Certificate PDF
// @route   GET /api/v1/homestays/:id/certificate
// @access  Public / Approved
const downloadCertificate = async (req, res, next) => {
    try {
        const homestay = await Homestay.findById(req.params.id).populate('owner', 'name email phone');
        if (!homestay) {
            return res.status(404).json({ success: false, message: 'Homestay not found' });
        }

        if (homestay.status !== 'approved') {
            return res.status(400).json({ success: false, message: 'Certificate is only available for approved homestays' });
        }

        generateCertificatePDF(homestay, res);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    saveHomestayDraft,
    submitHomestay,
    getMyHomestays,
    getHomestays,
    getPublicHomestays,
    getPublicHomestayById,
    getHomestayById,
    reviewHomestay,
    assignInspector,
    uploadDocument,
    uploadPhoto,
    verifyHomestay,
    downloadCertificate,
};
