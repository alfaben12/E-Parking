const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');
const JWT = require('../helpers/JWT');

router.post(
	'/',
	NotificationController.sendNotification
);

module.exports = router;
