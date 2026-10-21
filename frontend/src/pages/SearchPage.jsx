import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';
import { Search, MapPin, Star, Filter, ArrowRight, Building2, Compass, Leaf, Sparkles } from 'lucide-react';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [homestays, setHomestays] = useState([]);
    const [loading, setLoading] = useState(true);

    const [district, setDistrict] = useState(searchParams.get('district') || '');
    const [rating, setRating] = useState(searchParams.get('rating') || '');
    const [query, setQuery] = useState(searchParams.get('q') || '');

    const districts = [
        'Central District',
        'North Hill District',
        'South Beach District',
        'Valley District',
        'Western Ghats District',
        'Eastern Coastal District',
    ];

    useEffect(() => {
        fetchResults();
    }, [searchParams]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await API.get('/homestays/public', {
                params: {
                    district: searchParams.get('district') || undefined,
                    rating: searchParams.get('rating') || undefined,
                    q: searchParams.get('q') || undefined,
                },
            });

            if (res.data.success) {
                setHomestays(res.data.data);
            }
        } catch (err) {
            console.error('Error searching homestays:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyFilter = (e) => {
        e.preventDefault();
        const params = {};
        if (district) params.district = district;
        if (rating) params.rating = rating;
        if (query) params.q = query;
        setSearchParams(params);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white font-outfit">Official Certified Homestays Directory</h1>
                        <p className="text-xs text-slate-400 mt-1">Browse state tourism department verified properties with star ratings.</p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                        <Link
                            to="/explorer"
                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-2"
                        >
                            <Compass className="w-4 h-4" />
                            <span>Interactive State GIS Map</span>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Filters Sidebar */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 h-fit">
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-sky-400" />
                            <span>Filter Registry</span>
                        </h2>

                        <form onSubmit={handleApplyFilter} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Search Keywords</label>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Property name or town..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">District</label>
                                <select
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                                >
                                    <option value="">All Districts</option>
                                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Star Rating</label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                                >
                                    <option value="">All Ratings</option>
                                    <option value="5">5 Star Certified</option>
                                    <option value="4">4 Star & Above</option>
                                    <option value="3">3 Star & Above</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow transition-all"
                            >
                                Apply Filters
                            </button>
                        </form>
                    </div>

                    {/* Directory Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
                            </div>
                        ) : homestays.length === 0 ? (
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-2">
                                <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
                                <h3 className="text-lg font-bold text-white">No Homestays Found</h3>
                                <p className="text-xs">Try clearing search parameters or filtering by another district.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {homestays.map((item) => (
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
                                            </div>

                                            <div className="p-5 space-y-2">
                                                <h3 className="text-lg font-bold text-white font-outfit">{item.propertyName}</h3>
                                                <p className="text-xs text-slate-400 flex items-center space-x-1">
                                                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                                    <span>{item.district}, {item.taluk}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-5 pt-0">
                                            <Link
                                                to={`/homestay/${item._id}`}
                                                className="w-full flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold py-2.5 rounded-xl border border-slate-700 transition-colors"
                                            >
                                                <span>View Details</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SearchPage;
