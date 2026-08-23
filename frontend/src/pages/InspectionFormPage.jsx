import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { ShieldCheck, Star, Award, CheckCircle, AlertTriangle, ArrowLeft, Send } from 'lucide-react';

const InspectionFormPage = () => {
    const { homestayId } = useParams();
    const navigate = useNavigate();

    const [homestay, setHomestay] = useState(null);
    const [criteria, setCriteria] = useState([]);
    const [scores, setScores] = useState({});
    const [remarks, setRemarks] = useState({});
    const [overallRemarks, setOverallRemarks] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [homestayId]);

    const fetchData = async () => {
        try {
            const [homestayRes, criteriaRes] = await Promise.all([
                API.get(`/homestays/${homestayId}`),
                API.get('/rating-criteria'),
            ]);

            if (homestayRes.data.success) {
                setHomestay(homestayRes.data.data);
            }

            if (criteriaRes.data.success) {
                const critList = criteriaRes.data.data;
                setCriteria(critList);

                // Initialize score map with default 4 out of 5
                const initialScores = {};
                const initialRemarks = {};
                critList.forEach((c) => {
                    initialScores[c.category] = 4;
                    initialRemarks[c.category] = 'Standards met during inspection.';
                });
                setScores(initialScores);
                setRemarks(initialRemarks);
            }
        } catch (err) {
            console.error('Error loading inspection form data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleScoreChange = (category, value) => {
        setScores({ ...scores, [category]: parseInt(value) });
    };

    const handleRemarkChange = (category, value) => {
        setRemarks({ ...remarks, [category]: value });
    };

    // Live Score Calculation
    const calculateLiveTotal = () => {
        let total = 0;
        criteria.forEach((c) => {
            const s = scores[c.category] || 1;
            total += (s / 5) * c.weightPercent;
        });
        return Math.round(total * 100) / 100;
    };

    const getLiveStars = (total) => {
        if (total >= 90) return 5;
        if (total >= 75) return 4;
        if (total >= 60) return 3;
        if (total >= 45) return 2;
        return 1;
    };

    const handleSubmitScorecard = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const scoresPayload = criteria.map((c) => ({
                category: c.category,
                weightPercent: c.weightPercent,
                score: scores[c.category] || 4,
                remarks: remarks[c.category] || '',
            }));

            const res = await API.post(`/inspections/${homestayId}`, {
                scores: scoresPayload,
                overallRemarks,
            });

            if (res.data.success) {
                alert(`Scorecard Submitted! ${res.data.message}`);
                navigate('/inspector/assignments');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Scorecard submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    const liveWeightedScore = calculateLiveTotal();
    const liveStars = getLiveStars(liveWeightedScore);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/inspector/assignments')}
                        className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Assignments</span>
                    </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                    <div className="border-b border-slate-800 pb-4">
                        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase mb-1">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Official Onsite Inspection Scorecard</span>
                        </div>
                        <h1 className="text-2xl font-extrabold text-white font-outfit">{homestay?.propertyName}</h1>
                        <p className="text-xs text-slate-400 mt-1">
                            {homestay?.address}, {homestay?.taluk}, <strong className="text-white">{homestay?.district}</strong>
                        </p>
                    </div>

                    {/* Live Calculation Widget */}
                    <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-800/60 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Calculated Weighted Score</p>
                            <h2 className="text-3xl font-extrabold text-white font-outfit mt-1">
                                {liveWeightedScore}% <span className="text-sm font-normal text-slate-400">/ 100%</span>
                            </h2>
                        </div>

                        <div className="flex flex-col items-center md:items-end">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Resulting Quality Rating</p>
                            <div className="flex items-center space-x-1 text-amber-400 font-bold text-xl">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-6 h-6 ${i < liveStars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                                    />
                                ))}
                                <span className="ml-2 text-white font-outfit">{liveStars} Stars</span>
                            </div>
                        </div>
                    </div>

                    {/* Scorecard Categories */}
                    <form onSubmit={handleSubmitScorecard} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Category Evaluation Criteria</h3>

                            {criteria.map((c) => (
                                <div key={c._id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div>
                                            <h4 className="text-base font-bold text-white">{c.category}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{c.description}</p>
                                        </div>
                                        <span className="bg-sky-950 text-sky-300 text-xs font-bold px-3 py-1 rounded-full border border-sky-800 shrink-0">
                                            Weight: {c.weightPercent}%
                                        </span>
                                    </div>

                                    {/* 1 - 5 Score Selector */}
                                    <div className="pt-2">
                                        <label className="block text-xs font-semibold text-slate-300 mb-2">Score (1 = Poor, 5 = Excellent):</label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {[1, 2, 3, 4, 5].map((val) => (
                                                <button
                                                    key={val}
                                                    type="button"
                                                    onClick={() => handleScoreChange(c.category, val)}
                                                    className={`py-2 rounded-xl text-xs font-bold transition-all ${scores[c.category] === val
                                                            ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400'
                                                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                                                        }`}
                                                >
                                                    {val} Star{val > 1 ? 's' : ''}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Inspector Category Remark */}
                                    <div>
                                        <input
                                            type="text"
                                            value={remarks[c.category] || ''}
                                            onChange={(e) => handleRemarkChange(c.category, e.target.value)}
                                            placeholder="Category inspection remarks / notes..."
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Overall Inspector Remarks */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                Overall Onsite Inspection Summary & Remarks
                            </label>
                            <textarea
                                rows="3"
                                value={overallRemarks}
                                onChange={(e) => setOverallRemarks(e.target.value)}
                                placeholder="Enter final remarks on fire safety compliance, host behavior, hygiene standards..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl shadow-xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                        >
                            {submitting ? (
                                <span>Submitting Scorecard...</span>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>Submit Scorecard & Auto-Issue Star Rating</span>
                                </>
                            )}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default InspectionFormPage;
