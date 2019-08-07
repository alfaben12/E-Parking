
const express = require('express');
const router = express.Router();
const AssignmentController = require('../controllers/AssignmentController');
const JWT = require('../helpers/JWT');

router.put(
    '/',
	JWT.JWTverify,
	AssignmentController.processModifyAssignment
);

module.exports = router;
