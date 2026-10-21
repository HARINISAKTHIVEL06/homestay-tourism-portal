import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
    en: {
        // Nav
        navHome: 'Home',
        navCertified: 'Certified Homestays',
        navVerify: 'Verify Certificate',
        navPreAudit: 'AI Pre-Audit Advisor',
        navGisExplorer: 'State GIS Map',
        navGrievance: 'Grievance Redressal',
        navAdminPortal: 'Admin Portal',
        navDashboard: 'My Dashboard',
        navRegisterHomestay: 'Register Homestay',
        navInspectionQueue: 'Inspection Queue',
        navSignIn: 'Sign In',
        navRegisterProperty: 'Register Property',
        navSignOut: 'Sign Out',
        officialPortal: 'State Tourism Dept Official Portal',
        portalSubtitle: 'Homestay Quality Rating & Registration',

        // Common
        district: 'District',
        starRating: 'Star Rating',
        allDistricts: 'All State Districts',
        search: 'Search',
        loading: 'Loading...',
        viewDetails: 'View Details',
        verified: 'Officially Verified',
        ecoCertified: 'Eco-Certified Green Stay',

        // Pre-Audit
        preAuditTitle: 'AI Homestay Quality & Star-Rating Pre-Audit Advisor',
        preAuditSubtitle: 'Simulate your official State Tourism inspection score before applying. Get instant gap analysis, regulatory warnings, and actionable recommendations.',
        predictedRating: 'Predicted Quality Tier',
        complianceScore: 'Compliance Score',
        inspectionReadiness: 'Field Inspection Readiness',
        safetyPillar: 'Safety, Fire & Hygiene (30%)',
        infraPillar: 'Infrastructure & Amenities (25%)',
        hospitalityPillar: 'Cultural Immersion & Hospitality (20%)',
        ecoPillar: 'Sustainability & Green Practices (15%)',
        locationPillar: 'Location & Road Access (10%)',
        printAuditReport: 'Download Pre-Audit Summary',
        proceedRegistration: 'Apply for Official Registration',

        // GIS Explorer
        gisTitle: 'Interactive State GIS Tourism Explorer',
        gisSubtitle: 'Spatial planning, certified homestay geo-locations, and district tourism density indicators.',
        touristMode: 'Tourist Discovery View',
        heatmapMode: 'Over-Tourism & Eco-Subsidy Heatmap',
        districtSummary: 'District Density Index',

        // Verify
        verifyTitle: 'Verify Official Homestay Certificate',
        verifySubtitle: 'Scan the certificate QR code or enter the official Registration Number to verify validity against the State Registry.',
        cameraScanner: 'Scan QR with Camera',
        uploadQr: 'Upload QR Image',
        tamperProofSeal: 'Tamper-Proof Cryptographic State Seal',
        sha256Hash: 'SHA-256 Digital Signature',
        reportFraud: 'Report Counterfeit Certificate',

        // Grievance
        grievanceTitle: 'Public Grievance Redressal & SLA Tracking',
        fileGrievanceTab: 'File New Complaint',
        trackGrievanceTab: 'Track Existing Grievance',
        ticketIdPlaceholder: 'Enter Ticket ID (e.g. GRV-2026-10492)...',
        trackStatusBtn: 'Track Grievance Status',
        slaTarget: 'Resolution SLA Target',
        grievanceTimeline: 'Department Action Timeline',
    },
    hi: {
        // Nav
        navHome: 'होम',
        navCertified: 'प्रमाणित होमस्टे',
        navVerify: 'प्रमाणपत्र सत्यापन',
        navPreAudit: 'एआई पूर्व-निरीक्षण सलाहकार',
        navGisExplorer: 'राज्य जीआईएस मानचित्र',
        navGrievance: 'शिकायत निवारण',
        navAdminPortal: 'प्रशासन पोर्टल',
        navDashboard: 'मेरा डैशबोर्ड',
        navRegisterHomestay: 'होमस्टे पंजीकृत करें',
        navInspectionQueue: 'निरीक्षण कतार',
        navSignIn: 'साइन इन करें',
        navRegisterProperty: 'संपत्ति पंजीकरण',
        navSignOut: 'साइन आउट',
        officialPortal: 'राज्य पर्यटन विभाग आधिकारिक पोर्टल',
        portalSubtitle: 'होमस्टे गुणवत्ता रेटिंग एवं पंजीकरण प्रबंधन',

        // Common
        district: 'जिला',
        starRating: 'स्टार रेटिंग',
        allDistricts: 'सभी राज्य जिले',
        search: 'खोजें',
        loading: 'लोड हो रहा है...',
        viewDetails: 'विवरण देखें',
        verified: 'आधिकारिक रूप से सत्यापित',
        ecoCertified: 'इको-प्रमाणित हरित होमस्टे',

        // Pre-Audit
        preAuditTitle: 'एआई होमस्टे गुणवत्ता एवं स्टार रेटिंग पूर्व-निरीक्षण सलाहकार',
        preAuditSubtitle: 'आधिकारिक राज्य पर्यटन निरीक्षण से पूर्व अपने स्कोर का अनुकरण करें। वास्तविक समय कमियों की जांच और सुधार संबंधी सुझाव प्राप्त करें।',
        predictedRating: 'अनुमानित गुणवत्ता श्रेणी',
        complianceScore: 'अनुपालन स्कोर',
        inspectionReadiness: 'क्षेत्रीय निरीक्षण तत्परता',
        safetyPillar: 'सुरक्षा, अग्निशमन एवं स्वच्छता (30%)',
        infraPillar: 'बुनियादी ढांचा एवं सुविधाएं (25%)',
        hospitalityPillar: 'सांस्कृतिक आतिथ्य एवं सेवाएं (20%)',
        ecoPillar: 'पर्यावरण एवं हरित सतत अभ्यास (15%)',
        locationPillar: 'स्थान एवं सड़क पहुंच (10%)',
        printAuditReport: 'पूर्व-निरीक्षण रिपोर्ट डाउनलोड करें',
        proceedRegistration: 'पंजीकरण हेतु आगे बढ़ें',

        // GIS Explorer
        gisTitle: 'इंटरैक्टिव राज्य जीआईएस पर्यटन मानचित्र',
        gisSubtitle: 'स्थानिक योजना, प्रमाणित होमस्टे भौगोलिक स्थिति एवं जिला पर्यटन घनत्व संकेतक।',
        touristMode: 'पर्यटक खोज दृश्य',
        heatmapMode: 'अति-पर्यटन एवं इको-सब्सिडी हीटमैप',
        districtSummary: 'जिला घनत्व सूचकांक',

        // Verify
        verifyTitle: 'आधिकारिक होमस्टे प्रमाणपत्र सत्यापित करें',
        verifySubtitle: 'प्रमाणपत्र क्यूआर कोड स्कैन करें या राज्य रजिस्ट्री में वैधता जांचने हेतु पंजीकरण संख्या दर्ज करें।',
        cameraScanner: 'कैमरा से क्यूआर स्कैन करें',
        uploadQr: 'क्यूआर छवि अपलोड करें',
        tamperProofSeal: 'छेड़छाड़-रोधी क्रिप्टोग्राफिक राज्य सील',
        sha256Hash: 'SHA-256 डिजिटल हस्ताक्षर',
        reportFraud: 'फर्जी प्रमाणपत्र की शिकायत करें',

        // Grievance
        grievanceTitle: 'सार्वजनिक शिकायत निवारण एवं एसएलए ट्रैकिंग',
        fileGrievanceTab: 'नई शिकायत दर्ज करें',
        trackGrievanceTab: 'शिकायत की स्थिति ट्रैक करें',
        ticketIdPlaceholder: 'टिकट आईडी दर्ज करें (उदा. GRV-2026-10492)...',
        trackStatusBtn: 'स्थिति ट्रैक करें',
        slaTarget: 'निवारण एसएलए लक्ष्य',
        grievanceTimeline: 'विभागीय कार्रवाई समयरेखा',
    },
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('homestay_portal_lang') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('homestay_portal_lang', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
    };

    const t = (key) => {
        return translations[language]?.[key] || translations['en']?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
