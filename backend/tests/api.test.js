const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');

describe('State Tourism Homestay Portal API Tests', () => {
    let officerToken = '';
    let ownerToken = '';

    beforeAll(async () => {
        // Allow DB connection to settle if needed
    });

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

        it('should verify a valid homestay registration number', async () => {
            const res = await request(app).get('/api/v1/homestays/verify/STATE-CEN-2026-1001');
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.propertyName).toBeDefined();
        });

        it('should generate and download PDF certificate for an approved homestay', async () => {
            const verifyRes = await request(app).get('/api/v1/homestays/verify/STATE-CEN-2026-1001');
            const homestayId = verifyRes.body.data._id;

            const res = await request(app).get(`/api/v1/homestays/${homestayId}/certificate`);
            expect(res.statusCode).toEqual(200);
            expect(res.headers['content-type']).toEqual('application/pdf');
        });
    });

    describe('3. Public Grievance API', () => {
        it('should allow public complaint submission', async () => {
            const res = await request(app)
                .post('/api/v1/grievances')
                .send({
                    homestayRegNumber: 'STATE-CEN-2026-1001',
                    submittedBy: {
                        name: 'Test Tourist',
                        email: 'tourist@example.com',
                        phone: '+91 98888 77777',
                    },
                    subject: 'Testing API Grievance',
                    description: 'Automated test grievance submission.',
                });

            expect([200, 201]).toContain(res.statusCode);
            expect(res.body.success).toBe(true);
        });
    });
});
