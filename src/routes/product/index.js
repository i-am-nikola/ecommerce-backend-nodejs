'use strict'

const express = require('express');
const { authentication } = require('../../auth/authUtils');
const { asyncHandler } = require('../../auth/checkAuth');
const productController = require('../../controllers/product.controller');

const router = express.Router();
router.use(authentication);
// authentication
router.post('/', asyncHandler(productController.createProduct))



module.exports = router;