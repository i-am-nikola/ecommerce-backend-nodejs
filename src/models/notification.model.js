'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';
// Declare the Schema of the Mongo model

// ORDER-001: success
// ORDER-002: fai;
// ...
var notificationSchema = new Schema({
    noti_type: {
        type: String,
        enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
        required: true
    },
    noti_senderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    noti_receivedId: {
        type: Number,
        required: true
    },
    noti_content: {
        type: String,
        required: true
    },
    noti_options: {
        type: Object,
        default: {}
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    },
    timestamps: true
});

//Export the model
module.exports = {
    notification: model(DOCUMENT_NAME, notificationSchema)
}