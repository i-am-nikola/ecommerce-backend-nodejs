'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required
const { default: slugify } = require('slugify');
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name: {
        type: String,
        trim: true,
    },
    product_thumb: {
        type: String,
        unique: true,
    },
    product_description: String,
    product_slug: String,
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronic', 'Clothing' , 'Furniture']
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be low 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// create index for search

productSchema.index({product_name: 'text', product_description: 'text'})


// Document middleware run before .save() and .create()
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, {lower: true});
    next();
})

// define the product type = clothing

const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    timestamps: true,
    collection: 'Clothes'
})

// define the product type = electronic

const electronicSchema = new Schema({
    manufacturer: { // nha may san xuat
        type: String,
        required: true
    },
    model: String,
    color: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    timestamps: true,
    collection: 'Electronics'
})

const furnitureSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    timestamps: true,
    collection: 'Furnitures'
})

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model('Electronic', electronicSchema),
    clothing: model('Clothing', clothingSchema),
    furniture: model('Furniture', furnitureSchema),
};