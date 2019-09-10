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

router.post(
    '/topup/',
	JWT.JWTverify,
	PaymentController.processPaymentTopup
);

router.post(
    '/withdraw/',
	JWT.JWTverify,
	PaymentController.processPaymentWithdraw
);

router.get(
	'/gateway/:payment_gateway_typeid',
	PaymentController.processGetPaymentGateway
);

router.get(
	'/month/',
	PaymentController.processGetChartByMonth
);

router.get(
	'/month/account/',
	JWT.JWTverify,
	PaymentController.processGetChartByMonthByAccount
);

router.get(
	'/dummy/',
	PaymentController.processPaymentParkingDummy
);
module.exports = router;
