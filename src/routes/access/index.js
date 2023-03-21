'use strict'

const express = require('express');
const { authentication } = require('../../auth/authUtils');
const { asyncHandler } = require('../../auth/checkAuth');
const accessController = require('../../controllers/access.controller');

const router = express.Router();


router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))


router.use(authentication);
// authentication
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))



module.exports = router;