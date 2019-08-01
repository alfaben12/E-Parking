const AccountModel = require('../models/AccountModel');
const AccountRoleModel = require('../models/AccountRoleModel');
const ZSequelize = require('../libraries/ZSequelize');
const JWTAuth = require('../helpers/JWT');
const Sequelize = require('sequelize');

module.exports = {
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
		let accountData = await ZSequelize.fetch(false, field, where, orderBy, groupBy, model);

		/* FETCTH RESULT & CONDITION & RESPONSE */
		if (accountData.result) {
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
			let roleData = await ZSequelize.fetch(false, field, where, orderBy, groupBy, model);

			/* SET RESPONSE */
			return res.status(200).json({
				result: accountData.result,
				data : {
					code: 200,
					message: "Successfull login.",
					datas:{
						accountData: accountData.dataValues,
						roleData: roleData.dataValues,
						jwtTokenData: jwtToken
					}
				}
			});
		}else{
			return res.status(404).json({
				result : accountData.result,
				data:{
					code: 404,
					message: "Data does not exist ."
				},
			});
		}
	},

	processGetAccountLogin: async function(req, res){
		let field = ['id', 'username', 'full_name', 'email', 'password', 'createdAt'];
		let where = false;
		let orderBy = false;
		let groupBy = false;
		let model = 'AccountModel'
		let joins = [
			[
				{
					'fromModel' : 'AccountModel',
					'fromKey' : 'roleid',
					'bridgeType' : 'belongsTo',
					'toModel' : 'AccountRoleModel',
					'toKey' : 'id',
					'attributes' : ['id', 'name']
				}
			]
		];
		let account = await ZSequelize.fetchJoins(true, field, where, orderBy, groupBy, model, joins);

		/* SET RESPONSE */
		return res.status(200).json({
			result: account.result,
			data : {
				code: 200,
				message: "Successfull fetch data.",
				datas: account.dataValues
			}
		});
	}
}