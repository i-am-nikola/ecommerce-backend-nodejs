'use strict'

const productService = require("../services/product.service");
const productServiceV2 = require("../services/product.service.xxx");

const {SuccessResponse} = require("../core/success.response")

class ProductController {
    createProduct = async (req, res, next) => {
        console.log("🚀 ~ file: product.controller.js:9 ~ ProductController ~ createProduct= ~ req:", req.body)
        new SuccessResponse({
            message: 'Create new product success!',
            metadata: await productServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    updateProduct = async (req, res, next) => {

        new SuccessResponse({
            message: 'Update new product success!',
            metadata: await productServiceV2.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish product success!',
            metadata: await productServiceV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'unPublish product success!',
            metadata: await productServiceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }


    // QUERY

    getAllDraftForShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft success!',
            metadata: await productServiceV2.findAllDraftsForShop ({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishForShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft success!',
            metadata: await productServiceV2.findAllPublishForShop ({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProducts = async(req, res, next) => {
        new SuccessResponse({
            message: 'getListSearchProducts success!',
            metadata: await productServiceV2.searchProducts (req.params)
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list findAllProducts success!',
            metadata: await productServiceV2.findAllProducts (req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Find product success!',
            metadata: await productServiceV2.findProduct ({
                product_id: req.params.product_id
            })
        }).send(res)
    }

    // END QUERY
}

module.exports = new ProductController();