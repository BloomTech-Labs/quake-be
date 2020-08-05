const request = require('supertest');
const server = require('../server');

describe('GET /nukes/boom', () => {
    // result code
    it('should return 200', () => {
        return request(server).get('/api/nukes/boom')
        .then(res => {
            expect(res.status).toBe(200);
        });
    })
    it('should return JSON type', async () => {
        const res = await request(server).get('/api/nukes/boom');
        expect(res.type).toBe('application/json')
    })

})
