'use strict'

const config = require('../configs/config.mongodb')
console.log('zzz', config );

const mongoose = require('mongoose');
const connectString = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;
console.log('connectString', connectString);
const {countConnect} = require('../helpers/check.connect');

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }

        mongoose.connect(connectString)
        .then(() => {
            console.log('Connected Mongodb Success!', countConnect())
        })
        .catch(error => console.log(`Error Connect!`));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;