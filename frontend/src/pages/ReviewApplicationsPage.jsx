import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
    Building2,
    FileText,
    CheckCircle2,
    XCircle,
    UserCheck,
    AlertTriangle,
    Calendar,
    Eye,
    Download,
    MapPin,
    Clock,
    Search,
    Filter,
    Check
} from 'lucide-react';

const ReviewApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [inspectors, setInspectors] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [statusFilter, setStatusFilter] = useState('submitted');
    const [districtFilter, setDistrictFilter] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal State
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedInspectorId, setSelectedInspectorId] = useState('');
    const [inspectionDate, setInspectionDate] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Remarks State
    const [reviewRemarks, setReviewRemarks] = useState('');

    useEffect(() => {
        fetchData();
        fetchInspectors();
    }, [statusFilter, districtFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await API.get('/homestays', {
                params: { status: statusFilter, district: districtFilter },
            });
            if (res.data.success) {
                setApplications(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching applications queue:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchInspectors = async () => {
        try {
            const res = await API.get('/users', { params: { role: 'inspector' } });
            if (res.data.success) {
                setInspectors(res.data.data);
                if (res.data.data.length > 0) {
                    setSelectedInspectorId(res.data.data[0]._id);
                }
            }
        } catch (err) {
            console.error('Error fetching inspectors list:', err);
        }
    };

    const handleReviewAction = async (homestayId, action) => {
        setActionLoading(true);
        try {
            const res = await API.patch(`/homestays/${homestayId}/review`, {
                action,
                remarks: reviewRemarks,
            });

            if (res.data.success) {
                alert(`Application status updated!`);
                setSelectedApp(null);
                setReviewRemarks('');
                fetchData();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Review action failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAssignInspector = async (e) => {
        e.preventDefault();
        if (!selectedApp || !selectedInspectorId) return;

        setActionLoading(true);
        try {
            const res = await API.patch(`/homestays/${selectedApp._id}/assign-inspector`, {
                inspectorId: selectedInspectorId,
                inspectionDate,
            });

            if (res.data.success) {
                alert('Inspector assigned successfully!');
                setAssignModalOpen(false);
                setSelectedApp(null);
                fetchData();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Inspector assignment failed');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm mb-1">
                            <Building2 className="w-4 h-4" />
                            <span>District Officer Workspace</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-white font-outfit">
                            Homestay Application Review Queue
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Inspect submitted owner documents, verify guidelines, trigger corrections, or assign official Inspectors.
                        </p>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
                        {['all', 'submitted', 'under_review', 'inspection_scheduled', 'approved', 'rejected'].map((st) => (
                            <button
                                key={st}
                                onClick={() => setStatusFilter(st)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === st
                                        ? 'bg-sky-600 text-white shadow-md'
                                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                                    }`}
                            >
                                {st === 'all' ? 'All Statuses' : st.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-sky-400" />
                        <select
                            value={districtFilter}
                            onChange={(e) => setDistrictFilter(e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-sky-500"
                        >
                            <option value="">All Districts</option>
                            <option value="Central District">Central District</option>
                            <option value="North Hill District">North Hill District</option>
                            <option value="South Beach District">South Beach District</option>
                            <option value="Valley District">Valley District</option>
                            <option value="Western Ghats District">Western Ghats District</option>
                            <option value="Eastern Coastal District">Eastern Coastal District</option>
                        </select>
                    </div>
                </div>

                {/* Applications Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                        <h3 className="text-xl font-bold text-white font-outfit">No Applications Found</h3>
                        <p className="text-slate-400 text-sm">
                            No homestays currently match the selected status filter.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applications.map((app) => (
                            <div
                                key={app._id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-sky-700/60 transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-bold text-white font-outfit">{app.propertyName}</h3>
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700">
                                            {app.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-400 flex items-center space-x-1">
                                        <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                        <span>{app.address}, <strong className="text-white">{app.district}</strong></span>
                                    </p>

                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                                        <p className="text-slate-400">Owner: <strong className="text-white">{app.owner?.name}</strong></p>
                                        <p className="text-slate-400">Phone: <span className="text-sky-400 font-mono">{app.contactPhone}</span></p>
                                        <p className="text-slate-400">Rooms: <strong className="text-white">{app.rooms?.length || 0} Listed</strong></p>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={() => setSelectedApp(app)}
                                        className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold py-2.5 rounded-xl border border-slate-700 text-xs transition-all"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>Review Documents & Take Action</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Detailed Application Review Modal */}
                {selectedApp && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
                        <div className="bg-slate-900 border border-slate-800 max-w-3xl w-full rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">

                            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white font-outfit">{selectedApp.propertyName}</h2>
                                    <p className="text-xs text-slate-400 mt-1">{selectedApp.address}, {selectedApp.district}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="text-slate-400 hover:text-white p-1"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Uploaded Documents List */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Submitted Verification Documents</h3>
                                {selectedApp.documents?.length === 0 ? (
                                    <p className="text-xs text-slate-500 italic">No documents uploaded yet by owner.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selectedApp.documents?.map((doc, idx) => (
                                            <a
                                                key={idx}
                                                href={doc.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-sky-600 text-xs transition-all"
                                            >
                                                <span className="font-semibold text-slate-200">{doc.docType}</span>
                                                <span className="text-sky-400 font-bold flex items-center space-x-1">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>View Document</span>
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Officer Remarks Input */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                                    Officer Remarks / Reason for Correction or Rejection
                                </label>
                                <textarea
                                    rows="2"
                                    value={reviewRemarks}
                                    onChange={(e) => setReviewRemarks(e.target.value)}
                                    placeholder="Enter remarks for owner..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:ring-1 focus:ring-sky-500"
                                ></textarea>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                <button
                                    disabled={actionLoading}
                                    onClick={() => handleReviewAction(selectedApp._id, 'request_changes')}
                                    className="py-3 bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-xs font-bold rounded-xl border border-amber-800 transition-colors"
                                >
                                    Request Changes
                                </button>
                                <button
                                    disabled={actionLoading}
                                    onClick={() => handleReviewAction(selectedApp._id, 'reject')}
                                    className="py-3 bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-bold rounded-xl border border-red-800 transition-colors"
                                >
                                    Reject Application
                                </button>
                                <button
                                    disabled={actionLoading}
                                    onClick={() => { setAssignModalOpen(true); }}
                                    className="py-3 bg-gradient-to-r from-sky-600 to-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                                >
                                    Approve & Assign Inspector
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                {/* Assign Inspector Sub-Modal */}
                {assignModalOpen && selectedApp && (
                    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
                        <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-3xl p-6 space-y-5 shadow-2xl">
                            <h3 className="text-xl font-bold text-white font-outfit">Assign Inspector for Onsite Visit</h3>

                            <form onSubmit={handleAssignInspector} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Select Inspector</label>
                                    <select
                                        value={selectedInspectorId}
                                        onChange={(e) => setSelectedInspectorId(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:ring-2 focus:ring-sky-500"
                                    >
                                        {inspectors.map((ins) => (
                                            <option key={ins._id} value={ins._id}>
                                                {ins.name} ({ins.district || 'Statewide'})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Scheduled Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={inspectionDate}
                                        onChange={(e) => setInspectionDate(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setAssignModalOpen(false)}
                                        className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
                                    >
                                        Confirm & Schedule
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ReviewApplicationsPage;
