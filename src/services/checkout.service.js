'use strict'

const { findCartById } = require("../models/repositories/cart.repo");
const {
    BadRequestError
} = require('../core/error.response');
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const order= require("../models/order.model");

class CheckoutService {
    static async checkoutReview ({cartId, userId, shop_order_ids}) {
        const foundCart = await findCartById(cartId);
        if (!foundCart) throw new BadRequestError('Cart does not exists')

        const checkout_order ={
            totalPrice: 0, // tong tien hang
            freeShop: 0, // phi van chuyen
            totalDiscount: 0, //tong tien giam gia
            totalCheckout:0, // tong thanh toan
        }
        const shop_order_ids_new = [];
        // tinh tong tien bill

        for (let i = 0; i < shop_order_ids.length; i++) {
            const{shopId, shop_discounts = [], item_products = []} = shop_order_ids[i];
            // check product available
            const checkProductServer = await checkProductByServer(item_products);
            console.log({checkProductServer});
            if (!checkProductServer) throw new BadRequestError('order wrong!!!');
            // tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0);

            //tong tien truoc khi xu ly
            checkout_order.totalPrice =+ checkoutPrice;

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // neu shop_discounts ton tai > 0, check xem co hop le hay khong
            if (shop_discounts.length > 0) {
                // gia su co mot discount
                // get amount discount
                const {totalPrice = 0, discount = 0} = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer

                })

                // tong cong discount giam gia
                checkout_order.totalDiscount += discount

                // neu tien giam gia > 0
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }

                // tong thanh toan cuoi cung

                checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
                shop_order_ids_new.push(itemCheckout)

            }

        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByOrder ({shop_order_ids, cartId, userId, user_address = {}, user_payment = {}}) {
        const{shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids: shop_order_ids
        });

        // check xem co vuot ton kho hay khong
        const products = shop_order_ids_new.flatMap(order => order.item_products);
        console.log({product});
        const acquireProduct = [];
        for (let i = 0; index < products.length; index++) {
            const {productId, quantity} = products[i]
            const keyLock = await acquireLock({productId, quantity, cartId})
            acquireProduct.push(keyLock ? true : false);
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }
        // check neu co 1 san pham het hang trong kho
        if (acquireLock.includes(false)) {
            throw new BadRequestError('Mot so san pham da duoc cap nhat, vui long quay lai gio hang')
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        });

        // neu insert thanh cong thi remove product co trong gio hang
        if (newOrder) {
            // remove product in my cart

        }


        return newOrder

    }

    static async getOrderByUser() {

    }

    static async getOneOrderByUser() {

    }

    static async cancelOrderByUser() {

    }

    static async updateOrderStatusByShop() {

    }
}

module.exports = CheckoutService;