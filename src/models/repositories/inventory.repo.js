const { convertToObjectIdMongodb } = require("../../utils");
const inventory = require("../inventory.model")

const {Types} = require('mongoose');

const insertInventory = async ({productId, shopId, stock, location = 'unKnow'}) => {
    return await inventory.create({
        invent_productId: productId,
        invent_shopId: shopId,
        invent_stock: stock,
        invent_location: location,
    })
}

const reservationInventory = async ({productId, quantity, cartId}) => {
    const query = {
        invent_productId: convertToObjectIdMongodb(productId),
        invent_stock: {$gte: quantity}
    }
    const updateSet ={
        $inc: {
            invent_stock: -quantity
        },
        $push: {
            invent_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }
    const options = {upsert: true, new: true}

    return await inventory.updateOne(query, updateSet)
}

module.exports = {
    insertInventory,
    reservationInventory
}