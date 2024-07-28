const mongoose = require('mongoose');


const MONGO_URL = 'mongodb+srv://nasa-api:FFIgKXgFBzbv9lfI@nasacluster.typk6kb.mongodb.net/?retryWrites=true&w=majority&appName=NasaCluster';

mongoose.connection.once('open', ()=>{
    console.log('connection Established bbg');
});

mongoose.connection.on('error', (err)=>{
    console.log(err);
});



async function mongoConnect()
{
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect()
{
    await mongoose.disconnect();
}

module.exports = 
{
    mongoConnect,
    mongoDisconnect,
};