'use strict'

const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic, furniture } = require("../models/product.model");
const { findAllDraftsForShop, publishProductByShop, unPublishProductByShop, findAllPublishForShop, searchProductsByUser, findAllProducts, findProduct } = require("../models/repositories/product.repo");

// define Factory class to create product

class ProductFactory {

    static productRegistry = {}

    static registerProductType (type, classRef) {
        console.log('type 111 :>> ', type);
        console.log('classRef 111 :>> ', classRef);

        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct (type, payload) {
        console.log('typexxx :>> ', type);
        const productClass = ProductFactory.productRegistry[type];
        console.log("🚀 ~ file: product.service.xxx.js:21 ~ ProductFactory ~ createProduct ~ productClass:", productClass)
        if (!productClass) throw new BadRequestError(`Invalid product Types ${type}`)
        return new productClass(payload).createProduct();
    }

    static async updateProduct (productId) {
       
    }

    static async publishProductByShop({product_shop, product_id}) {
        return await publishProductByShop({product_shop, product_id});
    }

    static async unPublishProductByShop({product_shop, product_id}) {
        return await unPublishProductByShop({product_shop, product_id});
    }

    static async findAllDraftsForShop ({product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isDraft: true}
        return await findAllDraftsForShop({query, limit, skip});
    }

    static async findAllPublishForShop ({product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isPublished: true}
        return await findAllPublishForShop({query, limit, skip});
    }

    static async searchProducts ({keySearch}) {
        return await searchProductsByUser({keySearch})
    }

    static async findAllProducts ({limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}}) {
        return await findAllProducts({limit, sort, filter, page,
            select: ['product_name', 'product_price', 'product_thumb']
        })
    }

    static async findProduct ({product_id}) {
        return await findProduct({product_id, unSelect: ['__v', 'product_variations']})
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
        const newClothing = await clothing.create(this.product_attributes);
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
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronic) throw BadRequestError('Create new electronic error');

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw BadRequestError('Create new product error');
        return newProduct;
    }
}

class Furniture extends Product {

    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newFurniture) throw BadRequestError('Create new furniture error');

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw BadRequestError('Create new product error');
        return newProduct;
    }
}

ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);


module.exports = ProductFactory;

