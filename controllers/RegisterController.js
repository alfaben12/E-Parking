const AccountModel = require('../models/AccountModel');
const ZSequelize = require('../libraries/ZSequelize');

module.exports = {
    processAccountRegister: async function(req, res) {
		/* POST BODY */
		let acc_roleid = req.body.roleid;
        let acc_username = req.body.username;
        let acc_password = req.body.password;
        let acc_full_name = req.body.full_name;
        let acc_email = req.body.email;
        let acc_address = req.body.address;
        let acc_balance = req.body.balance;

		/* PARAMETER ZSequelize VOUCHER  */
		let acc_value = {
			roleid: acc_roleid,
            username: acc_username,
            password: acc_password,
            full_name: acc_full_name,
            email: acc_email,
            address: acc_address
		};

		/* INSERT ZSequelize VOUCHER */
		let acc_result = await ZSequelize.insertValues(acc_value, "AccountModel");
	
		 /* FETCTH RESULT & CONDITION & RESPONSE */
		 if (acc_result.result) {
			return res.status(201).json({
				result : acc_result.result,
				data: {
					code: 201,
					message: "Success create account.",
					datas: acc_result.record
				}
			});
		}else{
			return res.status(404).json({
				result : acc_result.result,
				data:{
					code: 404,
					message: "Failed create account."
				},
			});
		}
	},
}