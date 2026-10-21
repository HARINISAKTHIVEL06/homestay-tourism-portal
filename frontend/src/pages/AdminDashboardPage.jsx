import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import {
    Building2,
    CheckCircle2,
    Clock,
    Award,
    ShieldAlert,
    Sliders,
    Users,
    FileText,
    Star,
    Save,
    Compass,
    Sparkles,
    Leaf,
    ArrowRight,
    Zap
} from 'lucide-react';

const AdminDashboardPage = () => {
    const [analytics, setAnalytics] = useState(null);
    const [criteria, setCriteria] = useState([]);
    const [loading, setLoading] = useState(true);

    // Criteria Edit State
    const [criteriaList, setCriteriaList] = useState([]);
    const [criteriaSaving, setCriteriaSaving] = useState(false);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [analyticsRes, criteriaRes] = await Promise.all([
                API.get('/admin/analytics'),
                API.get('/rating-criteria'),
            ]);

            if (analyticsRes.data.success) {
                setAnalytics(analyticsRes.data.data);
            }

            if (criteriaRes.data.success) {
                setCriteria(criteriaRes.data.data);
                setCriteriaList(criteriaRes.data.data);
            }
        } catch (err) {
            console.error('Error loading admin analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleWeightChange = (index, weight) => {
        const updated = [...criteriaList];
        updated[index].weightPercent = parseFloat(weight) || 0;
        setCriteriaList(updated);
    };

    const handleSaveCriteria = async () => {
        const total = criteriaList.reduce((sum, c) => sum + Number(c.weightPercent), 0);
        if (total !== 100) {
            alert(`Total weights must sum to 100%. Current sum: ${total}%`);
            return;
        }

        setCriteriaSaving(true);
        try {
            const res = await API.put('/rating-criteria', { criteria: criteriaList });
            if (res.data.success) {
                alert('Rating criteria weights updated successfully!');
                setCriteria(res.data.data);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save criteria');
        } finally {
            setCriteriaSaving(false);
        }
    };

    const COLORS = ['#0284c7', '#059669', '#f59e0b', '#8b5cf6', '#ef4444'];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    const kpis = analytics?.kpis || {};

    const districtChartData = analytics?.districtDistribution?.map((item) => ({
        name: item._id,
        Total: item.count,
        Certified: item.approvedCount,
    })) || [];

    const ratingChartData = analytics?.ratingBreakdown?.map((item) => ({
        name: `${item._id} Star`,
        value: item.count,
    })) || [];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm mb-1">
                            <Building2 className="w-4 h-4" />
                            <span>Department Headquarters Analytics</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-white font-outfit">
                            Super Admin Executive Dashboard
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Statewide registration metrics, quality star distributions, SLA compliance, and criteria weight management.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <Link
                            to="/explorer"
                            className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 font-bold rounded-xl text-xs shadow-md transition-all"
                        >
                            <Compass className="w-4 h-4 text-emerald-400" />
                            <span>State GIS Spatial Radar</span>
                        </Link>
                        <Link
                            to="/pre-audit"
                            className="flex items-center space-x-2 px-4 py-2.5 bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-800 font-bold rounded-xl text-xs shadow-md transition-all"
                        >
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>AI Pre-Audit Simulator</span>
                        </Link>
                    </div>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-semibold uppercase">Total Applications</span>
                            <Building2 className="w-4 h-4 text-sky-400" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-white font-outfit">{kpis.totalHomestays || 0}</h2>
                        <p className="text-[11px] text-slate-400">{kpis.submittedCount} Pending Review</p>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-semibold uppercase">Certified Homestays</span>
                            <Award className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-emerald-400 font-outfit">{kpis.approvedCount || 0}</h2>
                        <p className="text-[11px] text-emerald-400/80">Active Registrations</p>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-semibold uppercase">Average Approval SLA</span>
                            <Clock className="w-4 h-4 text-amber-400" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-amber-400 font-outfit">{kpis.avgSlaDays || 12} Days</h2>
                        <p className="text-[11px] text-slate-400">Target SLA: 14 Days</p>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                            <span className="text-xs font-semibold uppercase">Tourist Grievances</span>
                            <ShieldAlert className="w-4 h-4 text-red-400" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-red-400 font-outfit">{kpis.totalGrievances || 0}</h2>
                        <p className="text-[11px] text-red-300">{kpis.openGrievances || 0} Unresolved</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* District Distribution BarChart */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
                        <h3 className="text-base font-bold text-white font-outfit">District-wise Registration Distribution</h3>
                        <div className="h-72 w-full pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={districtChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Bar dataKey="Total" fill="#0284c7" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Certified" fill="#059669" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Rating Breakdown PieChart */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
                        <h3 className="text-base font-bold text-white font-outfit">Quality Star Rating Share</h3>
                        <div className="h-72 w-full flex items-center justify-center">
                            {ratingChartData.length === 0 ? (
                                <p className="text-xs text-slate-500">No certified ratings recorded yet.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={ratingChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {ratingChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                </div>

                {/* Rating Criteria Config Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white font-outfit flex items-center space-x-2">
                                <Sliders className="w-5 h-5 text-sky-400" />
                                <span>Quality Scorecard Criteria Weight Manager</span>
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Adjust category weights used by Inspectors for calculating automated star ratings. Total must sum to 100%.
                            </p>
                        </div>

                        <button
                            onClick={handleSaveCriteria}
                            disabled={criteriaSaving}
                            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all shrink-0"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save Category Weights</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {criteriaList.map((item, idx) => (
                            <div key={item._id || idx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 items-center">
                                <div className="sm:col-span-4">
                                    <p className="text-sm font-bold text-white">{item.category}</p>
                                    <p className="text-xs text-slate-500">{item.description}</p>
                                </div>

                                <div className="sm:col-span-5">
                                    <input
                                        type="text"
                                        value={item.description || ''}
                                        onChange={(e) => {
                                            const updated = [...criteriaList];
                                            updated[idx].description = e.target.value;
                                            setCriteriaList(updated);
                                        }}
                                        placeholder="Category description..."
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                                    />
                                </div>

                                <div className="sm:col-span-3 flex items-center space-x-2">
                                    <label className="text-xs font-semibold text-slate-400">Weight (%):</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={item.weightPercent}
                                        onChange={(e) => handleWeightChange(idx, e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboardPage;
