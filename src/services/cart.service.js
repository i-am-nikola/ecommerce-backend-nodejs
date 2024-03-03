'use strict';

const { NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

/**
 * 1. add product to cart [user]
 * 2. reduce product quantity by one [user]
 * 3. increase product quantity by one [user]
 * 4. get carts [user]
 * 5. delete carts [user]
 * 6. delete cart item [user]
 */

class CartService {

    /// START REPO CART ///
    static async createUserCart({userId, product}) {
        const query = {cart_userId: userId, cart_status: 'active'}
        const updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }
        const options = {upsert: true, new: true}

        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({userId, product}) {
        const{productId, quantity} = product;
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_status: 'active',
        }

        const updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }
        const options = {upsert: true, new: true}

        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    /// END REPO CART ///


    static async addToCart({userId, product = {}}) {
        // check cart is exists
        const userCart = await cart.findOne({
            cart_userId: userId
        });
        console.log(11111111, {product});
        // return
        if (!userCart) {
            // create new cart
            return await CartService.createUserCart({userId, product})
        }

        // neu co gio hang roi nhung chua co san pham
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save();
        }

        // new gio hang ton tai va co san pham thi update quantity
        return await CartService.updateUserCartQuantity({userId, product})
    }

    // update cart

    static async addToCartV2({userId, shop_order_ids}) {
        const {productId, quantity, old_quantity} = shop_order_ids[0]?.item_products[0];

        // check product is exists
        const foundProduct = await getProductById(productId);
        if (!foundProduct) throw new NotFoundError('Product not exists')
        if (foundProduct.product_shop.toString() != shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product do not belong to the shop')
        }
        if (quantity === 0) {
            // delete
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart ({userId, productId}) {
        const query = {cart_userId: userId, cart_status: 'active'}
        const updateSet = {
            $pull: {
                cart_products:{
                    productId
                }
            }
        }

        const deleteCart = await cart.updateOne(query, updateSet);
        return deleteCart;
    }

    static async getListUserCart({userId}) {
        return await cart.findOne({
            cart_userId: +userId,
        }).lean();
    }
}

module.exports = CartService;