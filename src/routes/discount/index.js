'use strict'

const express = require('express');
const { authentication } = require('../../auth/authUtils');
const { asyncHandler } = require('../../auth/checkAuth');
const discountController = require('../../controllers/discount.controller');

const router = express.Router();

// get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProduct))


router.use(authentication);

router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodes))

module.exports = router;
