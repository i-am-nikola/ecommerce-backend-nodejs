'use strict'

const accessService = require("../services/access.service");
const {OK, CREATED, SuccessResponse} = require("../core/success.response")

class AccessController {


    handleRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get token success!',
            metadata: await accessService.handleRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }

    logout = async (req, res, next) => {
        console.log('req123 :>> ', req);
        new SuccessResponse({
            message: 'Logout success!',
            metadata: await accessService.logout(req.keyStore)
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await accessService.login(req.body)
        }).send(res)
    }

    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered OK!',
            metadata: await accessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)
    }
}

module.exports = new AccessController();