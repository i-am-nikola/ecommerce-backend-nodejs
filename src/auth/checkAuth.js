'use strict'

const { findById } = require("../services/apiKey.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        console.log('key :>> ', key);
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        // check objKey
        const objKey = await findById(key);
        console.log('objKey :>> ', objKey);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        req.objKey = objKey;
        return next();
    } catch (error) {

    }
}

const permission = (permission) => {
    return (req, res, next) => {
        console.log('res.objKey :>> ', req.objKey);
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'Permission denied'
            })
        }
        console.log('req.objKey.permissions :>> ', req.objKey.permissions);
        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message: 'Permission denied'
            })
        }
        return next();
    }
}

module.exports = {
    apiKey,
    permission,
}