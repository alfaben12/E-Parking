const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const JWT = require('../helpers/JWT');

router.post(
    '/',
	JWT.JWTverify,
	PaymentController.processPaymentParking
);

router.get(
    '/',
	PaymentController.processFetchPaymentDatas
);

module.exports = router;
