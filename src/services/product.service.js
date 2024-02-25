'use strict'

const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model")

// define Factory class to create product

class ProductFactory {
    static async createProduct (type, payload) {
        switch (type) {
            case 'Electronic':
                return new Electronic(payload).createProduct();
            case 'Clothing':
                return new Clothing(payload).createProduct();
            default:
                throw new BadRequestError(`Invalid product Types ${type}`)
        }
    }
}

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_type, product_shop, product_attributes, product_quantity
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
        this.product_quantity = product_quantity;
    }

    // create new product

    async createProduct (product_id) {
        return await product.create({...this, _id: product_id});
    }
}

// Define sub-class for different product type clothing

class Clothing extends Product {

    async createProduct() {
        console.log(123123, this.product_shop);
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        console.log("🚀 ~ file: product.service.js:49 ~ Clothing ~ createProduct ~ newClothing:", newClothing)
        if (!newClothing) throw BadRequestError('Create new clothing error');

        const newProduct = await super.createProduct();
        console.log("🚀 ~ file: product.service.js:53 ~ Clothing ~ createProduct ~ newProduct:", newProduct)
        if (!newProduct) throw BadRequestError('Create new product error');
        return newProduct;
    }
}

class Electronic extends Product {

    async createProduct() {
        console.log(123123444, this.product_shop);
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        console.log("🚀 ~ Electronic ~ createProduct ~ newElectronic:", newElectronic)
        if (!newElectronic) throw BadRequestError('Create new electronic error');

        const newProduct = await super.createProduct(newElectronic._id);
        console.log("🚀 ~ Electronic ~ createProduct ~ newProduct:", newProduct)
        if (!newProduct) throw BadRequestError('Create new product error');
        return newProduct;
    }
}

module.exports = ProductFactory;

