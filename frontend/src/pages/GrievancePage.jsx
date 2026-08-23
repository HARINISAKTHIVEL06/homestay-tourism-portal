import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AlertCircle, Send, CheckCircle2, ShieldAlert, FileText, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GrievancePage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [homestays, setHomestays] = useState([]);
    const [selectedHomestayId, setSelectedHomestayId] = useState(searchParams.get('homestayId') || '');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        subject: '',
        description: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [grievancesList, setGrievancesList] = useState([]);

    useEffect(() => {
        fetchHomestaysList();
        if (user && (user.role === 'superadmin' || user.role === 'districtadmin')) {
            fetchAdminGrievanceQueue();
        }
    }, [user]);

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

    const handleSubmitGrievance = async (e) => {
        e.preventDefault();
        if (!selectedHomestayId) {
            alert('Please select a homestay');
            return;
        }

        setSubmitting(true);
        try {
            const res = await API.post('/grievances', {
                homestayId: selectedHomestayId,
                ...formData,
            });

            if (res.data.success) {
                alert(res.data.message);
                setFormData({ name: '', email: '', phone: '', subject: '', description: '' });
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Grievance submission failed');
        } finally {
            setSubmitting(false);
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

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Banner */}
                <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 p-8 rounded-3xl border border-red-900/60 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center space-x-2 text-red-400 font-semibold text-sm mb-1">
                            <ShieldAlert className="w-4 h-4" />
                            <span>State Tourism Grievance Cell</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-white font-outfit">
                            Tourist Grievance & Feedback Portal
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Submit complaints regarding safety, overcharging, hygiene mismatch, or host misconduct directly to District Officers.
                        </p>
                    </div>
                </div>

                {/* Tourist Grievance Form */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                    <h2 className="text-xl font-bold text-white font-outfit border-b border-slate-800 pb-3 flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-red-400" />
                        <span>File Official Tourist Complaint</span>
                    </h2>

                    <form onSubmit={handleSubmitGrievance} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Select Certified Homestay *</label>
                            <select
                                value={selectedHomestayId}
                                onChange={(e) => setSelectedHomestayId(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:ring-2 focus:ring-red-500"
                            >
                                {homestays.map((h) => (
                                    <option key={h._id} value={h._id}>
                                        {h.propertyName} ({h.district})
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
                                    placeholder="John Doe"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
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
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
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
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
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
                                placeholder="e.g. Overcharging beyond listed room tariff"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
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
                                placeholder="Describe dates, room number, issues faced..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:ring-2 focus:ring-red-500"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex items-center justify-center space-x-2 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition-all text-xs"
                        >
                            <Send className="w-4 h-4" />
                            <span>Submit Grievance to Department</span>
                        </button>
                    </form>
                </div>

                {/* Admin Triage Queue (Visible to Super Admin / District Admin) */}
                {user && (user.role === 'superadmin' || user.role === 'districtadmin') && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-white font-outfit border-b border-slate-800 pb-3 flex items-center space-x-2">
                            <ShieldAlert className="w-5 h-5 text-amber-400" />
                            <span>Admin Triage & Investigation Queue</span>
                        </h2>

                        {grievancesList.length === 0 ? (
                            <p className="text-xs text-slate-500 py-4 text-center">No grievances logged in department queue.</p>
                        ) : (
                            <div className="space-y-4">
                                {grievancesList.map((g) => (
                                    <div key={g._id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{g.subject}</h4>
                                                <p className="text-xs text-sky-400 mt-0.5">
                                                    Homestay: {g.homestay?.propertyName} ({g.homestay?.district})
                                                </p>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${g.status === 'open' ? 'bg-red-950 text-red-300 border border-red-800' :
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
