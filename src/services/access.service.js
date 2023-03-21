'use strict'

const bcrypt = require('bcrypt');
const { keys } = require('lodash');
const crypto = require('node:crypto');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const shopModel = require("../models/shop.model");
const { getInfoData } = require('../utils');
const KeyTokenService = require('./keyToken.service');
const { findByEmail } = require('./shop.service');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    handleRefreshToken = async ({keyStore, user, refreshToken}) => {

        const {userId, email} = user;

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError('Something wrong happend! Please relogin')
        }

        if (keyStore.refreshToken != refreshToken) throw new AuthFailureError('Shop not registered 1!');

        const foundShop = await findByEmail({email});
        if (!foundShop) throw new AuthFailureError('Shop not registered 2!');

        // create cap token moi
        const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)

        // update token
        await keyStore.update({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // da duoc su dung de lay token moi
            }
        })

        return {
            user,
            tokens
        }
    }

    logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        return delKey
    }

    login = async ({email, password, refreshToken = null}) => {

        // 1. Check email in db
        const foundShop = await findByEmail({email});
        if (!foundShop) {
            throw new BadRequestError('Shop not registered')
        }

        // 2. Match password
        const match = bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new AuthFailureError('Authentication error')
        }

        // 3. create AT and RT and save
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');
        // 4. generate token
        const {_id: userId} = foundShop;
        const tokens = await createTokenPair({userId, email}, publicKey, privateKey)
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey, userId
        })
        // 5. get data return login
        return {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}),
            tokens
        }


    }

    signUp = async ({ name, email, password }) => {
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                throw new BadRequestError('Error: Shop already registered');
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP]
            })
            if (newShop) {
                // created privateKey, publicKey
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                // Public key cryptoGraphy Standards!
                console.log({privateKey, publicKey, newShop: newShop}); // save collection KeyStore
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    privateKey,
                    publicKey
                })

                if (!keyStore) {

                    return {
                        code: 'xxxx',
                        message: 'publicKeyString Error'
                    }
                }
                // console.log('publicKeyString :>> ', publicKeyString);

                // const publicKeyObject = crypto.createPublicKey(publicKeyString)
                // console.log('publicKeyObject :>> ', publicKeyObject);

                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                console.log('Create token success :>> ', tokens);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }
            return {
                code: 200,
                metadata: null

            }
    }
}

module.exports = new AccessService();