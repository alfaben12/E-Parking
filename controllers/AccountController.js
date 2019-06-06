const AccountModel = require('../models/AccountModel');
const AccountRoleModel = require('../models/AccountRoleModel');
const ZSequelize = require('../libraries/ZSequelize');
const JWTAuth = require('../helpers/JWT');
const Sequelize = require('sequelize');

module.exports = {
	index: function(req, res) {
		res.send('Login');
	},

	processAccountLogin: async function(req, res) {
		/* POST BODY */
		let username = req.body.username;
		let password = req.body.password;
		let roleid = req.body.roleid;

		/* PARAMETER ZSequelize */
		let field = ['id', 'username', 'full_name', 'email'];
		let where = {
			username: username,
			password: password,
			roleid: roleid
		  	};
		let orderBy = [['id', 'DESC']];
		let groupBy = false;
		let model = 'AccountModel';

		/* FETCH ZSequelize */
		let accountData = await ZSequelize.fetch(field, where, orderBy, groupBy, model);

		/* FETCTH RESULT & CONDITION & RESPONSE */
		if (accountData.result !== 0) {
			let accountid = accountData.dataValues.id;
			let jwtToken = await JWTAuth.JWTsign(accountid);
		
			/* PARAMETER ZSequelize */
			let field = ['id', 'name'];
			let where = {
				id: roleid
				};
			let orderBy = [['id', 'DESC']];
			let groupBy = false;
			let model = 'AccountRoleModel';

			/* FETCH ZSequelize */
			let roleData = await ZSequelize.fetch(field, where, orderBy, groupBy, model);

			res.status(200).json({
				message: 'Success GET.',
				data : {
					accountData: accountData.dataValues,
					roleData: roleData.dataValues,
					jwtTokenData: jwtToken
				}
			});
		}else{
			res.status(400).json({
				message: 'Failed GET.'
			});
		}
	}
}