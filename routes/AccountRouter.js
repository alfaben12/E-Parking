const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/AccountController');
const JWT = require('../helpers/JWT');

router.get(
	'/',
	JWT.JWTverify,
	AccountController.processFetchAccountDatas
);

router.get(
	'/parkirs/',
	JWT.JWTverify,
	AccountController.processFetchAccountDataParking
);

module.exports = router;
