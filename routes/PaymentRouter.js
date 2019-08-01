const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const JWT = require('../helpers/JWT');

router.post(
    '/processPaymentParking/',
	JWT.JWTverify,
	PaymentController.processPaymentParking
);

router.get(
    '/processFetchPaymentDatas/',
	JWT.JWTverify,
	PaymentController.processFetchPaymentDatas
);

module.exports = router;
