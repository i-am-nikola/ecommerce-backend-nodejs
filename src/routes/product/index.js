'use strict'

const express = require('express');
const { authentication } = require('../../auth/authUtils');
const { asyncHandler } = require('../../auth/checkAuth');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProducts));
router.get('', asyncHandler(productController.findAllProducts));
router.get('/:product_id', asyncHandler(productController.findProduct));



router.use(authentication);
// authentication
router.post('/', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct));

router.post('/publish/:id', asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop));

// QUERY
router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop));
router.get('/published/all', asyncHandler(productController.getAllPublishForShop));




module.exports = router;