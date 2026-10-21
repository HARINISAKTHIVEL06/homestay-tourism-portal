const Grievance = require('../models/Grievance');
const Homestay = require('../models/Homestay');

// Smart AI Grievance Triage Classifier
const classifyGrievance = (subject = '', description = '') => {
    const text = `${subject} ${description}`.toLowerCase();

    // Critical Safety / Emergency -> 24 hr SLA
    if (/(harass|assault|emergency|unsafe|threat|theft|danger|illegal|police|molest|attack|scared)/.test(text)) {
        return {
            priority: 'critical',
            category: 'safety_security',
            slaHours: 24,
        };
    }
    // High Urgency: Billing Fraud / Extortion -> 48 hr SLA
    if (/(cheat|overcharg|refund|extort|scam|fraud|unauthorized|deposit)/.test(text)) {
        return {
            priority: 'high',
            category: 'billing_fraud',
            slaHours: 48,
        };
    }
    // High Urgency: Hygiene / Contamination -> 48 hr SLA
    if (/(dirty|smell|insect|cockroach|bedbug|pest|water|toilet|hygiene|sanitary|food poison|vomit)/.test(text)) {
        return {
            priority: 'high',
            category: 'hygiene_cleanliness',
            slaHours: 48,
        };
    }
    // Standard Amenity / Service -> 120 hr SLA
    if (/(wifi|ac|fan|geyser|tv|parking|noise|slow|amenity|breakfast)/.test(text)) {
        return {
            priority: 'medium',
            category: 'amenities',
            slaHours: 120,
        };
    }
    return {
        priority: 'standard',
        category: 'other',
        slaHours: 168,
    };
};

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

        const senderName = name || req.body.submittedBy?.name || (req.user ? req.user.name : 'Tourist Guest');
        const senderEmail = email || req.body.submittedBy?.email || (req.user ? req.user.email : 'guest@example.com');
        const senderPhone = phone || req.body.submittedBy?.phone || (req.user ? req.user.phone : '');

        const triage = classifyGrievance(subject, description);
        const ticketId = `GRV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const slaDeadline = new Date(Date.now() + triage.slaHours * 60 * 60 * 1000);

        const initialTimeline = [
            {
                stage: 'Citizen Grievance Registered',
                timestamp: new Date(),
                note: `Complaint received via Official Portal. Assigned Ticket ID: ${ticketId}.`,
                updatedBy: 'Automated Grievance Gateway',
            },
            {
                stage: 'AI Triage & District Officer Dispatched',
                timestamp: new Date(Date.now() + 1000),
                note: `Classified as [${triage.priority.toUpperCase()}] priority (${triage.category}). Target resolution SLA: ${triage.slaHours} hours.`,
                updatedBy: 'State AI Governance Engine',
            },
        ];

        const grievance = await Grievance.create({
            homestay: targetId,
            submittedBy: {
                name: senderName,
                email: senderEmail,
                phone: senderPhone,
                isPublic: !req.user,
            },
            subject,
            description,
            ticketId,
            priority: triage.priority,
            category: triage.category,
            slaDeadline,
            timeline: initialTimeline,
        });

        return res.status(201).json({
            success: true,
            message: `Grievance registered under Ticket #${ticketId}. Prioritized with ${triage.slaHours}h SLA.`,
            data: grievance,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Track Grievance Status by Ticket ID
// @route   GET /api/v1/grievances/track/:ticketId
// @access  Public
const trackGrievance = async (req, res, next) => {
    try {
        const { ticketId } = req.params;
        const cleanId = (ticketId || '').trim();

        const isObjectId = cleanId.match(/^[0-9a-fA-F]{24}$/);
        const grievance = await Grievance.findOne({
            $or: [
                { ticketId: cleanId },
                ...(isObjectId ? [{ _id: cleanId }] : []),
            ],
        })
            .populate('homestay', 'propertyName address district registrationNumber contactPhone currentRating')
            .populate('handledBy', 'name email');

        if (!grievance) {
            return res.status(404).json({ success: false, message: 'Grievance ticket not found. Please verify Ticket ID.' });
        }

        return res.status(200).json({
            success: true,
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
        const { status, homestayId, priority } = req.query;
        const query = {};

        if (status) query.status = status;
        if (homestayId) query.homestay = homestayId;
        if (priority) query.priority = priority;

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

        if (status) {
            grievance.status = status;
            grievance.timeline.push({
                stage: `Status updated to ${status.toUpperCase()}`,
                timestamp: new Date(),
                note: resolutionNote || `Grievance moved to ${status} stage by reviewing officer.`,
                updatedBy: req.user ? req.user.name : 'District Tourism Officer',
            });
        }
        if (resolutionNote) grievance.resolutionNote = resolutionNote;
        if (req.user) grievance.handledBy = req.user._id;

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
    trackGrievance,
    getGrievances,
    updateGrievance,
};
