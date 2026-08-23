const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Homestay = require('./models/Homestay');
const RatingCriteria = require('./models/RatingCriteria');
const Grievance = require('./models/Grievance');
const connectDB = require('./config/db');

dotenv.config();

const DEFAULT_CRITERIA = [
    { category: 'Safety & Hygiene', weightPercent: 30, description: 'CCTV, fire extinguishers, first aid kit, clean bedding, sanitized bathrooms' },
    { category: 'Infrastructure & Amenities', weightPercent: 25, description: 'Room size, ventilation, power backup, Wi-Fi, hot water, parking' },
    { category: 'Guest Services & Hospitality', weightPercent: 20, description: 'Traditional welcome, local cuisine, tour guidance, emergency support' },
    { category: 'Sustainability Practices', weightPercent: 15, description: 'Solar energy, rainwater harvesting, plastic-free policy, waste segregation' },
    { category: 'Location & Accessibility', weightPercent: 10, description: 'All-weather road access, scenic view, proximity to tourist spots' },
];

const seedData = async () => {
    try {
        await connectDB();

        console.log('Clearing existing database collections...');
        await User.deleteMany({});
        await Homestay.deleteMany({});
        await RatingCriteria.deleteMany({});
        await Grievance.deleteMany({});

        console.log('Creating System Users...');
        const superAdmin = await User.create({
            name: 'State Tourism Admin',
            email: 'admin@tourism.gov.in',
            passwordHash: 'Admin@123',
            role: 'superadmin',
            phone: '+91 99000 11100',
        });

        const districtOfficer = await User.create({
            name: 'District Tourism Officer',
            email: 'officer@tourism.gov.in',
            passwordHash: 'Officer@123',
            role: 'districtadmin',
            district: 'Central District',
            phone: '+91 99000 22200',
        });

        // Also seed alias email matching alternative preset format
        await User.create({
            name: 'District Tourism Officer',
            email: 'district.officer@tourism.gov.in',
            passwordHash: 'Officer@123',
            role: 'districtadmin',
            district: 'Central District',
            phone: '+91 99000 22201',
        });

        const inspector = await User.create({
            name: 'John Inspector',
            email: 'inspector@tourism.gov.in',
            passwordHash: 'Inspector@123',
            role: 'inspector',
            district: 'Central District',
            phone: '+91 99000 33300',
        });

        await User.create({
            name: 'John Inspector',
            email: 'inspector.green@tourism.gov.in',
            passwordHash: 'Inspector@123',
            role: 'inspector',
            district: 'Central District',
            phone: '+91 99000 33301',
        });

        const owner = await User.create({
            name: 'Rajesh Sharma',
            email: 'owner@gmail.com',
            passwordHash: 'Owner@123',
            role: 'owner',
            phone: '+91 98765 43210',
        });

        await User.create({
            name: 'Rajesh Sharma',
            email: 'owner@hillsstay.com',
            passwordHash: 'Owner@123',
            role: 'owner',
            phone: '+91 98765 43211',
        });

        console.log('Creating Default Rating Criteria...');
        await RatingCriteria.insertMany(DEFAULT_CRITERIA);

        console.log('Creating Sample Homestays...');
        const homestay1 = await Homestay.create({
            owner: owner._id,
            propertyName: 'Pine Valley Heritage Homestay',
            description: 'Nested in scenic pine forests, featuring traditional architectural woodwork, authentic home-cooked meals, and organic gardens.',
            address: '12 Forest Hill Road, Pine Village',
            district: 'Central District',
            taluk: 'Central Taluk',
            contactPhone: '+91 98765 43210',
            contactEmail: 'pinevalley@homestay.com',
            status: 'approved',
            registrationNumber: 'STATE-CEN-2026-1001',
            currentRating: 5,
            certificateIssuedAt: new Date(),
            certificateValidTill: new Date(Date.now() + 2 * 365 * 86400000),
            assignedInspector: inspector._id,
            rooms: [
                { roomType: 'Double', count: 3, maxOccupancy: 2, tariff: 3500 },
                { roomType: 'Suite', count: 1, maxOccupancy: 4, tariff: 6000 },
            ],
            amenities: ['Wi-Fi', 'Hot Water', 'Home-cooked Meals', 'Parking', 'Fire Safety Extinguisher', 'First Aid Kit'],
            photos: [
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
            ],
            documents: [
                { docType: 'ID Proof', fileUrl: 'https://example.com/id.pdf', isVerified: true },
                { docType: 'Property Ownership / Lease', fileUrl: 'https://example.com/property.pdf', isVerified: true },
            ],
        });

        const homestay2 = await Homestay.create({
            owner: owner._id,
            propertyName: 'Coastal Palms Beach Retreat',
            description: 'Serene beachside homestay with coconut grove views, fresh seafood dining, and water sport assistance.',
            address: '44 Beach View Avenue',
            district: 'South Beach District',
            taluk: 'Coastal Taluk',
            contactPhone: '+91 98765 88888',
            contactEmail: 'coastalpalms@homestay.com',
            status: 'approved',
            registrationNumber: 'STATE-SOU-2026-1002',
            currentRating: 4,
            certificateIssuedAt: new Date(),
            certificateValidTill: new Date(Date.now() + 2 * 365 * 86400000),
            rooms: [
                { roomType: 'Double', count: 4, maxOccupancy: 2, tariff: 2800 },
            ],
            amenities: ['Wi-Fi', 'Hot Water', 'Home-cooked Meals', 'Parking'],
            photos: [
                'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
            ],
        });

        const homestay3 = await Homestay.create({
            owner: owner._id,
            propertyName: 'Mountain Mist Eco Stay',
            description: 'Panoramic mountain views with solar powered amenities.',
            address: '77 Summit Peak',
            district: 'Central District',
            taluk: 'Central Taluk',
            contactPhone: '+91 98765 43210',
            contactEmail: 'mountainmist@homestay.com',
            status: 'submitted',
            rooms: [
                { roomType: 'Family Room', count: 2, maxOccupancy: 4, tariff: 4000 },
            ],
            amenities: ['Wi-Fi', 'Power Backup', 'Eco-friendly / Solar'],
            photos: [
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
            ],
        });

        const homestay4 = await Homestay.create({
            owner: owner._id,
            propertyName: 'Backwater Heritage Villa',
            description: 'Experience tranquil canal views, traditional wooden houseboats, organic banana leaf meals, and authentic Ayurvedic wellness.',
            address: '15 Lagoon Waterway Road',
            district: 'South District',
            taluk: 'Lakeside Taluk',
            contactPhone: '+91 98989 12345',
            contactEmail: 'backwater@heritagehomestay.org',
            status: 'approved',
            registrationNumber: 'STATE-SOU-2026-1003',
            currentRating: 5,
            certificateIssuedAt: new Date(),
            certificateValidTill: new Date(Date.now() + 2 * 365 * 86400000),
            assignedInspector: inspector._id,
            rooms: [
                { roomType: 'Suite', count: 2, maxOccupancy: 3, tariff: 4500 },
                { roomType: 'Traditional Cottage', count: 2, maxOccupancy: 2, tariff: 5500 },
            ],
            amenities: ['Wi-Fi', 'Hot Water', 'Home-cooked Meals', 'Parking', 'CCTV', 'Fire Safety Extinguisher', 'First Aid Kit', 'Eco-friendly / Solar'],
            photos: [
                'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
            ],
            documents: [
                { docType: 'ID Proof', fileUrl: 'https://example.com/id.pdf', isVerified: true },
                { docType: 'Fire Safety Certificate', fileUrl: 'https://example.com/fire.pdf', isVerified: true },
            ],
        });

        const homestay5 = await Homestay.create({
            owner: owner._id,
            propertyName: 'High Range Tea Estate Manor',
            description: 'Colonial style bungalow amid lush tea gardens. Offers guided tea plantation walks, campfire evenings, and homemade pastries.',
            address: '88 Estate Ridge Road',
            district: 'North Hill District',
            taluk: 'Highland Taluk',
            contactPhone: '+91 94444 55555',
            contactEmail: 'teaestate@manorstay.in',
            status: 'approved',
            registrationNumber: 'STATE-NOR-2026-1004',
            currentRating: 5,
            certificateIssuedAt: new Date(),
            certificateValidTill: new Date(Date.now() + 2 * 365 * 86400000),
            assignedInspector: inspector._id,
            rooms: [
                { roomType: 'Suite', count: 3, maxOccupancy: 2, tariff: 5000 },
            ],
            amenities: ['Wi-Fi', 'Hot Water', 'Home-cooked Meals', 'Fireplace', 'Parking', 'Fire Safety Extinguisher'],
            photos: [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
            ],
        });

        const homestay6 = await Homestay.create({
            owner: owner._id,
            propertyName: 'Royal Heritage Fort Stay',
            description: 'Restored 18th-century courtyard fort homestay offering royal cultural experiences, folk dance evenings, and rooftop dining.',
            address: '01 Palace Fort Square',
            district: 'West District',
            taluk: 'Heritage Taluk',
            contactPhone: '+91 97777 88888',
            contactEmail: 'royalfort@heritage.gov.in',
            status: 'approved',
            registrationNumber: 'STATE-WES-2026-1005',
            currentRating: 4,
            certificateIssuedAt: new Date(),
            certificateValidTill: new Date(Date.now() + 2 * 365 * 86400000),
            rooms: [
                { roomType: 'Double', count: 4, maxOccupancy: 2, tariff: 3800 },
            ],
            amenities: ['Wi-Fi', 'Hot Water', 'Home-cooked Meals', 'Parking', 'Cultural Shows'],
            photos: [
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
            ],
        });

        console.log('Creating Sample Grievance...');
        await Grievance.create({
            homestay: homestay1._id,
            submittedBy: {
                name: 'Anita Verma',
                email: 'anita.v@example.com',
                phone: '+91 91111 22222',
                isPublic: true,
            },
            subject: 'Inquiry regarding dinner menu timing',
            description: 'Overall pleasant stay, request to extend dinner service till 10 PM.',
            status: 'resolved',
            resolutionNote: 'Host briefed and agreed to extend dining hours.',
        });

        console.log('====================================================');
        console.log('DATABASE SEEDED SUCCESSFULLY!');
        console.log('Default Credentials:');
        console.log('1. Super Admin: admin@tourism.gov.in / Admin@123');
        console.log('2. District Officer: officer@tourism.gov.in / Officer@123');
        console.log('3. Inspector: inspector@tourism.gov.in / Inspector@123');
        console.log('4. Owner: owner@gmail.com / Owner@123');
        console.log('====================================================');

        if (require.main === module) {
            process.exit(0);
        }
    } catch (error) {
        console.error('Database Seed Error:', error);
        if (require.main === module) {
            process.exit(1);
        }
    }
};

if (require.main === module) {
    seedData();
}

module.exports = seedData;
