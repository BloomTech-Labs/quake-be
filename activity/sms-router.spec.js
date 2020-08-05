const request = require('supertest');
const server = require('../server');

describe('GET /sms/test', () => {
    // result code
    it('should return 200', () => {
        return request(server).get('/api/sms/test')
        .then(res => {
            expect(res.status).toBe(200);
        });
    })
    it('should return JSON type', async () => {
        const res = await request(server).get('/api/sms/test');
        expect(res.type).toBe('application/json')
    })

})

