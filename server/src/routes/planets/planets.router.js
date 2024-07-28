const express = require('express');

const {
    httpGetAllPlanets,
}= require('./planets.controlller');

const planetsRouter = express.Router();

planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;