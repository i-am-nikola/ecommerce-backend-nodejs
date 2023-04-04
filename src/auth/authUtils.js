'use strict'

const JWT = require('jsonwebtoken');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const asyncHandler = require('../helpers/asyncHandler');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        })

        //
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err){
                console.log('error verify :>> ', err);
            } else {
                console.log('decode verify :>> ', decode);
            }
        })

        return {accessToken, refreshToken}


    } catch (error) {

    }
}

const authentication = asyncHandler(async (req, res, next) => {
    // 1. Check userId missing?
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid Request')

    // 2. get AT
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not found keyStore')

    // 3. verifyToken
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
            if (userId !== decodeUser.userId) throw AuthFailureError('Invalid userId')
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            console.log('error :>> ', error);
            throw error
        }
    }
    // const accessToken = req.headers[HEADER.AUTHORIZATION];
    // if (!accessToken) throw new AuthFailureError('Invalid Request')

    // try {
    //     const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    //     console.log("🚀 ~ file: authUtils.js:57 ~ authentication ~ decodeUser:", decodeUser)
    //     if (userId !== decodeUser.userId) throw AuthFailureError('Invalid userId')
    //     req.keyStore = keyStore;
    //     return next();
    // } catch (error) {
    //     console.log('error :>> ', error);
    //     throw error
    // }

    // 4. check user in db

    //5 . check keyStore with this userId

    //6. OK all - return next()

})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}