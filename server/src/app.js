const express = require('express');
const cors = require('cors');
const morgan  = require('morgan');
const path = require("path");

const api = require('./routes/api');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) =>{

    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use('/v1', api);

module.exports = app;