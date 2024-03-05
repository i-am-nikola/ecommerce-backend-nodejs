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

// test pub.sub redis
require('./test/inventory.test')
const productTest = require('./test/product.test')
productTest.purchaseProduct('product:001', 10)


// init db
require('./dbs/init.mongodb')
// checkOverload();

// init routers
app.use('', require('./routes'))

//handling error

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error!'

    });
})



module.exports = app;