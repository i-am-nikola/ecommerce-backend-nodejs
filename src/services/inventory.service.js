'use strict'

const { BadRequestError } = require('../core/error.response');
const inventory = require('../models/inventory.model')
const { getProductById } = require('../models/repositories/product.repo')

class InventoryService {

    static async addStockToInventory({stock, productId, shopId, location= '134 Tran Phu, HCM city'}) {
        const product = await getProductById(productId);
        if (!product) throw new BadRequestError('The product does not exists');

        const query = {
            invent_shopId:shopId,
            invent_productId: productId,
        }
        const updateSet = {
            $inc: {
                invent_stock: stock
            },
            $set: {
                invent_location: location
            }
        }
        const option = {upsert: true, new: true}

        return await inventory.findByIdAndUpdate(query, updateSet, option);
    }

}

module.exports = InventoryService;
