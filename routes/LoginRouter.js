const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/LoginController');

router.post(
	'/processAccountLogin/',
	LoginController.processAccountLogin
);

router.get(
	'/processGetAccountLogin',
	LoginController.processGetAccountLogin
);

module.exports = router;
