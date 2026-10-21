const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');

describe('State Tourism Homestay Portal API Tests', () => {
    let officerToken = '';
    let ownerToken = '';

    beforeAll(async () => {
        if (app.dbPromise) {
            await app.dbPromise;
        }
        if (mongoose.connection.readyState !== 1) {
            await new Promise((resolve) => {
                if (mongoose.connection.readyState === 1) return resolve();
                mongoose.connection.once('open', resolve);
            });
        }
    }, 35000);

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('1. Auth API Endpoints', () => {
        it('should login superadmin successfully', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'admin@tourism.gov.in',
                    password: 'Admin@123',
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.role).toEqual('superadmin');
            expect(res.body.data.token).toBeDefined();
        });

        it('should login district officer successfully', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'officer@tourism.gov.in',
                    password: 'Officer@123',
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.role).toEqual('districtadmin');
            officerToken = res.body.data.token;
        });

        it('should login homestay owner successfully', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'owner@gmail.com',
                    password: 'Owner@123',
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.role).toEqual('owner');
            ownerToken = res.body.data.token;
        });
    });

    describe('2. Public Homestay Directory & Verification', () => {
        it('should fetch public approved homestays', async () => {
            const res = await request(app).get('/api/v1/homestays/public');
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should verify a valid homestay registration number with digital signature hash', async () => {
            const res = await request(app).get('/api/v1/homestays/verify/STATE-CEN-2026-1001');
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.propertyName).toBeDefined();
            expect(res.body.data.digitalSignatureHash).toBeDefined();
        });

        it('should generate and download PDF certificate for an approved homestay', async () => {
            const verifyRes = await request(app).get('/api/v1/homestays/verify/STATE-CEN-2026-1001');
            const homestayId = verifyRes.body.data._id;

            const res = await request(app).get(`/api/v1/homestays/${homestayId}/certificate`);
            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toEqual('application/pdf');
        });
    });

    describe('3. Public Grievance API & SLA Tracking', () => {
        let createdTicketId = '';

        it('should allow public complaint submission with AI urgency triage', async () => {
            const res = await request(app)
                .post('/api/v1/grievances')
                .send({
                    homestayRegNumber: 'STATE-CEN-2026-1001',
                    submittedBy: {
                        name: 'Test Tourist',
                        email: 'tourist@example.com',
                        phone: '+91 98888 77777',
                    },
                    subject: 'Testing API Grievance Cleanliness',
                    description: 'Automated test grievance submission regarding hygiene standards.',
                });

            expect([200, 201]).toContain(res.statusCode);
            expect(res.body.success).toBe(true);
            expect(res.body.data.ticketId).toBeDefined();
            createdTicketId = res.body.data.ticketId;
        });

        it('should allow public tracking of grievance timeline by ticket ID', async () => {
            const ticketToTrack = createdTicketId || 'GRV-2026-10492';
            const res = await request(app).get(`/api/v1/grievances/track/${ticketToTrack}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.timeline).toBeDefined();
            expect(Array.isArray(res.body.data.timeline)).toBe(true);
        });
    });

    describe('4. Novel Differentiating Features: Pre-Audit Simulator & GIS Explorer', () => {
        it('should calculate AI pre-audit score and predicted star rating', async () => {
            const res = await request(app)
                .post('/api/v1/homestays/pre-audit')
                .send({
                    propertyName: 'Emerald Green Valley Retreat',
                    district: 'Western Ghats District',
                    hasFireExtinguisher: true,
                    hasCCTV: true,
                    hasFirstAid: true,
                    hasHostResiding: true,
                    hasSolarPower: true,
                    hasRainwaterHarvesting: true,
                    hasWasteSegregation: true,
                    hasLocalFood: true,
                    hasGuidedTours: true,
                    hasAttachedBaths: true,
                    hasWifi: true,
                    hasPowerBackup: true,
                    hasHotWater: true,
                    hasPavedRoad: true,
                    hasScenicView: true,
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.predictedStars).toBeGreaterThanOrEqual(4);
            expect(res.body.data.pillarBreakdown).toBeDefined();
            expect(res.body.data.scorePercentage).toBeGreaterThan(80);
        });

        it('should return GIS spatial data and district aggregates', async () => {
            const res = await request(app).get('/api/v1/homestays/gis-data');
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.districts).toBeDefined();
            expect(Array.isArray(res.body.homestays)).toBe(true);
        });
    });
});
