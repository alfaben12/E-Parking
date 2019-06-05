const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/AccountController');

router.post(
	'/processAccountLogin/',
	AccountController.processAccountLogin
);

module.exports = router;
