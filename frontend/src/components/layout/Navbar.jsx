import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
    AlertCircle
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
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
                            <p className="text-xs text-slate-400 font-medium">Homestay Quality Rating & Registration</p>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/search"
                            className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${location.pathname === '/search' ? 'text-sky-400 font-semibold' : 'text-slate-300 hover:text-white'
                                }`}
                        >
                            <Search className="w-4 h-4" />
                            <span>Certified Homestays</span>
                        </Link>

                        <Link
                            to="/verify-certificate"
                            className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${location.pathname === '/verify-certificate' ? 'text-sky-400 font-semibold' : 'text-slate-300 hover:text-white'
                                }`}
                        >
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Verify Certificate</span>
                        </Link>

                        {user?.role === 'owner' && (
                            <>
                                <Link
                                    to="/owner/dashboard"
                                    className={`text-sm font-medium transition-colors ${location.pathname === '/owner/dashboard' ? 'text-sky-400 font-semibold' : 'text-slate-300 hover:text-white'
                                        }`}
                                >
                                    My Dashboard
                                </Link>
                                <Link
                                    to="/owner/homestays/new"
                                    className="flex items-center space-x-1.5 text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg transition-all shadow-sm"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>Register Homestay</span>
                                </Link>
                            </>
                        )}

                        {(user?.role === 'superadmin' || user?.role === 'districtadmin') && (
                            <Link
                                to="/admin/dashboard"
                                className="flex items-center space-x-1.5 text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 px-4 py-2 rounded-lg border border-slate-700 transition-all"
                            >
                                <ClipboardList className="w-4 h-4 text-sky-400" />
                                <span>Admin Portal</span>
                            </Link>
                        )}

                        {user?.role === 'inspector' && (
                            <Link
                                to="/inspector/assignments"
                                className="flex items-center space-x-1.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-all shadow-sm"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Inspection Queue</span>
                            </Link>
                        )}

                        {/* Auth Buttons */}
                        {user ? (
                            <div className="flex items-center space-x-4 border-l border-slate-800 pl-6">
                                <div className="flex flex-col text-right">
                                    <span className="text-sm font-semibold text-white leading-tight">{user.name}</span>
                                    <div className="mt-0.5">{getRoleBadge(user.role)}</div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 border-l border-slate-800 pl-6">
                                <Link
                                    to="/login"
                                    className="text-sm font-semibold text-slate-200 hover:text-white px-3 py-2 rounded-lg transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-sm font-semibold bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white px-4 py-2 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
                                >
                                    Register Property
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
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
                <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
                    <Link
                        to="/search"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-slate-200 py-2 hover:text-sky-400 font-medium"
                    >
                        Certified Homestays
                    </Link>
                    <Link
                        to="/verify-certificate"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-slate-200 py-2 hover:text-sky-400 font-medium"
                    >
                        Verify Certificate
                    </Link>
                    {user ? (
                        <div className="pt-4 border-t border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white">{user.name}</span>
                                {getRoleBadge(user.role)}
                            </div>
                            <button
                                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                                className="w-full text-left py-2 text-red-400 hover:text-red-300 font-semibold"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="pt-4 border-t border-slate-800 space-y-2">
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-center w-full py-2 border border-slate-700 rounded-lg text-slate-200 font-semibold"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-center w-full py-2 bg-sky-600 rounded-lg text-white font-semibold"
                            >
                                Register Property
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
