import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import {
    Building2,
    MapPin,
    Star,
    Award,
    ShieldCheck,
    Phone,
    Mail,
    Bed,
    CheckSquare,
    Download,
    AlertCircle,
    FileCheck,
    Calendar
} from 'lucide-react';

const HomestayDetailPage = () => {
    const { id } = useParams();
    const [homestay, setHomestay] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHomestay();
    }, [id]);

    const fetchHomestay = async () => {
        try {
            const res = await API.get(`/homestays/public/${id}`);
            if (res.data.success) {
                setHomestay(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching homestay detail:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadCertificate = async () => {
        try {
            const response = await API.get(`/homestays/${id}/certificate`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Homestay_Certificate_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Certificate download failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    if (!homestay) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
                <div className="text-center space-y-3">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                    <h2 className="text-xl font-bold">Homestay Not Found</h2>
                    <Link to="/search" className="text-sky-400 text-xs font-semibold underline">Back to Directory</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Banner */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase mb-1">
                                <ShieldCheck className="w-4 h-4" />
                                <span>State Tourism Department Certified</span>
                            </div>
                            <h1 className="text-3xl font-extrabold text-white font-outfit">{homestay.propertyName}</h1>
                            <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                                <span>{homestay.address}, {homestay.taluk}, <strong className="text-white">{homestay.district}</strong></span>
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="bg-emerald-950/80 border border-emerald-800 px-4 py-2 rounded-2xl flex items-center space-x-3">
                                <Award className="w-6 h-6 text-emerald-400" />
                                <div>
                                    <p className="text-[10px] text-emerald-400 font-bold uppercase">Official Reg No</p>
                                    <p className="text-xs font-mono font-bold text-white">{homestay.registrationNumber || 'STATE-REG-CERTIFIED'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-1 text-amber-400 font-bold text-lg bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                                <Star className="w-5 h-5 fill-amber-400" />
                                <span>{homestay.currentRating || 5} Star Rating</span>
                            </div>
                        </div>
                    </div>

                    {/* Photo Gallery Grid */}
                    {homestay.photos?.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            {homestay.photos.map((photo, idx) => (
                                <div key={idx} className="rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-800">
                                    <img src={photo} alt={`Property ${idx}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Description & Rooms & Amenities */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Overview */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Property Overview</h3>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                {homestay.description || 'Welcome to an officially certified state homestay offering traditional warmth, high cleanliness standards, and authentic local food.'}
                            </p>
                        </div>

                        {/* Room Categories */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                                <Bed className="w-4 h-4 text-sky-400" />
                                <span>Available Accommodations</span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {homestay.rooms?.map((room, idx) => (
                                    <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                                        <h4 className="text-sm font-bold text-white">{room.roomType} Room</h4>
                                        <p className="text-xs text-slate-400">Max Capacity: <span className="text-white font-semibold">{room.maxOccupancy} Guests</span></p>
                                        <p className="text-xs text-slate-400">Tariff: <span className="text-emerald-400 font-bold">₹{room.tariff} / night</span></p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Amenities Checklist */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                                <CheckSquare className="w-4 h-4 text-emerald-400" />
                                <span>Verified Property Amenities</span>
                            </h3>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {homestay.amenities?.map((amenity) => (
                                    <div key={amenity} className="flex items-center space-x-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                                        <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Contact & Certificate & Grievance Actions */}
                    <div className="space-y-6">

                        {/* Contact & Verification Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Department Verification</h3>

                            <div className="space-y-3 text-xs text-slate-300">
                                <div className="flex items-center space-x-2 text-slate-400">
                                    <Phone className="w-4 h-4 text-sky-400" />
                                    <span>Contact Phone: <strong className="text-white font-mono">{homestay.contactPhone}</strong></span>
                                </div>
                                <div className="flex items-center space-x-2 text-slate-400">
                                    <Mail className="w-4 h-4 text-sky-400" />
                                    <span>Contact Email: <strong className="text-white">{homestay.contactEmail}</strong></span>
                                </div>
                            </div>

                            {homestay.status === 'approved' && (
                                <button
                                    onClick={handleDownloadCertificate}
                                    className="w-full flex items-center justify-center space-x-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download Official Certificate</span>
                                </button>
                            )}

                            <Link
                                to={`/verify-certificate?regNo=${homestay.registrationNumber || homestay._id}`}
                                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold rounded-xl text-xs border border-slate-700 transition-colors"
                            >
                                <FileCheck className="w-4 h-4" />
                                <span>Verify Registration Validity</span>
                            </Link>
                        </div>

                        {/* Grievance Link Box */}
                        <div className="bg-red-950/40 border border-red-900/60 p-6 rounded-3xl space-y-3 text-xs text-red-300">
                            <h4 className="font-bold flex items-center space-x-1.5 text-white">
                                <AlertCircle className="w-4 h-4 text-red-400" />
                                <span>Report Grievance or Feedback</span>
                            </h4>
                            <p className="leading-relaxed">
                                Faced safety issues, hygiene mismatch, or tariff overcharging? Submit an official tourist grievance directly to the District Officer.
                            </p>
                            <Link
                                to={`/grievance?homestayId=${homestay._id}`}
                                className="inline-block px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-md transition-all text-xs"
                            >
                                File Official Complaint
                            </Link>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default HomestayDetailPage;
