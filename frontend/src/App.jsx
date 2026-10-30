import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import HomestayDetailPage from './pages/HomestayDetailPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import GrievancePage from './pages/GrievancePage';
import PreAuditAdvisorPage from './pages/PreAuditAdvisorPage';
import GisExplorerPage from './pages/GisExplorerPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OwnerDashboard from './pages/OwnerDashboard';
import RegistrationFormPage from './pages/RegistrationFormPage';
import ReviewApplicationsPage from './pages/ReviewApplicationsPage';
import InspectorQueuePage from './pages/InspectorQueuePage';
import InspectionFormPage from './pages/InspectionFormPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <LanguageProvider>
                <Router>
                    <div className="flex flex-col min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-sky-500 selection:text-white">
                        <Navbar />
                        <main className="flex-grow">
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/search" element={<SearchPage />} />
                                <Route path="/homestay/:id" element={<HomestayDetailPage />} />
                                <Route path="/verify-certificate" element={<VerifyCertificatePage />} />
                                <Route path="/grievance" element={<GrievancePage />} />
                                <Route path="/pre-audit" element={<PreAuditAdvisorPage />} />
                                <Route path="/explorer" element={<GisExplorerPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />

                                {/* Owner Routes */}
                                <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
                                    <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                                    <Route path="/owner/homestays/new" element={<RegistrationFormPage />} />
                                    <Route path="/owner/homestays/edit/:id" element={<RegistrationFormPage />} />
                                </Route>

                                {/* District Officer & Super Admin Routes */}
                                <Route element={<ProtectedRoute allowedRoles={['superadmin', 'districtadmin']} />}>
                                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                                    <Route path="/officer/applications" element={<ReviewApplicationsPage />} />
                                </Route>

                                {/* Inspector Routes */}
                                <Route element={<ProtectedRoute allowedRoles={['inspector']} />}>
                                    <Route path="/inspector/assignments" element={<InspectorQueuePage />} />
                                    <Route path="/inspector/evaluate/:id" element={<InspectionFormPage />} />
                                    <Route path="/inspector/inspect/:id" element={<InspectionFormPage />} />
                                </Route>

                                {/* Fallback */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </Router>
            </LanguageProvider>
        </AuthProvider>
    );
}

export default App;
