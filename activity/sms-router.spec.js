const distanceBetween = rewire('./sms-router');


const from = [-75.343, 39.984]
const to = [-75.534, 39.123]

describe('test coords', () => {
    // result code
    it('should return 97.16', () => {
       expect(distanceBetween(from,to)).toBe('97.16')
    })
})

