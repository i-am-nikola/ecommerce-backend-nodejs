'use strict'

const { Types } = require('mongoose');
const { product, electronic, clothing, furniture } = require('../product.model');
const { getSelectData, unGetSelectData } = require('../../utils');

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({query, limit, skip})
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({query, limit, skip})
}

const publishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)

    })

    if (!foundShop) return null;
    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const {modifiedCount} = await foundShop.update(foundShop);
    return modifiedCount;
}

const unPublishProductByShop = async({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)

    })

    if (!foundShop) return null;
    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const {modifiedCount} = await foundShop.update(foundShop);
    return modifiedCount;
}

const findAllProducts = async ({limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1};
    const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

    return products;
}

const findProduct = async({product_id, unSelect}) => {
    console.log("🚀 ~ file: product.repo.js:57 ~ findProduct ~ usSelect:", unGetSelectData(unSelect))
    const result = await product.findById(product_id)
    .select(unGetSelectData(unSelect));

    return result;
}

const queryProduct = async ({query, limit, skip}) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const searchProductsByUser = async ({keySearch}) => {
    const regexSearch = new RegExp(keySearch);

    const results = await product.find({
        isPublished: true,
        $text: {$search: regexSearch},
    }, {score: {$meta: 'textScore'}})
    .sort({score: {$meta: 'textScore'}})
    .lean()
    return results;
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductsByUser,
    findAllProducts,
    findProduct,
}

