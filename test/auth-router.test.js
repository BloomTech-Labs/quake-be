const req = require('supertest')
const db = require('../data/dbConfig')
const server = require('../server')
const Users = require('../auth/auth-model')


beforeEach(async () => {

    await db('user').truncate();
});
jest.setTimeout(1000 * 8);
//#region  -- AUTH ROUTES --
describe('/auth/register ==> can register a user', () => {

    it('will return 201 on a successful register', async () => {

        const mock_user = {
            username: 'IronMan',
            password: 'IAmIronMan'
        }
        //try and register a user
        const res = await req(server).post('/auth/register').send(mock_user)
        //expect the status to be { 201 created }
        expect(res.status).toEqual(201)
    })
    it('will give confirm on succesful register of user', async () => {

        const mock_user = {
            username: 'IronMan',
            password: 'IAmIronMan'
        }
        //try and register a user
        const res = await req(server).post('/auth/register').send(mock_user)
        //expect the body of the response to be a confirm messege
        expect(res.body).toEqual({ messege: 'User Created Succesfully!' })
    })

})
describe('auth/login  ==> can login a user!', () => {


    it('will return 200 on a successful login', async () => {

        const mock_user = {
            username: 'IronMan',
            password: 'IAmIronMan'
        }
        //FIRST:: try and register a user
        let res = await req(server).post('/auth/register').send(mock_user)
        //expect the status to be { 201 created }
        expect(res.status).toEqual(201)
        //THEN:: try and login a user
        const mock_login = {
            username: 'IronMan',
            password: 'IAmIronMan'
        }
        res = await req(server).post('/auth/login').send(mock_login)
        //expect the status to be { 200 created }
        expect(res.status).toEqual(200)
    })
    it('will give a token on successful login', async () => {

        const mock_user = {
            username: 'IronMan',
            password: 'IAmIronMan'
        }
        //FIRST:: try and register a user
        let res = await req(server).post('/auth/register').send(mock_user)
        //expect the status to be { 201 created }
        expect(res.status).toBe(201)
        //THEN:: try and login a user
        const mock_login = {
            username: 'IronMan',
            password: 'IAmIronMan'
        }
        res = await req(server).post('/auth/login').send(mock_login)
        //a token is EXPECTED on the req.body
        const token = res.body.token
        //the token should be longer than 10 characters..
        expect(token.length).toBeGreaterThan(10)
    })

})