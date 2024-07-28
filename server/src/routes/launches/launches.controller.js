const { getAllLaunches, 
        addNewlaunch,
        checkLaunchExist,
        abortLaunchWithId } = require('../../models/launches.models');

const { getPagination } = require('../../util/query');

async function httpGetAllLaunches(req, res)
{
    const { limitVal, skipVal } = getPagination(req.query);
    return res.status(200).json(await getAllLaunches(limitVal, skipVal));
}

async function httpAddNewLaunch(req, res)
{
    const launch = req.body;

    if(!launch.mission || !launch.rocket || !launch.target || !launch.launchDate)
    {
        return res.status(400).json({
            error: "Data bnt a7ba msh mawgoda",
        });
    }
    
    launch.launchDate = new Date(launch.launchDate);
    if(isNaN(launch.launchDate))
    {
        return res.status(400).json({
            error: "el Date invalid w ta3ban",
        });
    }
            
    await addNewlaunch(launch);
    return res.status(201).json(launch);
}
        
async function httpAbortLaunch(req, res)
{
    let launchId = Number(req.params.id);
    
    // launch does not exist
    const existLaunch =  await checkLaunchExist(launchId);
    if(!existLaunch)
    {
        return res.status(404).json({
            error: "Invalid launch ID",
        });
    }
    else
    {
        const aborted = await abortLaunchWithId(launchId);
        return res.status(200).json(aborted);
    }
}
    
module.exports = 
{
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}