import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
    Sparkles,
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    Star,
    Award,
    Flame,
    Home,
    Utensils,
    Leaf,
    MapPin,
    Download,
    Volume2,
    ArrowRight,
    RefreshCw,
    Building2,
    Info,
    HelpCircle
} from 'lucide-react';

const PreAuditAdvisorPage = () => {
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        propertyName: 'Pine Valley Heritage Stay',
        district: 'Central District',
        hasFireExtinguisher: true,
        hasCCTV: true,
        hasFirstAid: true,
        hasHostResiding: true,
        hasSolarPower: true,
        hasRainwaterHarvesting: false,
        hasWasteSegregation: true,
        hasLocalFood: true,
        hasGuidedTours: true,
        hasAttachedBaths: true,
        hasWifi: true,
        hasPowerBackup: true,
        hasHotWater: true,
        hasPavedRoad: true,
        hasScenicView: true,
    });

    const [auditResult, setAuditResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [speaking, setSpeaking] = useState(false);

    const districts = [
        'Central District',
        'North Hill District',
        'South Beach District',
        'Valley District',
        'Western Ghats District',
        'Eastern Coastal District',
    ];

    useEffect(() => {
        calculateScore();
    }, [form]);

    const calculateScore = async () => {
        setLoading(true);
        try {
            const res = await API.post('/homestays/pre-audit', form);
            if (res.data.success) {
                setAuditResult(res.data.data);
            }
        } catch (err) {
            console.error('Error running pre-audit calculation:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (field) => {
        setForm((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleVoiceSummary = () => {
        if (!window.speechSynthesis || !auditResult) return;
        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            return;
        }

        const text = `State Tourism Department AI Pre-Audit Summary for ${auditResult.propertyName}. 
        Predicted score is ${auditResult.scorePercentage} percent, qualifying for ${auditResult.starCategory}. 
        Inspection readiness is rated ${auditResult.estimatedInspectionReadiness}. 
        ${auditResult.warnings.length > 0 ? `Warning: ${auditResult.warnings[0]}` : 'All mandatory safety norms satisfied.'}`;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        setSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-sky-950/80 via-slate-900 to-emerald-950/70 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-3 max-w-3xl">
                            <div className="inline-flex items-center space-x-2 bg-sky-900/60 border border-sky-700/60 px-3.5 py-1.5 rounded-full text-xs font-semibold text-sky-300">
                                <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                                <span>Official Department Governance AI Tool</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit tracking-tight">
                                {t('preAuditTitle')}
                            </h1>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                {t('preAuditSubtitle')}
                            </p>
                        </div>

                        <div className="flex items-center space-x-3 shrink-0">
                            <button
                                onClick={handleVoiceSummary}
                                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm ${
                                    speaking
                                        ? 'bg-amber-600 border-amber-500 text-white animate-pulse'
                                        : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                                }`}
                                title="Voice Audio Reader for Accessibility (GIGW Compliant)"
                            >
                                <Volume2 className="w-4 h-4 text-sky-400" />
                                <span>{speaking ? 'Stop Voice' : 'Voice Assistance'}</span>
                            </button>

                            <button
                                onClick={handlePrint}
                                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
                            >
                                <Download className="w-4 h-4 text-emerald-400" />
                                <span>{t('printAuditReport')}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left: Interactive Audit Assessment Parameters (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Property Basic Info */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                                <Building2 className="w-4 h-4 text-sky-400" />
                                <span>Property Demographics</span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">Proposed Property Name</label>
                                    <input
                                        type="text"
                                        value={form.propertyName}
                                        onChange={(e) => setForm({ ...form, propertyName: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                        placeholder="e.g. Pine Ridge Estate"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">{t('district')}</label>
                                    <select
                                        value={form.district}
                                        onChange={(e) => setForm({ ...form, district: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                    >
                                        {districts.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Pillar 1: Safety & Fire Norms */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800 flex items-center justify-center">
                                        <Flame className="w-4 h-4 text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">{t('safetyPillar')}</h3>
                                        <p className="text-[11px] text-slate-400">Mandatory state safety norms, CCTV, and on-site host</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono font-bold text-sky-400">
                                    {auditResult?.pillarBreakdown?.safety?.score || 0}/30 Pts
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <ToggleCard
                                    title="Certified Fire Extinguishers"
                                    subtitle="2kg ABC powder on all floors (Mandatory)"
                                    checked={form.hasFireExtinguisher}
                                    onChange={() => handleToggle('hasFireExtinguisher')}
                                    mandatory
                                />
                                <ToggleCard
                                    title="Host Resides on Premises"
                                    subtitle="Owner/manager resides in building (State Mandate)"
                                    checked={form.hasHostResiding}
                                    onChange={() => handleToggle('hasHostResiding')}
                                    mandatory
                                />
                                <ToggleCard
                                    title="CCTV in Common Corridors"
                                    subtitle="Security coverage at main entry points"
                                    checked={form.hasCCTV}
                                    onChange={() => handleToggle('hasCCTV')}
                                />
                                <ToggleCard
                                    title="Standard First Aid Station"
                                    subtitle="Emergency kits & doctor contact list"
                                    checked={form.hasFirstAid}
                                    onChange={() => handleToggle('hasFirstAid')}
                                />
                            </div>
                        </div>

                        {/* Pillar 2: Infrastructure & Amenities */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800 flex items-center justify-center">
                                        <Home className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">{t('infraPillar')}</h3>
                                        <p className="text-[11px] text-slate-400">Attached baths, power continuity & guest Wi-Fi</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono font-bold text-sky-400">
                                    {auditResult?.pillarBreakdown?.infrastructure?.score || 0}/25 Pts
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <ToggleCard
                                    title="Attached Bathrooms"
                                    subtitle="Sanitized Western toilets for all guest rooms"
                                    checked={form.hasAttachedBaths}
                                    onChange={() => handleToggle('hasAttachedBaths')}
                                />
                                <ToggleCard
                                    title="24/7 Hot Water Facility"
                                    subtitle="Geyser or solar hot water circulation"
                                    checked={form.hasHotWater}
                                    onChange={() => handleToggle('hasHotWater')}
                                />
                                <ToggleCard
                                    title="Power Inverter Backup"
                                    subtitle="Uninterrupted lighting during grid outages"
                                    checked={form.hasPowerBackup}
                                    onChange={() => handleToggle('hasPowerBackup')}
                                />
                                <ToggleCard
                                    title="High-Speed Wi-Fi Internet"
                                    subtitle="Workation ready broadband for tourists"
                                    checked={form.hasWifi}
                                    onChange={() => handleToggle('hasWifi')}
                                />
                            </div>
                        </div>

                        {/* Pillar 3: Hospitality & Cultural Immersion */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800 flex items-center justify-center">
                                        <Utensils className="w-4 h-4 text-amber-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white">{t('hospitalityPillar')}</h3>
                                        <p className="text-[11px] text-slate-400">Authentic regional culinary & cultural guidance</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono font-bold text-sky-400">
                                    {auditResult?.pillarBreakdown?.hospitality?.score || 0}/20 Pts
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <ToggleCard
                                    title="Authentic Regional Cuisine"
                                    subtitle="Traditional home-cooked breakfast & dinners"
                                    checked={form.hasLocalFood}
                                    onChange={() => handleToggle('hasLocalFood')}
                                />
                                <ToggleCard
                                    title="Guided Village / Nature Walks"
                                    subtitle="Local community tours & heritage circuits"
                                    checked={form.hasGuidedTours}
                                    onChange={() => handleToggle('hasGuidedTours')}
                                />
                            </div>
                        </div>

                        {/* Pillar 4 & 5: Sustainability & Location */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            {/* Eco-Practices */}
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Leaf className="w-4 h-4 text-emerald-400" />
                                        <h3 className="text-xs font-bold text-white uppercase">{t('ecoPillar')}</h3>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-emerald-400">
                                        {auditResult?.pillarBreakdown?.sustainability?.score || 0}/15 Pts
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <ToggleCard
                                        title="Solar Energy / Panels"
                                        subtitle="Renewable water heating/power"
                                        checked={form.hasSolarPower}
                                        onChange={() => handleToggle('hasSolarPower')}
                                    />
                                    <ToggleCard
                                        title="Rainwater Harvesting"
                                        subtitle="Catchment recharge tank installed"
                                        checked={form.hasRainwaterHarvesting}
                                        onChange={() => handleToggle('hasRainwaterHarvesting')}
                                    />
                                    <ToggleCard
                                        title="Organic Waste Composting"
                                        subtitle="Zero single-use plastic policy"
                                        checked={form.hasWasteSegregation}
                                        onChange={() => handleToggle('hasWasteSegregation')}
                                    />
                                </div>
                            </div>

                            {/* Location & Access */}
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4 text-purple-400" />
                                        <h3 className="text-xs font-bold text-white uppercase">{t('locationPillar')}</h3>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-purple-400">
                                        {auditResult?.pillarBreakdown?.location?.score || 0}/10 Pts
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    <ToggleCard
                                        title="All-Weather Paved Road"
                                        subtitle="Four-wheeler motorable access"
                                        checked={form.hasPavedRoad}
                                        onChange={() => handleToggle('hasPavedRoad')}
                                    />
                                    <ToggleCard
                                        title="Scenic Vantage / Heritage View"
                                        subtitle="Panoramic landscape or forest outlook"
                                        checked={form.hasScenicView}
                                        onChange={() => handleToggle('hasScenicView')}
                                    />
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Right: Live AI Prediction, Radar & Recommendations (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6 sticky top-24">

                        {/* Predicted Star Rating Card */}
                        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">

                            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                                <div>
                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{t('predictedRating')}</span>
                                    <h3 className="text-xl font-extrabold text-white font-outfit mt-0.5">
                                        {auditResult?.starCategory || 'Calculating...'}
                                    </h3>
                                </div>
                                <div className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-2xl">
                                    {[...Array(auditResult?.predictedStars || 0)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                                    ))}
                                    {[...Array(5 - (auditResult?.predictedStars || 0))].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-slate-700" />
                                    ))}
                                </div>
                            </div>

                            {/* Gauge / Circular Metric */}
                            <div className="flex items-center justify-around py-2">
                                <div className="relative w-36 h-36 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            className="text-slate-800"
                                            fill="transparent"
                                        />
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            strokeDasharray={`${2 * Math.PI * 40}`}
                                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - (auditResult?.scorePercentage || 0) / 100)}`}
                                            strokeLinecap="round"
                                            className={`transition-all duration-700 ${
                                                (auditResult?.scorePercentage || 0) >= 80
                                                    ? 'text-emerald-400'
                                                    : (auditResult?.scorePercentage || 0) >= 60
                                                    ? 'text-sky-400'
                                                    : 'text-amber-400'
                                            }`}
                                            fill="transparent"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className="text-3xl font-extrabold text-white font-outfit leading-tight">
                                            {auditResult?.scorePercentage || 0}%
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                            Compliance
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Inspection Readiness</span>
                                        <div className="mt-1">
                                            {auditResult?.estimatedInspectionReadiness === 'HIGH' ? (
                                                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    <span>Audit Ready</span>
                                                </span>
                                            ) : auditResult?.estimatedInspectionReadiness === 'MODERATE' ? (
                                                <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1">
                                                    <Info className="w-3.5 h-3.5" />
                                                    <span>Moderate Ready</span>
                                                </span>
                                            ) : (
                                                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1">
                                                    <AlertTriangle className="w-3.5 h-3.5" />
                                                    <span>Prep Needed</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Green Stay Status</span>
                                        <div className="mt-1">
                                            {auditResult?.isEcoCertifiedEligible ? (
                                                <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1">
                                                    <Leaf className="w-3 h-3 text-emerald-400" />
                                                    <span>Eco Subsidy Eligible</span>
                                                </span>
                                            ) : (
                                                <span className="text-slate-500 text-[11px]">Eco points below threshold</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Warnings */}
                            {auditResult?.warnings?.length > 0 && (
                                <div className="space-y-2 pt-2">
                                    {auditResult.warnings.map((warn, idx) => (
                                        <div key={idx} className="bg-red-950/40 border border-red-800/80 p-3 rounded-2xl flex items-start space-x-2 text-xs text-red-200">
                                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                            <span>{warn}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Recommendations / Next Steps */}
                            {auditResult?.recommendations?.length > 0 && (
                                <div className="space-y-2 border-t border-slate-800 pt-4">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                        <span>AI Actions to Reach Next Star Tier</span>
                                    </h4>
                                    <ul className="space-y-2 text-xs text-slate-300">
                                        {auditResult.recommendations.slice(0, 3).map((rec, i) => (
                                            <li key={i} className="flex items-start space-x-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                                                <span>{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* CTA Action */}
                            <div className="pt-2">
                                <Link
                                    to="/owner/homestays/new"
                                    className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-bold rounded-2xl text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
                                >
                                    <span>{t('proceedRegistration')}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <p className="text-[11px] text-center text-slate-500 mt-2">
                                    Official State Tourism Department Inspection Norms 2026
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

// Sub-component for toggle card
const ToggleCard = ({ title, subtitle, checked, onChange, mandatory = false }) => {
    return (
        <button
            type="button"
            onClick={onChange}
            className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                checked
                    ? 'bg-slate-950/90 border-sky-500/60 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 opacity-75'
            }`}
        >
            <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-semibold text-white">{title}</span>
                    {mandatory && (
                        <span className="bg-red-950 text-red-400 border border-red-800 text-[9px] font-bold px-1 py-0.2 rounded">
                            Req
                        </span>
                    )}
                </div>
                <p className="text-[11px] text-slate-400">{subtitle}</p>
            </div>
            <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                    checked ? 'bg-sky-500 border-sky-400 text-white' : 'border-slate-700 bg-slate-900 text-transparent'
                }`}
            >
                <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
        </button>
    );
};

export default PreAuditAdvisorPage;
