'use strict'

const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const { createTokenPair } = require('../auth/authUtils');
const { BadRequestError } = require('../core/error.response');
const shopModel = require("../models/shop.model");
const { getInfoData } = require('../utils');
const KeyTokenService = require('./keyToken.service');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

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
                // create privateKey, publicKey
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncodeIng: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                console.log({privateKey, publicKey, newShop: newShop});

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    privateKey,
                    publicKey
                })

                if (!publicKeyString) {
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