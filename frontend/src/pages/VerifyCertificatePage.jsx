import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';
import { ShieldCheck, Search, Award, CheckCircle2, XCircle, Star, Download, Building2 } from 'lucide-react';

const VerifyCertificatePage = () => {
    const [searchParams] = useSearchParams();
    const [regNo, setRegNo] = useState(searchParams.get('regNo') || '');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (regNo) {
            handleVerify();
        }
    }, []);

    const handleVerify = async (e) => {
        if (e) e.preventDefault();
        if (!regNo.trim()) return;

        setLoading(true);
        setSearched(true);
        try {
            // Find homestay by reg number or id
            const res = await API.get(`/homestays/public?q=${encodeURIComponent(regNo.trim())}`);
            if (res.data.success && res.data.data.length > 0) {
                const match = res.data.data[0];
                setResult(match);
            } else {
                setResult(null);
            }
        } catch (err) {
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Banner */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center space-x-2 bg-emerald-950/80 border border-emerald-800/80 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Official Government Registry Verification Portal</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white font-outfit">Verify Homestay Certificate</h1>
                    <p className="text-xs text-slate-400">
                        Enter official Registration Number (e.g. STATE-CEN-2026-1234) or Homestay Name to check validity and star rating.
                    </p>
                </div>

                {/* Input Card */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-4">
                    <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                required
                                value={regNo}
                                onChange={(e) => setRegNo(e.target.value)}
                                placeholder="Enter Registration No (STATE-DIST-2026-XXXX)..."
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 font-mono"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-3 px-6 bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-2 shrink-0"
                        >
                            <Search className="w-4 h-4" />
                            <span>Verify Now</span>
                        </button>
                    </form>
                </div>

                {/* Verification Result Card */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                    </div>
                ) : searched && (
                    result ? (
                        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-800/80 rounded-3xl p-8 shadow-2xl space-y-6">
                            <div className="flex items-center space-x-3 text-emerald-400 border-b border-slate-800 pb-4">
                                <CheckCircle2 className="w-8 h-8 shrink-0 text-emerald-400" />
                                <div>
                                    <h3 className="text-xl font-extrabold text-white font-outfit">OFFICIALLY CERTIFIED & VERIFIED</h3>
                                    <p className="text-xs text-emerald-400 font-medium">State Tourism Department Homestay Quality Framework</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs">
                                <div>
                                    <p className="text-slate-400 uppercase text-[10px] font-semibold">Registration Number</p>
                                    <p className="text-sm font-mono font-bold text-white mt-0.5">{result.registrationNumber || 'STATE-DIST-2026-CERT'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 uppercase text-[10px] font-semibold">Quality Star Rating</p>
                                    <div className="flex items-center space-x-1 text-amber-400 font-bold text-sm mt-0.5">
                                        <Star className="w-4 h-4 fill-amber-400" />
                                        <span>{result.currentRating || 5} Star Certified</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-slate-400 uppercase text-[10px] font-semibold">Property Name</p>
                                    <p className="text-sm font-bold text-white mt-0.5">{result.propertyName}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 uppercase text-[10px] font-semibold">District Location</p>
                                    <p className="text-sm font-bold text-sky-400 mt-0.5">{result.district}</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                                <Link
                                    to={`/homestay/${result._id}`}
                                    className="text-sky-400 hover:text-sky-300 text-xs font-bold underline"
                                >
                                    View Full Property Page
                                </Link>
                                <a
                                    href={`http://localhost:5000/api/v1/homestays/${result._id}/certificate`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download Official Certificate (PDF)</span>
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-900 border border-red-900/60 rounded-3xl p-8 text-center space-y-3">
                            <XCircle className="w-12 h-12 text-red-400 mx-auto" />
                            <h3 className="text-xl font-bold text-white">Registration Not Found / Invalid</h3>
                            <p className="text-xs text-slate-400 max-w-md mx-auto">
                                No active certified homestay matches the entered Registration Number. Please ensure accuracy or report uncertified homestays.
                            </p>
                        </div>
                    )
                )}

            </div>
        </div>
    );
};

export default VerifyCertificatePage;
