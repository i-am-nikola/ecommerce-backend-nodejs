'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';
// Declare the Schema of the Mongo model
var inventorySchema = new Schema({
    invent_productId: {
        type: Schema.Types.ObjectId,
        ref:'Product'
    },
    invent_location: {
        type: String,
        default: 'unKnow'
    },
    invent_stock: { // So luong ton kho
        type: Number,
        required: true,
    },
    invent_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    invent_reservations: { // Đặt hàng trước, khi user add vao gio hang thi luu du lieu vao day
        type: Array,
        default: []
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);