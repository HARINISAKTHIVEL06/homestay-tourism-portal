import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { ShieldCheck, Calendar, MapPin, Phone, Star, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

const InspectorQueuePage = () => {
    const [assignedList, setAssignedList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssigned();
    }, []);

    const fetchAssigned = async () => {
        try {
            const res = await API.get('/inspections/assigned');
            if (res.data.success) {
                setAssignedList(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching assigned inspections:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Banner */}
                <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-8 rounded-3xl border border-emerald-900/50 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm mb-1">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Inspector Assignment Portal</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-white font-outfit">
                            Assigned Homestay Physical Inspections
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Conduct onsite inspections, evaluate safety & hygiene standards, and submit weighted quality scorecards.
                        </p>
                    </div>
                </div>

                {/* Assigned List */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
                    </div>
                ) : assignedList.length === 0 ? (
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                        <h3 className="text-xl font-bold text-white font-outfit">All Inspections Completed</h3>
                        <p className="text-slate-400 text-sm">
                            You currently have no pending assigned inspections in your district queue.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {assignedList.map((homestay) => (
                            <div
                                key={homestay._id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-emerald-700/60 transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-white font-outfit">{homestay.propertyName}</h3>
                                        <span className="bg-amber-950 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-800 flex items-center space-x-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{homestay.status === 'approved' ? 'Certified' : 'Inspection Due'}</span>
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-400 flex items-center space-x-1">
                                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                                        <span>{homestay.address}, {homestay.taluk}, <strong className="text-white">{homestay.district}</strong></span>
                                    </p>

                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Owner Name:</span>
                                            <span className="font-semibold text-white">{homestay.owner?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Contact Phone:</span>
                                            <span className="font-mono text-sky-400">{homestay.contactPhone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Scheduled Date:</span>
                                            <span className="font-semibold text-emerald-400">
                                                {homestay.inspectionDate ? new Date(homestay.inspectionDate).toLocaleDateString() : 'Immediate'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to={`/inspector/inspect/${homestay._id}`}
                                    className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl shadow-md transition-all text-sm mt-4"
                                >
                                    <span>{homestay.status === 'approved' ? 'View Submitted Scorecard' : 'Fill Digital Scorecard'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InspectorQueuePage;
