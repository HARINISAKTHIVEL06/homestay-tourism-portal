import React from 'react';
import { Shield, Building2, Phone, Mail, FileText, CheckCircle } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Building2 className="w-6 h-6 text-sky-400" />
                            <span className="font-bold text-white text-lg font-outfit">Tourism Department</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Official portal for state homestay registration, safety certification, and standardized star quality ratings under State Tourism Guidelines.
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium bg-emerald-950/50 border border-emerald-800/50 p-2 rounded-lg w-fit">
                            <Shield className="w-4 h-4" />
                            <span>Government Certified Platform</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-outfit">Quick Navigation</h4>
                        <ul className="space-y-2 text-xs">
                            <li><a href="/search" className="hover:text-sky-400 transition-colors">Search Homestays</a></li>
                            <li><a href="/verify-certificate" className="hover:text-sky-400 transition-colors">Verify Certificate</a></li>
                            <li><a href="/register" className="hover:text-sky-400 transition-colors">Register Your Homestay</a></li>
                            <li><a href="/login" className="hover:text-sky-400 transition-colors">Officer & Inspector Portal</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-outfit">Guidelines & Rules</h4>
                        <ul className="space-y-2 text-xs">
                            <li><span className="hover:text-sky-400 cursor-pointer">Homestay Registration Policy 2026</span></li>
                            <li><span className="hover:text-sky-400 cursor-pointer">Quality Star Rating Framework</span></li>
                            <li><span className="hover:text-sky-400 cursor-pointer">Safety & Fire NOC Mandates</span></li>
                            <li><span className="hover:text-sky-400 cursor-pointer">Grievance & Public Redressal</span></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-outfit">Helpdesk & Support</h4>
                        <ul className="space-y-3 text-xs">
                            <li className="flex items-center space-x-2 text-slate-300">
                                <Phone className="w-4 h-4 text-sky-400" />
                                <span>Toll Free: 1800-123-TOURISM</span>
                            </li>
                            <li className="flex items-center space-x-2 text-slate-300">
                                <Mail className="w-4 h-4 text-sky-400" />
                                <span>homestays@tourism.gov.in</span>
                            </li>
                            <li className="flex items-start space-x-2 text-slate-400 text-[11px] pt-2">
                                <FileText className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                                <span>Tourism Department Secretariat, State Capital HQ</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} State Tourism Department. All Rights Reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
                        <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
                        <span className="hover:text-slate-400 cursor-pointer">Disclaimer</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
