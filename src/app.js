require('dotenv').config();
const express = require('express');
const { default: helmet } = require('helmet');
const app = express();
const morgan = require('morgan');
const compression = require('compression');
const { checkOverload } = require('./helpers/check.connect');


console.log('Process', process.env);
// init middleware
app.use(morgan('dev'));
// app.use(morgan('combined'));
app.use(helmet());
app.use(compression());

// init db
require('./dbs/init.mongodb')
checkOverload();

// init routers
app.use('', require('./routes'))

//handling error



module.exports = app;