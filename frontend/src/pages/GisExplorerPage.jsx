import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
    MapPin,
    Layers,
    Filter,
    Star,
    ShieldCheck,
    Leaf,
    Building2,
    Compass,
    Eye,
    Phone,
    Mail,
    ArrowRight,
    TrendingUp,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

const GisExplorerPage = () => {
    const { t } = useLanguage();
    const [homestays, setHomestays] = useState([]);
    const [districtsData, setDistrictsData] = useState({});
    const [selectedDistrict, setSelectedDistrict] = useState('All');
    const [filterRating, setFilterRating] = useState('All');
    const [onlyEco, setOnlyEco] = useState(false);
    const [activeHomestay, setActiveHomestay] = useState(null);
    const [viewMode, setViewMode] = useState('tourist'); // 'tourist' | 'policyHeatmap'
    const [loading, setLoading] = useState(true);

    // District visual coordinates on SVG map (600x480 coordinate space)
    const districtRegions = [
        { id: 'North Hill District', name: 'North Hill District', cx: 300, cy: 90, color: '#0284c7', desc: 'Tea Gardens & Misty Peaks' },
        { id: 'Central District', name: 'Central District', cx: 280, cy: 190, color: '#3b82f6', desc: 'Cultural Core & Heritage' },
        { id: 'Western Ghats District', name: 'Western Ghats District', cx: 410, cy: 220, color: '#10b981', desc: 'Rainforest Corridor & Eco Zones' },
        { id: 'Valley District', name: 'Valley District', cx: 240, cy: 280, color: '#8b5cf6', desc: 'Spice River Valleys' },
        { id: 'South Beach District', name: 'South Beach District', cx: 200, cy: 370, color: '#f59e0b', desc: 'Coastal Palms & Lagoons' },
        { id: 'Eastern Coastal District', name: 'Eastern Coastal District', cx: 430, cy: 330, color: '#06b6d4', desc: 'Harbors & Golden Sands' },
    ];

    useEffect(() => {
        fetchGisData();
    }, []);

    const fetchGisData = async () => {
        setLoading(true);
        try {
            const res = await API.get('/homestays/gis-data');
            if (res.data.success) {
                setHomestays(res.data.homestays || []);
                setDistrictsData(res.data.districts || {});
                if (res.data.homestays && res.data.homestays.length > 0) {
                    setActiveHomestay(res.data.homestays[0]);
                }
            }
        } catch (err) {
            console.error('Error fetching GIS data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter homestays
    const filteredHomestays = homestays.filter((h) => {
        if (selectedDistrict !== 'All' && h.district !== selectedDistrict) return false;
        if (filterRating !== 'All' && h.currentRating !== parseInt(filterRating)) return false;
        if (onlyEco && !h.ecoCertified) return false;
        return true;
    });

    // Helper: calculate SVG pin position from district or geo coords
    const getPinCoords = (homestay, idx) => {
        const region = districtRegions.find((r) => r.id === homestay.district) || districtRegions[1];
        // add slight spatial offset for clustering visualization
        const offsetAngle = (idx * 65) % 360;
        const radius = 25 + (idx % 3) * 15;
        const rad = (offsetAngle * Math.PI) / 180;
        return {
            x: region.cx + Math.cos(rad) * radius,
            y: region.cy + Math.sin(rad) * radius,
        };
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/70 via-slate-900 to-sky-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center space-x-2 bg-emerald-900/60 border border-emerald-700/60 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300">
                                <Compass className="w-4 h-4 text-emerald-400" />
                                <span>Official State Tourism GIS Geo-Registry</span>
                            </div>
                            <h1 className="text-3xl font-extrabold text-white font-outfit tracking-tight">
                                {t('gisTitle')}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-300">
                                {t('gisSubtitle')}
                            </p>
                        </div>

                        {/* Mode Switcher */}
                        <div className="bg-slate-900 border border-slate-800 p-1 rounded-2xl flex items-center space-x-1 shrink-0">
                            <button
                                onClick={() => setViewMode('tourist')}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                                    viewMode === 'tourist'
                                        ? 'bg-sky-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Compass className="w-4 h-4" />
                                <span>{t('touristMode')}</span>
                            </button>
                            <button
                                onClick={() => setViewMode('policyHeatmap')}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                                    viewMode === 'policyHeatmap'
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Layers className="w-4 h-4" />
                                <span>{t('heatmapMode')}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1">
                            <Filter className="w-3.5 h-3.5 text-sky-400" />
                            <span>Filters:</span>
                        </span>

                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        >
                            <option value="All">All State Districts</option>
                            {districtRegions.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>

                        <select
                            value={filterRating}
                            onChange={(e) => setFilterRating(e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        >
                            <option value="All">All Star Tiers</option>
                            <option value="5">5-Star Gold/Diamond</option>
                            <option value="4">4-Star Certified</option>
                            <option value="3">3-Star Standard</option>
                        </select>

                        <button
                            onClick={() => setOnlyEco(!onlyEco)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
                                onlyEco
                                    ? 'bg-emerald-600 border-emerald-500 text-white'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Eco-Certified Only</span>
                        </button>
                    </div>

                    <div className="text-xs font-semibold text-slate-400">
                        Showing <span className="text-white font-bold">{filteredHomestays.length}</span> verified properties across {districtRegions.length} districts
                    </div>
                </div>

                {/* Main GIS Map + Property Card View */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Interactive SVG GIS Map (7 Cols) */}
                    <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                        
                        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                            <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                    {viewMode === 'tourist' ? 'State Geo-Spatial Clusters' : 'Government Tourism Density & Subsidy Zones'}
                                </h3>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400">Projection: WGS84 / State UTM</span>
                        </div>

                        {/* State Vector Map */}
                        <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
                            
                            {/* Background Grid Pattern */}
                            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-sky-500" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>

                            <svg
                                viewBox="0 0 600 480"
                                className="w-full h-full select-none"
                            >
                                {/* State Contour / Stylized Geography */}
                                <path
                                    d="M 280,30 C 370,50 450,110 470,180 C 490,260 480,350 420,400 C 360,450 240,460 170,410 C 130,370 120,290 150,210 C 170,140 210,50 280,30 Z"
                                    className="fill-slate-900/90 stroke-slate-700/80 transition-colors"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                />

                                {/* District Regions */}
                                {districtRegions.map((region) => {
                                    const stats = districtsData[region.id] || { count: 0, overTourismIndex: 'Low' };
                                    const isSelected = selectedDistrict === region.id;
                                    const isHighDensity = stats.count >= 3;

                                    return (
                                        <g
                                            key={region.id}
                                            onClick={() => setSelectedDistrict(selectedDistrict === region.id ? 'All' : region.id)}
                                            className="cursor-pointer group"
                                        >
                                            {/* District Zone Glow / Heat circle */}
                                            <circle
                                                cx={region.cx}
                                                cy={region.cy}
                                                r={viewMode === 'policyHeatmap' ? (isHighDensity ? 65 : 45) : (isSelected ? 50 : 35)}
                                                className={`transition-all duration-500 ${
                                                    viewMode === 'policyHeatmap'
                                                        ? isHighDensity
                                                            ? 'fill-red-500/15 stroke-red-500/40'
                                                            : 'fill-emerald-500/15 stroke-emerald-500/40'
                                                        : isSelected
                                                        ? 'fill-sky-500/20 stroke-sky-400'
                                                        : 'fill-slate-800/40 stroke-slate-700 hover:fill-slate-800/80'
                                                }`}
                                                strokeWidth={isSelected ? '2' : '1'}
                                            />

                                            {/* District Label */}
                                            <text
                                                x={region.cx}
                                                y={region.cy - 18}
                                                textAnchor="middle"
                                                className="fill-slate-300 text-[11px] font-bold tracking-wider pointer-events-none group-hover:fill-white"
                                            >
                                                {region.name}
                                            </text>

                                            <text
                                                x={region.cx}
                                                y={region.cy + 24}
                                                textAnchor="middle"
                                                className="fill-slate-500 text-[9px] pointer-events-none"
                                            >
                                                {viewMode === 'policyHeatmap' ? stats.overTourismIndex : `${stats.count || 0} Registered`}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Homestay Geo Pins */}
                                {filteredHomestays.map((homestay, idx) => {
                                    const coords = getPinCoords(homestay, idx);
                                    const isActive = activeHomestay?._id === homestay._id;

                                    return (
                                        <g
                                            key={homestay._id || idx}
                                            onClick={() => setActiveHomestay(homestay)}
                                            className="cursor-pointer group"
                                        >
                                            {/* Ripple for active pin */}
                                            {isActive && (
                                                <circle
                                                    cx={coords.x}
                                                    cy={coords.y}
                                                    r="16"
                                                    className="fill-sky-400/20 stroke-sky-400 animate-ping"
                                                    strokeWidth="1"
                                                />
                                            )}

                                            {/* Pin Base */}
                                            <circle
                                                cx={coords.x}
                                                cy={coords.y}
                                                r={isActive ? '9' : '7'}
                                                className={`transition-all duration-300 ${
                                                    isActive
                                                        ? 'fill-sky-400 stroke-white'
                                                        : homestay.ecoCertified
                                                        ? 'fill-emerald-500 stroke-slate-900 hover:scale-125'
                                                        : 'fill-amber-400 stroke-slate-900 hover:scale-125'
                                                }`}
                                                strokeWidth="2"
                                            />

                                            {/* Inner Dot */}
                                            <circle
                                                cx={coords.x}
                                                cy={coords.y}
                                                r="2"
                                                className="fill-slate-950 pointer-events-none"
                                            />
                                        </g>
                                    );
                                })}
                            </svg>

                            {/* Map Legend */}
                            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl text-[10px] space-y-1 shadow-lg backdrop-blur-md">
                                <div className="flex items-center space-x-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                                    <span className="text-slate-300">Eco-Certified Homestay</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                                    <span className="text-slate-300">Standard Certified Stay</span>
                                </div>
                                {viewMode === 'policyHeatmap' && (
                                    <div className="flex items-center space-x-2 border-t border-slate-800 pt-1 mt-1">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                                        <span className="text-slate-300">Over-Tourism Saturation</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right: Active Homestay Detail Drawer & District Policy (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">

                        {activeHomestay ? (
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-5">
                                
                                {/* Photo Header */}
                                <div className="relative h-52 w-full bg-slate-950">
                                    <img
                                        src={activeHomestay.photos?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                                        alt={activeHomestay.propertyName}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                        <span className="bg-slate-900/90 text-white border border-slate-700/80 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>{activeHomestay.registrationNumber || 'CERTIFIED'}</span>
                                        </span>
                                        {activeHomestay.ecoCertified && (
                                            <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                                                <Leaf className="w-3 h-3 text-emerald-400" />
                                                <span>Eco Green Stay</span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center space-x-1 mb-1">
                                            {[...Array(activeHomestay.currentRating || 4)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            ))}
                                            <span className="text-xs font-bold text-amber-400 ml-1.5">
                                                {activeHomestay.currentRating ? `${activeHomestay.currentRating}.0 Star Quality Rating` : '4.0 Star'}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-extrabold text-white font-outfit leading-snug">
                                            {activeHomestay.propertyName}
                                        </h3>
                                    </div>
                                </div>

                                {/* Body Specs */}
                                <div className="p-6 pt-0 space-y-4 text-xs">
                                    <p className="text-slate-300 leading-relaxed">
                                        {activeHomestay.description || 'Verified heritage homestay registered with the State Tourism Department with certified amenities and safety compliance.'}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                        <div>
                                            <span className="text-slate-500 uppercase text-[10px] font-semibold">Location</span>
                                            <p className="font-semibold text-white mt-0.5">{activeHomestay.district}</p>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 uppercase text-[10px] font-semibold">Base Tariff</span>
                                            <p className="font-semibold text-emerald-400 mt-0.5">
                                                ₹{activeHomestay.rooms?.[0]?.tariff || 3500} / night
                                            </p>
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div>
                                        <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Certified Amenities</span>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {(activeHomestay.amenities || ['Wi-Fi', 'Hot Water', 'Parking', 'Fire Safety']).slice(0, 5).map((a, i) => (
                                                <span key={i} className="bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg text-[11px]">
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                                        <Link
                                            to={`/homestay/${activeHomestay._id}`}
                                            className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-center text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>View Homestay Profile</span>
                                        </Link>

                                        <Link
                                            to={`/verify-certificate?regNo=${encodeURIComponent(activeHomestay.registrationNumber || '')}`}
                                            className="py-3 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5 shrink-0"
                                        >
                                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                            <span>Verify Certificate</span>
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 space-y-3">
                                <Compass className="w-10 h-10 text-slate-600 mx-auto" />
                                <p className="text-sm">Click any pin on the map to explore homestay details.</p>
                            </div>
                        )}

                        {/* District Tourism Policy Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                                <TrendingUp className="w-4 h-4 text-sky-400" />
                                <span>State Tourism Dispersal & Eco Incentive Policy</span>
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                To avoid over-tourism congestion in urban town clusters, the Department offers up to <strong className="text-emerald-400">₹2,00,000 in capital subsidies</strong> for new homestays established in rural, tribal, and eco-heritage taluks.
                            </p>
                            <div className="pt-1">
                                <Link
                                    to="/pre-audit"
                                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
                                >
                                    <span>Simulate your property's subsidy eligibility & star rating</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default GisExplorerPage;
