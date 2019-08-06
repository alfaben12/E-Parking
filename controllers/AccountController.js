const AccountHelper = require('../helpers/AccountHelper');
const ZSequelize = require('../libraries/ZSequelize');

module.exports = {
	processFetchAccountDatas: async function(req, res) {
		/* PARAMETER ZSequelize VOUCHER  */
		let accountid = req.payload.accountid;

		/* FETCH ZSequelize VOUCHER */
		let account_result = await AccountHelper.getAccount(accountid);
		
		/* FETCTH RESULT & CONDITION & RESPONSE */
		if (account_result.result) {
			return res.status(200).json({
				result : account_result.result,
				data: {
					code: 200,
					message: "Success fetch data.",
					datas: account_result.dataValues
				}
			});
		}else{
			return res.status(404).json({
				result : account_result.result,
				data:{
					code: 404,
					message: "Data does not exist ."
				},
			});
		}
	},

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