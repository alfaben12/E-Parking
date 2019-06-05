const jwt = require('jsonwebtoken');
const moment = require('moment');

exports.JWTsign = function(accountid) {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{
				accountid: accountid,
				generate_at: moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
			},
			'OpenProjectParkir',
			function(err, token) {
				resolve(token);
				reject('Error');
			}
		);
	});
};

exports.JWTverify = function(req, res, next) {
	const token = req.body.jwtToken;
	if (token) {
		jwt.verify(token, 'OpenProjectParkir', function(err, payload) {
			if (err) {
				res.json({
					result: false,
					message: 'Invalid Signature.'
				});
			} else {
				req.payload = payload;
				next();
			}
		});
	} else {
		res.json({
			result: false,
			message: 'Invalid Signature.'
		});
	}
};