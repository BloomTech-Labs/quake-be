const request = require('supertest');
const server = require('../server');

describe('GET /refresh/refresh', () => {
    // result code
    it('should return 200', () => {
        return request(server).get('/api/refresh/refresh')
        .then(res => {
            expect(res.status).toBe(200);
        });
    })
    it('should return JSON type', async () => {
        const res = await request(server).get('/api/refresh/refresh');
        expect(res.type).toBe('application/json')
    })

})

