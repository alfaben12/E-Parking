const express = require('express');
const router = express.Router();
const RegisterController = require('../controllers/RegisterController');

router.post(
	'/processAccountRegister/',
	RegisterController.processAccountRegister
);

module.exports = router;
