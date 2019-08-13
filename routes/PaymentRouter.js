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

router.get(
	'/income/',
	JWT.JWTverify,
	PaymentController.processFetchPaymentDataIncomeAccount
);

router.get(
	'/expend/',
	JWT.JWTverify,
	PaymentController.processFetchPaymentDataExpendAccount
);

module.exports = router;
