import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
    AlertCircle,
    Send,
    CheckCircle2,
    ShieldAlert,
    FileText,
    Clock,
    Search,
    User,
    Check,
    AlertTriangle,
    Zap,
    Building2,
    ArrowRight
} from 'lucide-react';

const GrievancePage = () => {
    const { t } = useLanguage();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState('file'); // 'file' | 'track'
    const [homestays, setHomestays] = useState([]);
    const [selectedHomestayId, setSelectedHomestayId] = useState(searchParams.get('homestayId') || '');

    // Form State
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        subject: '',
        description: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(null);

    // Tracking State
    const [trackTicketId, setTrackTicketId] = useState(searchParams.get('ticket') || 'GRV-2026-10492');
    const [trackedGrievance, setTrackedGrievance] = useState(null);
    const [trackLoading, setTrackLoading] = useState(false);
    const [trackError, setTrackError] = useState('');

    // Admin Queue State
    const [grievancesList, setGrievancesList] = useState([]);

    useEffect(() => {
        fetchHomestaysList();
        if (user && (user.role === 'superadmin' || user.role === 'districtadmin')) {
            fetchAdminGrievanceQueue();
        }
        if (searchParams.get('ticket')) {
            setActiveTab('track');
            fetchTrackGrievance(searchParams.get('ticket'));
        }
    }, [user, searchParams]);

    const fetchHomestaysList = async () => {
        try {
            const res = await API.get('/homestays/public');
            if (res.data.success) {
                setHomestays(res.data.data);
                if (!selectedHomestayId && res.data.data.length > 0) {
                    setSelectedHomestayId(res.data.data[0]._id);
                }
            }
        } catch (err) {
            console.error('Error loading homestays for complaint:', err);
        }
    };

    const fetchAdminGrievanceQueue = async () => {
        try {
            const res = await API.get('/grievances');
            if (res.data.success) {
                setGrievancesList(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching grievances queue:', err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Live AI Urgency Classifier Heuristic
    const getEstimatedUrgency = () => {
        const text = `${formData.subject} ${formData.description}`.toLowerCase();
        if (/(harass|assault|emergency|unsafe|threat|theft|danger|illegal|police)/.test(text)) {
            return { priority: 'CRITICAL', sla: '24 Hours (Emergency Escalation)', color: 'text-red-400 bg-red-950/80 border-red-800' };
        }
        if (/(cheat|overcharg|refund|extort|scam|dirty|hygiene|smell|cockroach)/.test(text)) {
            return { priority: 'HIGH', sla: '48 Hours (District Officer Audit)', color: 'text-amber-400 bg-amber-950/80 border-amber-800' };
        }
        return { priority: 'STANDARD', sla: '5 Days (Department Review)', color: 'text-sky-400 bg-sky-950/80 border-sky-800' };
    };

    const handleSubmitGrievance = async (e) => {
        e.preventDefault();
        if (!selectedHomestayId) {
            alert('Please select a homestay');
            return;
        }

        setSubmitting(true);
        setSubmissionSuccess(null);
        try {
            const res = await API.post('/grievances', {
                homestayId: selectedHomestayId,
                ...formData,
            });

            if (res.data.success) {
                setSubmissionSuccess(res.data.data);
                setFormData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', subject: '', description: '' });
                if (user && (user.role === 'superadmin' || user.role === 'districtadmin')) {
                    fetchAdminGrievanceQueue();
                }
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Grievance submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    const fetchTrackGrievance = async (ticket) => {
        const idToSearch = (ticket || trackTicketId).trim();
        if (!idToSearch) return;

        setTrackLoading(true);
        setTrackError('');
        try {
            const res = await API.get(`/grievances/track/${encodeURIComponent(idToSearch)}`);
            if (res.data.success) {
                setTrackedGrievance(res.data.data);
            }
        } catch (err) {
            setTrackedGrievance(null);
            setTrackError(err.response?.data?.message || 'Ticket not found. Please verify Ticket ID.');
        } finally {
            setTrackLoading(false);
        }
    };

    const handleUpdateStatus = async (grievanceId, status) => {
        try {
            const res = await API.patch(`/grievances/${grievanceId}`, { status });
            if (res.data.success) {
                fetchAdminGrievanceQueue();
            }
        } catch (err) {
            alert('Failed to update grievance status');
        }
    };

    const urgencyInfo = getEstimatedUrgency();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Banner */}
                <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 p-8 rounded-3xl border border-red-900/60 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center space-x-2 text-red-400 font-semibold text-xs bg-red-950 px-3 py-1 rounded-full border border-red-800">
                            <ShieldAlert className="w-4 h-4" />
                            <span>State Tourism Department Grievance Redressal</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
                            {t('grievanceTitle')}
                        </h1>
                        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
                            Fast-track tourist grievance redressal with automated AI SLA escalation, transparent multi-stage status tracking, and District Tourism Officer accountability.
                        </p>
                    </div>

                    {/* Dual Tab Switcher */}
                    <div className="bg-slate-950 border border-slate-800 p-1.5 rounded-2xl flex items-center space-x-1 shrink-0">
                        <button
                            onClick={() => setActiveTab('file')}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                                activeTab === 'file'
                                    ? 'bg-red-600 text-white shadow-md'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <FileText className="w-4 h-4" />
                            <span>{t('fileGrievanceTab')}</span>
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('track');
                                if (!trackedGrievance) fetchTrackGrievance();
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                                activeTab === 'track'
                                    ? 'bg-sky-600 text-white shadow-md'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Clock className="w-4 h-4" />
                            <span>{t('trackGrievanceTab')}</span>
                        </button>
                    </div>
                </div>

                {/* TAB 1: File New Grievance */}
                {activeTab === 'file' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                        
                        {submissionSuccess ? (
                            <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-2xl p-6 text-center space-y-4">
                                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                                <div>
                                    <h3 className="text-lg font-bold text-white">Grievance Registered Successfully</h3>
                                    <p className="text-xs text-emerald-300 mt-1">
                                        Assigned Ticket ID: <strong className="font-mono text-white text-sm">{submissionSuccess.ticketId}</strong>
                                    </p>
                                </div>
                                <p className="text-xs text-slate-300 max-w-md mx-auto">
                                    Your grievance has been auto-triaged and assigned with a <strong className="text-white">{submissionSuccess.priority?.toUpperCase()} priority</strong>. 
                                    A district officer has been notified.
                                </p>
                                <div className="pt-2 flex justify-center gap-3">
                                    <button
                                        onClick={() => {
                                            setTrackTicketId(submissionSuccess.ticketId);
                                            setActiveTab('track');
                                            fetchTrackGrievance(submissionSuccess.ticketId);
                                        }}
                                        className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5"
                                    >
                                        <span>Track This Ticket</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setSubmissionSuccess(null)}
                                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                                    >
                                        File Another
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitGrievance} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Select Certified Homestay *</label>
                                    <select
                                        value={selectedHomestayId}
                                        onChange={(e) => setSelectedHomestayId(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                                    >
                                        {homestays.map((h) => (
                                            <option key={h._id} value={h._id}>
                                                {h.propertyName} — {h.district} ({h.registrationNumber || 'Pending'})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Your Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Tourist Guest"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="tourist@example.com"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Contact Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 98765 43210"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Grievance Subject *</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Overcharging, Cleanliness defect, or Unsafe premises"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Detailed Description of Incident *</label>
                                    <textarea
                                        rows="4"
                                        name="description"
                                        required
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe what occurred, dates, room details, and host response..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                                    ></textarea>
                                </div>

                                {/* Live AI Urgency SLA Estimator Pill */}
                                {formData.description.length > 5 && (
                                    <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-all ${urgencyInfo.color}`}>
                                        <div className="flex items-center space-x-2">
                                            <Zap className="w-4 h-4 animate-pulse" />
                                            <div>
                                                <span className="font-bold">AI Triage Classification: </span>
                                                <span className="font-semibold">{urgencyInfo.priority} Priority</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1.5 font-mono text-[11px]">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Target SLA: {urgencyInfo.sla}</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full flex items-center justify-center space-x-2 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition-all text-xs"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{submitting ? 'Submitting to District Authority...' : 'Submit Official Grievance'}</span>
                                </button>
                            </form>
                        )}

                    </div>
                )}

                {/* TAB 2: Track Citizen Grievance */}
                {activeTab === 'track' && (
                    <div className="space-y-6">

                        {/* Search Input */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    fetchTrackGrievance();
                                }}
                                className="flex flex-col sm:flex-row gap-3"
                            >
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        required
                                        value={trackTicketId}
                                        onChange={(e) => setTrackTicketId(e.target.value)}
                                        placeholder="Enter Ticket ID (e.g. GRV-2026-10492)..."
                                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-sky-500 font-mono focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={trackLoading}
                                    className="py-3 px-6 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-2 shrink-0"
                                >
                                    <Search className="w-4 h-4" />
                                    <span>{t('trackStatusBtn')}</span>
                                </button>
                            </form>
                        </div>

                        {/* Track Result Card */}
                        {trackLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                            </div>
                        ) : trackError ? (
                            <div className="bg-slate-900 border border-red-800/80 rounded-3xl p-6 text-center text-xs text-red-300 space-y-2">
                                <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                                <p className="font-semibold">{trackError}</p>
                            </div>
                        ) : trackedGrievance ? (
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">

                                {/* Ticket Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/80 border border-sky-800 px-2.5 py-0.5 rounded-full">
                                                {trackedGrievance.ticketId || 'GRV-OFFICIAL'}
                                            </span>
                                            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                                                trackedGrievance.priority === 'critical' ? 'bg-red-950 text-red-400 border-red-800' :
                                                trackedGrievance.priority === 'high' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                                                'bg-sky-950 text-sky-400 border-sky-800'
                                            }`}>
                                                {trackedGrievance.priority || 'MEDIUM'} PRIORITY
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mt-1.5 font-outfit">
                                            {trackedGrievance.subject}
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Homestay: <strong className="text-white">{trackedGrievance.homestay?.propertyName}</strong> ({trackedGrievance.homestay?.district})
                                        </p>
                                    </div>

                                    {/* Status Pill */}
                                    <div className="shrink-0">
                                        <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 ${
                                            trackedGrievance.status === 'resolved' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                                            trackedGrievance.status === 'investigating' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                                            'bg-red-950 text-red-400 border-red-800'
                                        }`}>
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>STATUS: {trackedGrievance.status}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Complaint Details */}
                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-1">
                                    <span className="text-slate-500 uppercase text-[10px] font-semibold">Incident Description</span>
                                    <p className="text-slate-300 leading-relaxed">{trackedGrievance.description}</p>
                                </div>

                                {/* Multi-Stage Government Action Timeline */}
                                <div className="space-y-4 pt-2">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-sky-400" />
                                        <span>{t('grievanceTimeline')}</span>
                                    </h4>

                                    <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
                                        {(trackedGrievance.timeline || [
                                            { stage: 'Citizen Grievance Registered', note: 'Complaint logged in state tourism portal.', timestamp: trackedGrievance.createdAt, updatedBy: 'Automated Gateway' },
                                            { stage: 'Assigned to District Tourism Officer', note: 'Case assigned for inquiry.', timestamp: trackedGrievance.createdAt, updatedBy: 'State AI Triage' },
                                        ]).map((item, index) => (
                                            <div key={index} className="relative flex items-start space-x-4 pl-1">
                                                <div className="w-6 h-6 rounded-full bg-sky-500 border-2 border-slate-900 flex items-center justify-center shrink-0 z-10 text-white">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex-1 text-xs space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-bold text-white">{item.stage}</span>
                                                        <span className="text-[10px] text-slate-500 font-mono">
                                                            {new Date(item.timestamp).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-300">{item.note}</p>
                                                    <p className="text-[10px] text-sky-400">Action Officer: {item.updatedBy || 'District Authority'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Resolution Note */}
                                {trackedGrievance.resolutionNote && (
                                    <div className="bg-emerald-950/40 border border-emerald-800/80 p-4 rounded-2xl text-xs space-y-1">
                                        <span className="text-emerald-400 uppercase text-[10px] font-bold">Official Resolution Note</span>
                                        <p className="text-slate-200">{trackedGrievance.resolutionNote}</p>
                                    </div>
                                )}

                            </div>
                        ) : null}

                    </div>
                )}

                {/* Admin Triage Queue (Visible to Super Admin / District Admin) */}
                {user && (user.role === 'superadmin' || user.role === 'districtadmin') && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h2 className="text-xl font-bold text-white font-outfit flex items-center space-x-2">
                                <ShieldAlert className="w-5 h-5 text-amber-400" />
                                <span>District Officer Grievance & SLA Radar</span>
                            </h2>
                            <span className="bg-red-500/10 text-red-400 text-xs font-mono font-bold px-3 py-1 rounded-full border border-red-500/20">
                                {grievancesList.length} Total Tickets
                            </span>
                        </div>

                        {grievancesList.length === 0 ? (
                            <p className="text-xs text-slate-500 py-4 text-center">No grievances logged in department queue.</p>
                        ) : (
                            <div className="space-y-4">
                                {grievancesList.map((g) => (
                                    <div key={g._id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-[10px] font-mono font-bold text-sky-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                                        {g.ticketId || 'GRV-TICKET'}
                                                    </span>
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                                        g.priority === 'critical' ? 'bg-red-950 text-red-400' : 'bg-slate-900 text-slate-300'
                                                    }`}>
                                                        {g.priority || 'standard'}
                                                    </span>
                                                </div>
                                                <h4 className="text-sm font-bold text-white mt-1">{g.subject}</h4>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Homestay: <strong className="text-white">{g.homestay?.propertyName}</strong> ({g.homestay?.district})
                                                </p>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                                                g.status === 'open' ? 'bg-red-950 text-red-300 border border-red-800' :
                                                g.status === 'investigating' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                                                'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                            }`}>
                                                {g.status}
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">{g.description}</p>

                                        <div className="flex items-center justify-between pt-1">
                                            <p className="text-[10px] text-slate-500">By: {g.submittedBy?.name} ({g.submittedBy?.email})</p>

                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(g._id, 'investigating')}
                                                    className="px-3 py-1 bg-amber-950 text-amber-300 text-[10px] font-bold rounded-lg border border-amber-800"
                                                >
                                                    Investigate
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(g._id, 'resolved')}
                                                    className="px-3 py-1 bg-emerald-950 text-emerald-300 text-[10px] font-bold rounded-lg border border-emerald-800"
                                                >
                                                    Mark Resolved
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default GrievancePage;
