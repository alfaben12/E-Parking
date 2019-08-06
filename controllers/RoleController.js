const AccountHelper = require('../helpers/AccountHelper');
const ZSequelize = require('../libraries/ZSequelize');

module.exports = {
	processGetRoleAccount: async function(req, res){
		/* PARAMETER ZSequelize */
		let field = ['id', 'name'];
		let where = false;
		let orderBy = [['id', 'DESC']];
		let groupBy = false;
		let model = 'AccountRoleModel';
		
		/* FETCH ZSequelize */
		let roleData = await ZSequelize.fetch(true, field, where, orderBy, groupBy, model);

		/* SET RESPONSE */
		return res.status(200).json({
			result: roleData.result,
			data : {
				code: 200,
				message: "Successfull login.",
				datas: roleData.dataValues
			}
		});
	}
}