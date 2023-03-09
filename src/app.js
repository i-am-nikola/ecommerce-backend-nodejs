require('dotenv').config();
const express = require('express');
const { default: helmet } = require('helmet');
const app = express();
const morgan = require('morgan');
const compression = require('compression');
const { checkOverload } = require('./helpers/check.connect');

// init middleware
app.use(morgan('dev'));
// app.use(morgan('combined'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extends: true
}));

// init db
require('./dbs/init.mongodb')
// checkOverload();

// init routers
app.use('', require('./routes'))

//handling error



module.exports = app;