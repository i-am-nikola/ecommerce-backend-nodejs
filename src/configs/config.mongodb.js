'use strict'

const develop = {
    app: {
        port: process.env.DEV_APP_PORT || 3000,
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 2718,
        name: process.env.DEV_DB_NAME || 'dbDev',
    }
}

const production = {
    app: {
        port: process.env.PRO_APP_PORT || 3000,
    },
    db: {
        host: process.env.PRO_DB_HOST || 'localhost',
        port: process.env.PRO_DB_PORT || 2718,
        name: process.env.PRO_DB_NAME || 'dbPro',
    }
}

const config = {develop, production}
const env = process.env.NODE_ENV || 'develop'
module.exports = config[env];