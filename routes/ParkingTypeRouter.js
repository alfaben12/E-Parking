const express = require('express');
const router = express.Router();
const ParkingTypeController = require('../controllers/ParkingTypeController');
const JWT = require('../helpers/JWT');

router.get(
	'/',
	ParkingTypeController.processGetParkingType
);

module.exports = router;
