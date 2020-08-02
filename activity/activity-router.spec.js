const request = require('supertest');
const server = require('../server');

describe('GET /first-load', () => {
    // result code
    it('should return 200', () => {
        return request(server).get('/api/activity/first-load')
        .then(res => {
            expect(res.status).toBe(200);
        });
    })
    it('should return JSON type', async () => {
        const res = await request(server).get('/api/activity/first-load');
        expect(res.type).toBe('application/json')
    })

})

describe('GET /alltime-biggest', () => {
    // result code
    it('should return 200', () => {
        return request(server).get('/api/activity/alltime-biggest')
        .then(res => {
            expect(res.status).toBe(200);
        });
    })
    it('should return JSON type', async () => {
        const res = await request(server).get('/api/activity/alltime-biggest');
        expect(res.type).toBe('application/json')
    })

})