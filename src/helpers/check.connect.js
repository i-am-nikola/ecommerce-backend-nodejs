'use strict'

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECONDS = 5000;

const countConnect = () => {
    const numConnection  = mongoose.connections.length;
    console.log(`Number of connection::${numConnection}`);
}

const checkOverload = () => {
    setInterval(() => {
        const numConnection  = mongoose.connections.length;
        const numCores = os.cpus().length;
        console.log('Numer cores', numCores);
        const memoryUsage = process.memoryUsage().rss;
        const maxConnections= numCores * 5;

        console.log(`Active connection:: ${numConnection}`);
        console.log(`Memory usage:: ${memoryUsage/1024/1024}`);
        if (numConnection > maxConnections) {
            console.log(`Connection overload detected!`);
        }
    }, _SECONDS); // Monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverload
}