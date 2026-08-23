import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import {
    Building2,
    MapPin,
    Bed,
    CheckSquare,
    Upload,
    Camera,
    CheckCircle,
    ArrowRight,
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    ShieldCheck,
    FileText
} from 'lucide-react';

const RegistrationFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [savedHomestayId, setSavedHomestayId] = useState(id || null);

    // Form State
    const [formData, setFormData] = useState({
        propertyName: '',
        description: '',
        address: '',
        district: 'Central District',
        taluk: 'Central Taluk',
        contactPhone: '',
        contactEmail: '',
        lat: 12.9716,
        lng: 77.5946,
    });

    const [rooms, setRooms] = useState([
        { roomType: 'Double', count: 2, maxOccupancy: 2, tariff: 2500 }
    ]);

    const [selectedAmenities, setSelectedAmenities] = useState([
        'Wi-Fi', 'Hot Water', 'Home-cooked Meals', 'Parking'
    ]);

    const [documents, setDocuments] = useState([]);
    const [photos, setPhotos] = useState([]);

    const districts = [
        'Central District',
        'North Hill District',
        'South Beach District',
        'Valley District',
        'Western Ghats District',
        'Eastern Coastal District',
    ];

    const availableAmenities = [
        'Wi-Fi', 'Hot Water', 'Home-cooked Meals', 'Parking', 'Air Conditioning',
        'Power Backup', 'TV / Entertainment', 'Garden / Lawn', 'Local Tour Assistance',
        'Eco-friendly / Solar', 'Fire Safety Extinguisher', 'First Aid Kit'
    ];

    const docTypes = [
        'ID Proof',
        'Property Ownership / Lease',
        'NOC from Local Body',
        'Fire Safety Certificate',
        'Police Verification'
    ];

    useEffect(() => {
        if (savedHomestayId) {
            fetchHomestayData(savedHomestayId);
        }
    }, [savedHomestayId]);

    const fetchHomestayData = async (homestayId) => {
        try {
            const res = await API.get(`/homestays/${homestayId}`);
            if (res.data.success) {
                const data = res.data.data;
                setFormData({
                    propertyName: data.propertyName || '',
                    description: data.description || '',
                    address: data.address || '',
                    district: data.district || 'Central District',
                    taluk: data.taluk || 'Central Taluk',
                    contactPhone: data.contactPhone || '',
                    contactEmail: data.contactEmail || '',
                    lat: data.geoLocation?.lat || 12.9716,
                    lng: data.geoLocation?.lng || 77.5946,
                });
                if (data.rooms?.length > 0) setRooms(data.rooms);
                if (data.amenities?.length > 0) setSelectedAmenities(data.amenities);
                if (data.documents) setDocuments(data.documents);
                if (data.photos) setPhotos(data.photos);
            }
        } catch (err) {
            console.error('Error fetching homestay details:', err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddRoom = () => {
        setRooms([...rooms, { roomType: 'Double', count: 1, maxOccupancy: 2, tariff: 2000 }]);
    };

    const handleRemoveRoom = (index) => {
        setRooms(rooms.filter((_, i) => i !== index));
    };

    const handleRoomChange = (index, field, value) => {
        const updated = [...rooms];
        updated[index][field] = value;
        setRooms(updated);
    };

    const toggleAmenity = (amenity) => {
        if (selectedAmenities.includes(amenity)) {
            setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
        } else {
            setSelectedAmenities([...selectedAmenities, amenity]);
        }
    };

    const handleSaveDraft = async () => {
        setLoading(true);
        try {
            const payload = {
                _id: savedHomestayId,
                propertyName: formData.propertyName,
                description: formData.description,
                address: formData.address,
                district: formData.district,
                taluk: formData.taluk,
                contactPhone: formData.contactPhone,
                contactEmail: formData.contactEmail,
                geoLocation: { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) },
                rooms,
                amenities: selectedAmenities,
            };

            const res = await API.post('/homestays', payload);
            if (res.data.success) {
                setSavedHomestayId(res.data.data._id);
                return res.data.data._id;
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save draft');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e, type, docType = null) => {
        const file = e.target.files[0];
        if (!file) return;

        let currentId = savedHomestayId;
        if (!currentId) {
            currentId = await handleSaveDraft();
        }

        if (!currentId) return;

        const data = new FormData();
        data.append('file', file);
        if (docType) data.append('docType', docType);

        setLoading(true);
        try {
            if (type === 'document') {
                const res = await API.post(`/homestays/${currentId}/documents`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                if (res.data.success) {
                    setDocuments(res.data.data);
                }
            } else if (type === 'photo') {
                const res = await API.post(`/homestays/${currentId}/photos`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                if (res.data.success) {
                    setPhotos(res.data.data);
                }
            }
        } catch (err) {
            alert(err.response?.data?.message || 'File upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitApplication = async () => {
        let currentId = savedHomestayId;
        if (!currentId) {
            currentId = await handleSaveDraft();
        }

        if (!currentId) return;

        setLoading(true);
        try {
            const res = await API.post(`/homestays/${currentId}/submit`);
            if (res.data.success) {
                alert('Homestay application submitted successfully to Tourism Department!');
                navigate('/owner/dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { num: 1, title: 'Basic Details', icon: Building2 },
        { num: 2, title: 'Rooms & Amenities', icon: Bed },
        { num: 3, title: 'Documents', icon: FileText },
        { num: 4, title: 'Photos', icon: Camera },
        { num: 5, title: 'Declaration & Submit', icon: ShieldCheck },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Title */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold text-white font-outfit">
                        Homestay Registration Portal
                    </h1>
                    <p className="text-sm text-slate-400">
                        Complete the multi-step application to apply for State Tourism Department Certification & Quality Star Rating.
                    </p>
                </div>

                {/* Step Progress Bar */}
                <div className="grid grid-cols-5 gap-2 bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        const isActive = activeStep === step.num;
                        const isCompleted = activeStep > step.num;
                        return (
                            <button
                                key={step.num}
                                onClick={() => setActiveStep(step.num)}
                                className={`flex flex-col items-center p-3 rounded-xl transition-all ${isActive
                                        ? 'bg-sky-600 text-white shadow-lg'
                                        : isCompleted
                                            ? 'bg-slate-800 text-emerald-400'
                                            : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                <Icon className="w-5 h-5 mb-1" />
                                <span className="text-[11px] font-semibold hidden sm:inline">{step.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Form Container */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">

                    {/* STEP 1: Basic Property Info */}
                    {activeStep === 1 && (
                        <div className="space-y-5">
                            <h2 className="text-xl font-bold text-white font-outfit border-b border-slate-800 pb-3 flex items-center space-x-2">
                                <Building2 className="w-5 h-5 text-sky-400" />
                                <span>Step 1: Property & Location Details</span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                                        Property Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="propertyName"
                                        required
                                        value={formData.propertyName}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Green Valley Homestay"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                                        District *
                                    </label>
                                    <select
                                        name="district"
                                        value={formData.district}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-sky-500"
                                    >
                                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                                    Full Property Address *
                                </label>
                                <textarea
                                    name="address"
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Door No, Street, Village / Town, Landmark"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-sky-500"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                                        Taluk / Sub-district *
                                    </label>
                                    <input
                                        type="text"
                                        name="taluk"
                                        value={formData.taluk}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Central Taluk"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                                        Contact Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        name="contactPhone"
                                        value={formData.contactPhone}
                                        onChange={handleInputChange}
                                        placeholder="+91 98765 43210"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                                        Contact Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleInputChange}
                                        placeholder="contact@homestay.com"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                                    Property Overview / Description
                                </label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe surroundings, heritage aspect, local attractions nearby..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-sky-500"
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Rooms & Amenities */}
                    {activeStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white font-outfit border-b border-slate-800 pb-3 flex items-center space-x-2">
                                <Bed className="w-5 h-5 text-sky-400" />
                                <span>Step 2: Room Capacity & Amenities Checklist</span>
                            </h2>

                            {/* Room Configurations */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-slate-200">Room Configurations</h3>
                                    <button
                                        type="button"
                                        onClick={handleAddRoom}
                                        className="flex items-center space-x-1 text-xs font-semibold text-sky-400 hover:text-sky-300 bg-sky-950/60 px-3 py-1.5 rounded-lg border border-sky-800/60"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Room Type</span>
                                    </button>
                                </div>

                                {rooms.map((room, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 relative">
                                        <div>
                                            <label className="block text-[10px] text-slate-400 uppercase mb-1">Room Type</label>
                                            <select
                                                value={room.roomType}
                                                onChange={(e) => handleRoomChange(index, 'roomType', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                                            >
                                                <option value="Single">Single</option>
                                                <option value="Double">Double</option>
                                                <option value="Suite">Suite</option>
                                                <option value="Family Room">Family Room</option>
                                                <option value="Traditional Cottage">Traditional Cottage</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] text-slate-400 uppercase mb-1">Count</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={room.count}
                                                onChange={(e) => handleRoomChange(index, 'count', parseInt(e.target.value) || 1)}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] text-slate-400 uppercase mb-1">Max Occupants</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={room.maxOccupancy}
                                                onChange={(e) => handleRoomChange(index, 'maxOccupancy', parseInt(e.target.value) || 1)}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <div className="flex-1">
                                                <label className="block text-[10px] text-slate-400 uppercase mb-1">Tariff (₹/night)</label>
                                                <input
                                                    type="number"
                                                    step="100"
                                                    value={room.tariff}
                                                    onChange={(e) => handleRoomChange(index, 'tariff', parseInt(e.target.value) || 0)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                                                />
                                            </div>
                                            {rooms.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveRoom(index)}
                                                    className="p-2 text-red-400 hover:text-red-300 mt-4"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Amenities Checklist */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-200 mb-3">Available Amenities</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {availableAmenities.map((amenity) => {
                                        const isChecked = selectedAmenities.includes(amenity);
                                        return (
                                            <button
                                                key={amenity}
                                                type="button"
                                                onClick={() => toggleAmenity(amenity)}
                                                className={`flex items-center space-x-2 p-3 rounded-xl text-xs font-semibold border transition-all text-left ${isChecked
                                                        ? 'bg-sky-950/80 text-sky-300 border-sky-700 shadow-sm'
                                                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                                                    }`}
                                            >
                                                <CheckSquare className={`w-4 h-4 ${isChecked ? 'text-sky-400' : 'text-slate-600'}`} />
                                                <span>{amenity}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Mandatory Document Uploads */}
                    {activeStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white font-outfit border-b border-slate-800 pb-3 flex items-center space-x-2">
                                <FileText className="w-5 h-5 text-sky-400" />
                                <span>Step 3: Verification Documents Upload</span>
                            </h2>

                            <p className="text-xs text-slate-400">
                                Upload clear PDF or Image copies of required government & safety documents.
                            </p>

                            <div className="space-y-4">
                                {docTypes.map((dType) => {
                                    const uploaded = documents.find(d => d.docType === dType);
                                    return (
                                        <div key={dType} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-white">{dType}</p>
                                                <p className="text-[11px] text-slate-400">PDF, JPG or PNG format (Max 10MB)</p>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                {uploaded ? (
                                                    <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/60">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>Uploaded</span>
                                                    </div>
                                                ) : (
                                                    <label className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer border border-slate-700 transition-colors">
                                                        <Upload className="w-3.5 h-3.5 text-sky-400" />
                                                        <span>Choose File</span>
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.jpg,.png,.webp"
                                                            className="hidden"
                                                            onChange={(e) => handleFileUpload(e, 'document', dType)}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Photo Uploads */}
                    {activeStep === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white font-outfit border-b border-slate-800 pb-3 flex items-center space-x-2">
                                <Camera className="w-5 h-5 text-sky-400" />
                                <span>Step 4: Property Photos</span>
                            </h2>

                            <p className="text-xs text-slate-400">
                                Upload clear photos of property exterior, guest rooms, bathroom, and dining/common area.
                            </p>

                            <div className="border-2 border-dashed border-slate-800 hover:border-sky-500 rounded-3xl p-8 text-center bg-slate-950/50 transition-colors">
                                <Camera className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-slate-200 mb-1">Click to Upload Photos</p>
                                <p className="text-xs text-slate-500 mb-4">JPEG, PNG or WebP images</p>
                                <label className="inline-flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-md transition-all">
                                    <Upload className="w-4 h-4" />
                                    <span>Select Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, 'photo')}
                                    />
                                </label>
                            </div>

                            {photos.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-semibold text-slate-400 uppercase mb-3">Uploaded Photos ({photos.length})</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {photos.map((url, idx) => (
                                            <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 aspect-video bg-slate-950">
                                                <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 5: Final Submission */}
                    {activeStep === 5 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white font-outfit border-b border-slate-800 pb-3 flex items-center space-x-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                <span>Step 5: Review & Formal Declaration</span>
                            </h2>

                            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-300">
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-slate-400">Property Name:</span>
                                    <span className="font-semibold text-white">{formData.propertyName || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-slate-400">District:</span>
                                    <span className="font-semibold text-white">{formData.district}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-800 pb-2">
                                    <span className="text-slate-400">Room Configurations:</span>
                                    <span className="font-semibold text-white">{rooms.length} Room Types</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Documents Attached:</span>
                                    <span className="font-semibold text-emerald-400">{documents.length} Uploaded</span>
                                </div>
                            </div>

                            <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-2xl space-y-2 text-xs text-emerald-300">
                                <p className="font-bold flex items-center space-x-1">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    <span>Owner Self-Declaration Mandate</span>
                                </p>
                                <p className="leading-relaxed">
                                    I hereby declare that all details furnished above are true to the best of my knowledge. I agree to abide by State Tourism Department Homestay Registration Rules and permit physical inspection by designated Inspectors.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmitApplication}
                                disabled={loading}
                                className="w-full flex justify-center items-center space-x-2 py-4 px-6 rounded-2xl shadow-xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                            >
                                {loading ? (
                                    <span>Submitting Application...</span>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-5 h-5" />
                                        <span>Submit Application for Review</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Navigation & Save Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                        <button
                            type="button"
                            disabled={activeStep === 1}
                            onClick={() => setActiveStep(activeStep - 1)}
                            className="flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Previous Step</span>
                        </button>

                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                disabled={loading}
                                className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                            >
                                <Save className="w-3.5 h-3.5 text-sky-400" />
                                <span>Save Draft</span>
                            </button>

                            {activeStep < 5 && (
                                <button
                                    type="button"
                                    onClick={() => setActiveStep(activeStep + 1)}
                                    className="flex items-center space-x-1.5 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow transition-all"
                                >
                                    <span>Next Step</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RegistrationFormPage;
