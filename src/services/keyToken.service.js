'use strict'

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
    static createKeyToken = async ({userId, privateKey, publicKey}) => {
        try {
            // const publicKeyString = publicKey.toString();
            const tokens = await keyTokenModel.create({
                user: userId,
                // publicKey: publicKeyString
                privateKey,
                publicKey
            })
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }
}

module.exports = KeyTokenService;