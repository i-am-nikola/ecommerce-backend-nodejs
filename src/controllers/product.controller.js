'use strict'

const productService = require("../services/product.service");
const productServiceV2 = require("../services/product.service.xxx");

const {SuccessResponse} = require("../core/success.response")

class ProductController {
    createProduct = async (req, res, next) => {
        console.log("🚀 ~ file: product.controller.js:9 ~ ProductController ~ createProduct= ~ req:", req.body)

        // new SuccessResponse({
        //     message: 'Create new product success!',
        //     metadata: await productService.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userId
        //     })
        // }).send(res)

        new SuccessResponse({
            message: 'Create new product success!',
            metadata: await productServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
}

module.exports = new ProductController();