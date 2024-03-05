'use strict'

const express = require('express');
const { authentication } = require('../../auth/authUtils');
const { asyncHandler } = require('../../auth/checkAuth');
const notificationController = require('../../controllers/notification.controller');

const router = express.Router();


router.get('', asyncHandler(notificationController.listNotiByUser));

module.exports = router;
