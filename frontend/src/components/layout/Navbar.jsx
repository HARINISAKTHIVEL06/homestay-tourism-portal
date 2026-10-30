import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
    Building2,
    ShieldCheck,
    User,
    LogOut,
    Menu,
    X,
    Sparkles,
    CheckCircle2,
    Search,
    PlusCircle,
    ClipboardList,
    FileText,
    AlertCircle,
    Compass,
    Globe
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { t, language, toggleLanguage } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'superadmin':
                return <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-purple-200">HQ Super Admin</span>;
            case 'districtadmin':
                return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-200">District Officer</span>;
            case 'inspector':
                return <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">Inspector</span>;
            case 'owner':
                return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-200">Homestay Owner</span>;
            default:
                return null;
        }
    };

    return (
        <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
                            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-sky-400" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-lg text-white font-outfit tracking-tight">State Tourism Dept</span>
                                <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border border-sky-500/30">Official</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">{t('portalSubtitle')}</p>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center space-x-5">
                        <Link
                            to="/search"
                            className={`flex items-center space-x-1.5 text-xs font-medium transition-colors ${
                                location.pathname === '/search' ? 'text-sky-400 font-semibold' : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            <Search className="w-3.5 h-3.5" />
                            <span>{t('navCertified')}</span>
                        </Link>

                        <Link
                            to="/explorer"
                            className={`flex items-center space-x-1.5 text-xs font-medium transition-colors ${
                                location.pathname === '/explorer' ? 'text-sky-400 font-semibold' : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            <Compass className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{t('navGisExplorer')}</span>
                            <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">GIS</span>
                        </Link>

                        <Link
                            to="/pre-audit"
                            className={`flex items-center space-x-1.5 text-xs font-medium transition-colors ${
                                location.pathname === '/pre-audit' ? 'text-sky-400 font-semibold' : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>{t('navPreAudit')}</span>
                            <span className="bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-500/30">AI</span>
                        </Link>

                        <Link
                            to="/verify-certificate"
                            className={`flex items-center space-x-1.5 text-xs font-medium transition-colors ${
                                location.pathname === '/verify-certificate' ? 'text-sky-400 font-semibold' : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{t('navVerify')}</span>
                        </Link>

                        <Link
                            to="/grievance"
                            className={`flex items-center space-x-1.5 text-xs font-medium transition-colors ${
                                location.pathname === '/grievance' ? 'text-sky-400 font-semibold' : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                            <span>{t('navGrievance')}</span>
                        </Link>

                        {/* Language Switcher Button */}
                        <button
                            onClick={toggleLanguage}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
                            title="Toggle English / हिन्दी"
                        >
                            <Globe className="w-3.5 h-3.5 text-sky-400" />
                            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
                        </button>

                        {user?.role === 'owner' && (
                            <>
                                <Link
                                    to="/owner/dashboard"
                                    className={`text-xs font-medium transition-colors ${
                                        location.pathname === '/owner/dashboard' ? 'text-sky-400 font-semibold' : 'text-slate-300 hover:text-white'
                                    }`}
                                >
                                    {t('navDashboard')}
                                </Link>
                                <Link
                                    to="/owner/homestays/new"
                                    className="flex items-center space-x-1 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm"
                                >
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    <span>{t('navRegisterHomestay')}</span>
                                </Link>
                            </>
                        )}

                        {(user?.role === 'superadmin' || user?.role === 'districtadmin') && (
                            <>
                                <Link
                                    to="/admin/dashboard"
                                    className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                                        location.pathname === '/admin/dashboard'
                                            ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                                            : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700'
                                    }`}
                                >
                                    <ClipboardList className="w-3.5 h-3.5 text-sky-400" />
                                    <span>{t('navAdminPortal')}</span>
                                </Link>
                                <Link
                                    to="/officer/applications"
                                    className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                                        location.pathname === '/officer/applications'
                                            ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                                            : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700'
                                    }`}
                                >
                                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                                    <span>{t('navReviewApps')}</span>
                                </Link>
                            </>
                        )}

                        {user?.role === 'inspector' && (
                            <Link
                                to="/inspector/assignments"
                                className="flex items-center space-x-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{t('navInspectionQueue')}</span>
                            </Link>
                        )}

                        {/* Auth Buttons */}
                        {user ? (
                            <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
                                <div className="flex flex-col text-right">
                                    <span className="text-xs font-semibold text-white leading-tight">{user.name}</span>
                                    <div className="mt-0.5">{getRoleBadge(user.role)}</div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 border-l border-slate-800 pl-4">
                                <Link
                                    to="/login"
                                    className="text-xs font-semibold text-slate-200 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    {t('navSignIn')}
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-xs font-semibold bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white px-3.5 py-1.5 rounded-lg shadow-md transition-all"
                                >
                                    {t('navRegisterProperty')}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center space-x-2">
                        <button
                            onClick={toggleLanguage}
                            className="bg-slate-800 px-2 py-1 rounded border border-slate-700 text-xs font-semibold text-sky-400"
                        >
                            {language === 'en' ? 'हिन्दी' : 'EN'}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-400 hover:text-white focus:outline-none"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 text-xs">
                    <Link
                        to="/search"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-slate-200 py-2 hover:text-sky-400 font-medium"
                    >
                        {t('navCertified')}
                    </Link>
                    <Link
                        to="/explorer"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-slate-200 py-2 hover:text-sky-400 font-medium flex items-center justify-between"
                    >
                        <span>{t('navGisExplorer')}</span>
                        <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded">GIS</span>
                    </Link>
                    <Link
                        to="/pre-audit"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-slate-200 py-2 hover:text-sky-400 font-medium flex items-center justify-between"
                    >
                        <span>{t('navPreAudit')}</span>
                        <span className="bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded">AI</span>
                    </Link>
                    <Link
                        to="/verify-certificate"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-slate-200 py-2 hover:text-sky-400 font-medium"
                    >
                        {t('navVerify')}
                    </Link>
                    <Link
                        to="/grievance"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-slate-200 py-2 hover:text-sky-400 font-medium"
                    >
                        {t('navGrievance')}
                    </Link>

                    {user ? (
                        <div className="pt-4 border-t border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white">{user.name}</span>
                                {getRoleBadge(user.role)}
                            </div>

                            {/* Mobile Role Links */}
                            {user.role === 'owner' && (
                                <Link
                                    to="/owner/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-sky-400 font-semibold py-1"
                                >
                                    {t('navDashboard')}
                                </Link>
                            )}

                            {(user.role === 'superadmin' || user.role === 'districtadmin') && (
                                <div className="space-y-2 pt-1 border-t border-slate-800/60">
                                    <Link
                                        to="/admin/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block text-sky-400 font-semibold py-1"
                                    >
                                        {t('navAdminPortal')}
                                    </Link>
                                    <Link
                                        to="/officer/applications"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block text-emerald-400 font-semibold py-1"
                                    >
                                        {t('navReviewApps')}
                                    </Link>
                                </div>
                            )}

                            {user.role === 'inspector' && (
                                <Link
                                    to="/inspector/assignments"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-emerald-400 font-semibold py-1"
                                >
                                    {t('navInspectionQueue')}
                                </Link>
                            )}
                            <button
                                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                                className="w-full text-left py-2 text-red-400 hover:text-red-300 font-semibold"
                            >
                                {t('navSignOut')}
                            </button>
                        </div>
                    ) : (
                        <div className="pt-4 border-t border-slate-800 space-y-2">
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-center w-full py-2 border border-slate-700 rounded-lg text-slate-200 font-semibold"
                            >
                                {t('navSignIn')}
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-center w-full py-2 bg-sky-600 rounded-lg text-white font-semibold"
                            >
                                {t('navRegisterProperty')}
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
