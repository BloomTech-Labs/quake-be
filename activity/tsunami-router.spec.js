const request = require('supertest');
const server = require('../server');

describe('GET /tsunami/splash', () => {
    // result code
    it('should return 200', () => {
        return request(server).get('/api/tsunami/splash')
        .then(res => {
            expect(res.status).toBe(200);
        });
    })
    it('should return JSON type', async () => {
        const res = await request(server).get('/api/tsunami/splash');
        expect(res.type).toBe('application/json')
    })

})

