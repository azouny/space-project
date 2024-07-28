const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');


const DEFAULT_FLIGHT_NUMBER = 100;

async function getAllLaunches(limitVal, skipVal)
{
    return await launches
    .find({}, {'_id': 0, '__v': 0})
    .sort({ flightNumber: 1 })
    .limit(limitVal)
    .skip(skipVal);
}

async function getLatestFlightNumber()
{
    const latestLaunch = await launches
    .findOne()
    .sort('-flightNumber');

    if(!latestLaunch)
    {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function addNewlaunch(launch)
{
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if(!planet)
    {
        throw new Error('No such planet found');
    }

    const latestFlightNumber = await getLatestFlightNumber() +1;
    
    const newLaunch = Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customers: ['ZTM', 'NASA'],
        success: true,
        upcoming: true,        
    })

    await saveLaunch(newLaunch);
}

async function saveLaunch(launch)
{
    await launches.findOneAndUpdate(
        {
            flightNumber: launch.flightNumber,
        },
        launch,
        {
            upsert: true, 
        }
    )
}


async function checkLaunchExistWithId(launchId)
{
    const launch = await findLaunch(
        {
            flightNumber: launchId,
        });
    
    return (!launch? false: true);
}

async function abortLaunchWithId(launchId)
{
    const aborted = await launches.findOneAndUpdate(
        {
            flightNumber: launchId,
        },
        {
            upcoming: false, 
            success: false,
        });


    return aborted;
}

async function populateLaunches()
{
    const SPACE_X_URL = 'https://api.spacexdata.com/v4/launches/query';

    console.log('Loading launches');

    const axiosResponse = await axios.post(SPACE_X_URL, {
        query: {},
        options: 
        {
            pagination: false,
            populate: 
            [
                {
                    path: 'rocket',
                    select: { name: 1}
                },
                {
                    path: 'payloads',
                    select: { customers: 1}
                }
            ]
        }
    });

    if(axiosResponse !== 200)
    {
        console.log('Problem with downloading launches');
        throw new Error('Problem with downloading launches');
    }


    const launchesDocs = axiosResponse.data.docs;
    for(const launchDoc of launchesDocs)
    {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) =>
        {
            return payload['customers']; 
        });

        const launch = 
        {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],   
            customers: customers,
        }

        console.log(`${launch.flightNumber}  ${launch.mission}`);


        // Saving to database
        saveLaunch(launch);
    }
}

async function loadLaunchesData()
{
    // Checking if the SpaceX flights are already added
    const firstLaunch = await findLaunch(
    {
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });
    if(firstLaunch)
    {
        console.log('Already loaded SpacX launches');
        return;
    }


    await populateLaunches();
}

async function findLaunch(filter)
{
    return await launches.findOne(filter);
}

module.exports = 
{
    getAllLaunches,
    addNewlaunch,
    checkLaunchExist: checkLaunchExistWithId,
    abortLaunchWithId,
    loadLaunchesData,
    findLaunch,
};
