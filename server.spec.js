const request = require('supertest');
const server = require('./server.js');

describe('GET /', () => {
    // result code
    it('should return 200', () => {
        return request(server).get('/')
        .then(res => {
            expect(res.status).toBe(201);
        });
    })
    it('should return JSON type', async () => {
        const res = await request(server).get('/');
        expect(res.type).toBe('application/json')
    })

})
