const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema(
    {
        flightNumber:
        {
            type: Number,
            required: true,
        },
        mission:
        {
            type: String,
            required: true,
        },
        rocket:
        {   
            type: String,
            required: true,
        },
        launchDate:
        {
            type: Date,
            required: true,
        },
        target:
        {
            type: String,
            required: true,
        },
        customers:
        {
            type: [String],
        },
        upcoming:
        {
            type: Boolean,
            required: true,
            default: true,
        },
        success:
        {
            type: Boolean,
            required: true,
            default: true,
        },
    }
);


// mongoose will map Launch to a collection named launches
module.exports = mongoose.model('Launch', launchesSchema);