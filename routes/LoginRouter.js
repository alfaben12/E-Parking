const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/LoginController');

router.post(
	'/processAccountLogin/',
	LoginController.processAccountLogin
);

module.exports = router;
