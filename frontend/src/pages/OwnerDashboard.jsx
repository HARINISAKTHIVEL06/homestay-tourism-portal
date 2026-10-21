import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
    Building2,
    PlusCircle,
    FileCheck,
    Clock,
    CheckCircle2,
    XCircle,
    Download,
    Award,
    Star,
    Eye,
    FileEdit,
    Send,
    AlertTriangle,
    Sparkles,
    Compass,
} from 'lucide-react';

const OwnerDashboard = () => {
    const [homestays, setHomestays] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyHomestays();
    }, []);

    const fetchMyHomestays = async () => {
        try {
            const res = await API.get('/homestays/mine');
            if (res.data.success) {
                setHomestays(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch homestays:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'draft':
                return <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-700">Draft</span>;
            case 'submitted':
                return <span className="bg-blue-950 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-800">Submitted</span>;
            case 'under_review':
                return <span className="bg-purple-950 text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-800">Under Review</span>;
            case 'inspection_scheduled':
                return <span className="bg-amber-950 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-800">Inspection Scheduled</span>;
            case 'inspected':
                return <span className="bg-cyan-950 text-cyan-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-cyan-800">Inspected</span>;
            case 'approved':
                return <span className="bg-emerald-950 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-800 flex items-center space-x-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /><span>Certified</span></span>;
            case 'rejected':
                return <span className="bg-red-950 text-red-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-800">Rejected</span>;
            default:
                return null;
        }
    };

    const renderStatusTracker = (status) => {
        const steps = [
            { id: 'draft', label: 'Draft' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'under_review', label: 'Review' },
            { id: 'inspection_scheduled', label: 'Inspection' },
            { id: 'approved', label: 'Certified' },
        ];

        const getStepIndex = (s) => {
            if (s === 'draft') return 0;
            if (s === 'submitted') return 1;
            if (s === 'under_review') return 2;
            if (s === 'inspection_scheduled' || s === 'inspected') return 3;
            if (s === 'approved') return 4;
            return 0;
        };

        const currentIndex = getStepIndex(status);

        return (
            <div className="w-full mt-4 py-2">
                <div className="flex items-center justify-between relative">
                    {/* Connector Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0"></div>
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-sky-500 to-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {steps.map((step, idx) => {
                        const isCompleted = idx <= currentIndex;
                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isCompleted
                                            ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                                        }`}
                                >
                                    {idx + 1}
                                </div>
                                <span className={`text-[10px] font-medium mt-1 ${isCompleted ? 'text-sky-300' : 'text-slate-500'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const handleDownloadCertificate = async (id) => {
        try {
            const response = await API.get(`/homestays/${id}/certificate`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Homestay_Certificate_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Certificate generation in progress or failed.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm mb-1">
                            <Building2 className="w-4 h-4" />
                            <span>Owner Dashboard</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-white font-outfit tracking-tight">
                            My Homestay Registrations
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Track registration status, upload documents, view inspector rating scorecards, and download official department certificates.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            to="/pre-audit"
                            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-sky-400 border border-sky-500/30 hover:border-sky-500/60 font-semibold px-4 py-3 rounded-xl shadow-md transition-all"
                        >
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>AI Pre-Audit Simulator</span>
                        </Link>
                        <Link
                            to="/owner/homestays/new"
                            className="flex items-center space-x-2 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                            <PlusCircle className="w-5 h-5" />
                            <span>Register New Property</span>
                        </Link>
                    </div>
                </div>

                {/* Pre-Audit Advisor Hint Banner */}
                <div className="bg-sky-950/40 border border-sky-800/60 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-sky-900/80 border border-sky-700 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4 text-sky-400" />
                        </div>
                        <div>
                            <span className="font-bold text-white">Avoid Registration Rejection or Delays: </span>
                            <span className="text-slate-300">
                                Run the official AI Pre-Audit Scanner to verify fire safety, resident host norms, and projected Star Rating before applying.
                            </span>
                        </div>
                    </div>
                    <Link
                        to="/pre-audit"
                        className="text-sky-400 hover:text-sky-300 font-bold whitespace-nowrap shrink-0 flex items-center space-x-1"
                    >
                        <span>Check Property Readiness &rarr;</span>
                    </Link>
                </div>

                {/* Homestays List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
                    </div>
                ) : homestays.length === 0 ? (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white font-outfit">No Homestays Registered Yet</h3>
                        <p className="text-slate-400 text-sm max-w-md mx-auto">
                            Get certified by the State Tourism Department to start hosting tourists legally and show your official Star Rating.
                        </p>
                        <Link
                            to="/owner/homestays/new"
                            className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow transition-all"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Start Registration</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {homestays.map((item) => (
                            <div
                                key={item._id}
                                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 hover:border-slate-700 transition-all"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-4">
                                    <div>
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-xl font-bold text-white font-outfit">{item.propertyName}</h3>
                                            {getStatusBadge(item.status)}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {item.address}, {item.taluk}, <span className="text-sky-300 font-medium">{item.district}</span>
                                        </p>
                                    </div>

                                    {item.registrationNumber && (
                                        <div className="bg-emerald-950/60 border border-emerald-800/60 px-4 py-2 rounded-xl flex items-center space-x-2">
                                            <Award className="w-5 h-5 text-emerald-400" />
                                            <div>
                                                <p className="text-[10px] text-emerald-400 font-semibold uppercase">Official Reg No</p>
                                                <p className="text-xs font-mono font-bold text-white">{item.registrationNumber}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Rating & Details Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                    <div>
                                        <p className="text-xs text-slate-400">Quality Star Rating</p>
                                        {item.currentRating > 0 ? (
                                            <div className="flex items-center space-x-1 mt-1 text-amber-400 font-bold text-lg">
                                                <Star className="w-5 h-5 fill-amber-400" />
                                                <span>{item.currentRating} / 5 Stars</span>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500 mt-1">Inspection Pending</p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">Rooms & Capacity</p>
                                        <p className="text-sm font-semibold text-white mt-1">
                                            {item.rooms?.length || 0} Room Types listed
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">Scheduled Inspection</p>
                                        <p className="text-sm font-semibold text-sky-400 mt-1 flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{item.inspectionDate ? new Date(item.inspectionDate).toLocaleDateString() : 'TBD'}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Status Progress Tracker */}
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Application Lifecycle</p>
                                    {renderStatusTracker(item.status)}
                                </div>

                                {/* Rejection / Correction Box */}
                                {item.correctionRemarks && (
                                    <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-xl flex items-start space-x-3 text-amber-300 text-xs">
                                        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                                        <div>
                                            <p className="font-bold">Correction Requested by District Officer:</p>
                                            <p className="mt-0.5">{item.correctionRemarks}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            to={`/owner/homestays/${item._id}/edit`}
                                            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                                        >
                                            <FileEdit className="w-3.5 h-3.5 text-sky-400" />
                                            <span>{item.status === 'draft' ? 'Edit Application' : 'View / Manage Details'}</span>
                                        </Link>
                                    </div>

                                    {item.status === 'approved' && (
                                        <button
                                            onClick={() => handleDownloadCertificate(item._id)}
                                            className="flex items-center space-x-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-all"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>Download Department Certificate (PDF)</span>
                                        </button>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;
