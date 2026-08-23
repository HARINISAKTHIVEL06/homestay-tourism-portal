import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Building2, ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);
            if (user.role === 'superadmin' || user.role === 'districtadmin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'inspector') {
                navigate('/inspector/assignments');
            } else {
                navigate('/owner/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    const setPreset = (presetEmail, presetPass) => {
        setEmail(presetEmail);
        setPassword(presetPass);
    };

    return (
        <div className="min-h-[85vh] bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">

            {/* Subtle Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 p-0.5 shadow-xl">
                        <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-sky-400" />
                        </div>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white font-outfit tracking-tight">
                    Portal Sign In
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    State Tourism Department Homestay Management System
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 shadow-2xl border border-slate-800 rounded-2xl sm:px-10">

                    {error && (
                        <div className="mb-6 bg-red-950/60 border border-red-800 text-red-300 px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
                            <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@domain.com"
                                    className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-sky-400 hover:text-sky-300">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                        >
                            {loading ? (
                                <span>Signing in...</span>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Quick Login Presets for Evaluator Ease */}
                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
                            Quick Role Test Logins
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <button
                                type="button"
                                onClick={() => setPreset('admin@tourism.gov.in', 'Admin@123')}
                                className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-purple-300 rounded-lg border border-slate-800 text-left flex items-center space-x-1.5 transition-colors"
                            >
                                <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                <span className="truncate">Super Admin</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreset('officer@tourism.gov.in', 'Officer@123')}
                                className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-sky-300 rounded-lg border border-slate-800 text-left flex items-center space-x-1.5 transition-colors"
                            >
                                <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                <span className="truncate">District Officer</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreset('inspector@tourism.gov.in', 'Inspector@123')}
                                className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-emerald-300 rounded-lg border border-slate-800 text-left flex items-center space-x-1.5 transition-colors"
                            >
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="truncate">Inspector</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreset('owner@gmail.com', 'Owner@123')}
                                className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-amber-300 rounded-lg border border-slate-800 text-left flex items-center space-x-1.5 transition-colors"
                            >
                                <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span className="truncate">Homestay Owner</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-400">
                            New Homestay Owner?{' '}
                            <Link to="/register" className="font-semibold text-sky-400 hover:text-sky-300">
                                Register Property Account
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;
