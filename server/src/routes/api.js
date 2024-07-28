const express = require('express');

const api = new express.Router();

const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.routers');

api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);

module.exports = api;