import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
    Building2,
    Search,
    ShieldCheck,
    Star,
    Award,
    MapPin,
    ArrowRight,
    CheckCircle2,
    Users,
    Clock,
    HelpCircle,
    Sparkles,
    Compass,
    QrCode,
    Leaf,
    Flame,
    FileText
} from 'lucide-react';

const LandingPage = () => {
    const { t } = useLanguage();
    const [featuredHomestays, setFeaturedHomestays] = useState([]);
    const [searchDistrict, setSearchDistrict] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const districts = [
        'Central District',
        'North Hill District',
        'South Beach District',
        'Valley District',
        'Western Ghats District',
        'Eastern Coastal District',
    ];

    useEffect(() => {
        fetchFeatured();
    }, []);

    const fetchFeatured = async () => {
        try {
            const res = await API.get('/homestays/public?limit=6');
            if (res.data.success) {
                setFeaturedHomestays(res.data.data);
            }
        } catch (err) {
            console.error('Error loading featured homestays:', err);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?district=${encodeURIComponent(searchDistrict)}&q=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-24 border-b border-slate-800">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sky-900/20 via-emerald-950/10 to-transparent blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">

                    <div className="inline-flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-full text-xs font-semibold text-sky-400 shadow-xl">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>State Tourism Department Official Homestay Registry</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-outfit tracking-tight leading-tight max-w-4xl mx-auto">
                        Discover Verified & <span className="gradient-text">Star Quality Rated</span> Homestays
                    </h1>

                    <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Stay with official safety-inspected local hosts. Experience authentic hospitality, certified hygiene standards, and verified Department registration.
                    </p>

                    {/* Search Card */}
                    <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 p-4 sm:p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
                        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">

                            <div className="sm:col-span-5 relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <MapPin className="w-4 h-4 text-sky-400" />
                                </div>
                                <select
                                    value={searchDistrict}
                                    onChange={(e) => setSearchDistrict(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                >
                                    <option value="">All State Districts</option>
                                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            <div className="sm:col-span-5 relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <Search className="w-4 h-4 text-sky-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by name, landmark or town..."
                                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full h-full py-3 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all text-xs flex items-center justify-center space-x-1"
                                >
                                    <span>Search</span>
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
                        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                            <h3 className="text-2xl font-bold text-white font-outfit">1,240+</h3>
                            <p className="text-xs text-slate-400">Certified Homestays</p>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                            <h3 className="text-2xl font-bold text-emerald-400 font-outfit">100%</h3>
                            <p className="text-xs text-slate-400">Safety Inspected</p>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                            <h3 className="text-2xl font-bold text-amber-400 font-outfit">4.8 ★</h3>
                            <p className="text-xs text-slate-400">Average Quality Rating</p>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                            <h3 className="text-2xl font-bold text-sky-400 font-outfit">14 Days</h3>
                            <p className="text-xs text-slate-400">Fast Application SLA</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Differentiating Innovations Showcase: Pre-Audit & State GIS */}
            <section className="py-12 border-b border-slate-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* AI Pre-Audit Advisor Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-sky-950/40 border border-sky-800/40 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-sky-500/50 transition-all shadow-xl group">
                        <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                            <span>Official Self-Evaluation Suite</span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-white font-outfit">
                            AI Homestay Quality & Star-Rating Pre-Audit Advisor
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Planning to open or register a homestay? Run the State Department's automated compliance scanner to estimate your official Star Rating, detect safety gaps, and unlock rural eco subsidies.
                        </p>
                        <div className="pt-2">
                            <Link
                                to="/pre-audit"
                                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md transition-all group-hover:translate-x-1"
                            >
                                <span>Simulate Star Rating & Audit Readiness</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* State GIS Geo-Explorer Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-emerald-500/50 transition-all shadow-xl group">
                        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                            <Compass className="w-4 h-4 text-emerald-400" />
                            <span>Spatial Planning & Heatmap</span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-white font-outfit">
                            Interactive State GIS Eco-Tourism Explorer
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Discover certified homestays plotted on the interactive State GIS Map. View district density, eco-certified green stays, and government priority dispersal zones.
                        </p>
                        <div className="pt-2">
                            <Link
                                to="/explorer"
                                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all group-hover:translate-x-1"
                            >
                                <span>Launch State GIS Map</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            {/* Featured Certified Homestays */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800 pb-4">
                    <div>
                        <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Department Endorsed</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white font-outfit">Featured Star Rated Homestays</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/explorer"
                            className="flex items-center space-x-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                        >
                            <Compass className="w-3.5 h-3.5" />
                            <span>View on GIS Map</span>
                        </Link>
                        <Link
                            to="/search"
                            className="flex items-center space-x-1 text-xs font-bold text-sky-400 hover:text-sky-300"
                        >
                            <span>View All Homestays</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {featuredHomestays.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">Loading certified homestays directory...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredHomestays.map((item) => (
                            <div
                                key={item._id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-sky-600/50 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="relative aspect-video bg-slate-950">
                                        <img
                                            src={item.photos?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'}
                                            alt={item.propertyName}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-400 text-xs font-bold flex items-center space-x-1 border border-amber-500/30">
                                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                                            <span>{item.currentRating || 5} Stars</span>
                                        </div>
                                        {item.ecoCertified && (
                                            <div className="absolute top-3 left-3 bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-md">
                                                <Leaf className="w-3 h-3 text-emerald-400" />
                                                <span>Eco Stay</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 space-y-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-white font-outfit">{item.propertyName}</h3>
                                            <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                                                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                                                <span>{item.district}, {item.taluk}</span>
                                            </p>
                                        </div>

                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                            {item.description || 'Authentic certified homestay with modern amenities and local hospitality.'}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {item.amenities?.slice(0, 3).map((a) => (
                                                <span key={a} className="bg-slate-950 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-800">
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 pt-0">
                                    <Link
                                        to={`/homestay/${item._id}`}
                                        className="w-full flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold py-2.5 rounded-xl border border-slate-700 transition-colors"
                                    >
                                        <span>View Property & Certificate</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
};

export default LandingPage;
