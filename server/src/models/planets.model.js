const fs = require('fs');
const path = require('path');
const parse = require('csv-parse');

const habitablePlanets = require('./planets.mongo');

const planets = [];

function isHabitablePlanet(planet)
{
    return planet['koi_disposition'] === 'CONFIRMED' && 
        planet['koi_insol']>0.36 &&
        planet['koi_insol']<1.11 &&
        planet['koi_prad']<1.6;
}

function loadPlanetsData()
{
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'planet_data.csv'))
        .pipe(parse.parse({
            comment: '#', 
            columns: true,
        }))
        .on('data', async (data)=> 
        {
            if(isHabitablePlanet(data))
            {
                savePlanet(data);
            }
        })
        .on('err', (err) =>
        {
            console.log(err);
            reject(err);
        })
        .on('end', async ()=>
        {
            const numberOfPlanets = (await getAllPlanets()).length;
            console.log(`${numberOfPlanets}  planets found !!`);
            resolve();
        });
    });
}

async function savePlanet(planet)
{
    return await habitablePlanets.updateOne(
        {
            keplerName: planet.kepler_name,
        },
        {
            keplerName: planet.kepler_name,
        },
        {
            upsert: true,
        },
    )
}

async function getAllPlanets()
{
    return await habitablePlanets.find({}, 
        {
            '_id': 0, '__v': 0,
        });
}

module.exports = 
{
    loadPlanetsData,
    getAllPlanets,
};