const AccountHelper = require('../helpers/AccountHelper');
const ZSequelize = require('../libraries/ZSequelize');

module.exports = {
	processModifyAssignment: async function(req, res) {
		/* PARAMS */
		let accountid = req.payload.accountid;

		/* POST BODY */
		let location_name = req.body.location_name;
		let location_address = req.body.location_address;
		let district = req.body.district;
		let city = req.body.city;

		/* PARAMETER ZSequelize VOUCHER  */
		let value = {
			location_name: location_name,
            location_address: location_address,
            district: district,
            city: city
		};

		let where = {
			accountid: accountid
		};

		/* UPDATE ZSequelize VOUCHER */
		let result = await ZSequelize.updateValues(value, where, "AssignmentModel");
	
		 /* FETCTH RESULT & CONDITION & RESPONSE */
		if (result.result) {
			return res.status(200).json({
				result : result.result,
				data: {
					code: 200,
					message: "Success modify data."
				}
			});
		}else{
			return res.status(404).json({
				result : result.result,
				data: {
					code: 404,
					message: "Assignment does not exist."
				},
			});
		}
	},
}