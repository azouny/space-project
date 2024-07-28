require('dotenv').config();

const request = require('supertest');
const app = require('../../app');
const { mongoConnect,
        mongoDisconnect 
        } = require('../../util/mongo');

const {loadPlanetsData} = require('../../models/planets.model/loadPlanetsData');

describe('Launches API', ()=>
{
    beforeAll(async ()=> 
    {
        await loadPlanetsData();
        await mongoConnect();  
    });

    afterAll(async ()=>
    {
        await mongoDisconnect();
    });

    describe('Test GET /v1/launches', ()=>
    {
        test('It should respond with 200 success', async ()=> 
        {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/) 
                .expect(200);
        });
    });
    
    describe('Test POST /v1/launches', ()=>
    {
        const testLaunchData =
        {
            mission: "be3sa azouneya kolaha test with jest",
            rocket: "lucky-13",
            target: "Kepler-442 b",
            launchDate: "July 15, 2050",
        };
    
        const testLaunchDataWODate = 
        {
            mission: "be3sa azouneya kolaha test with jest",
            rocket: "lucky-13",
            target: "Kepler-442 b",
        };
    
        const testLaunchDataWInvalidDate =
        {
            mission: "be3sa azouneya kolaha test with jest",
            rocket: "lucky-13",
            target: "Kepler-442 b",
            launchDate: "haw haw haw",
        };
    
    
        test('It should respond with 201 created', async ()=>
        {
    
            const response = await request(app)
                .post('/v1/launches')
                .send(testLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
    
            expect(response.body).toMatchObject(testLaunchDataWODate);
    
            const requestDate = new Date(testLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            
            expect(responseDate).toBe(requestDate);
        });
    
        test('It should catch missing required properties', async ()=>
        {
            const response = await request(app)
                .post('/v1/launches')
                .send(testLaunchDataWODate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual(
                {
                    error: "Data bnt a7ba msh mawgoda",
                });
        });
    
        test('It should catch Invalid dates', async ()=>
        {
                const response = await request(app)
                .post('/v1/launches')
                .send(testLaunchDataWInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual(
                {
                    error: "el Date invalid w ta3ban",
                });
        });
    });
});

