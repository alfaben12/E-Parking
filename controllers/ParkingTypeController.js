const AccountHelper = require('../helpers/AccountHelper');
const ZSequelize = require('../libraries/ZSequelize');

module.exports = {
	processGetParkingType: async function(req, res){
		/* PARAMETER ZSequelize */
		let field = ['id', 'name'];
		let where = false;
		let orderBy = [['id', 'ASC']];
		let groupBy = false;
		let model = 'ParkingTypeModel';
		
		/* FETCH ZSequelize */
		let parkingTypeData = await ZSequelize.fetch(true, field, where, orderBy, groupBy, model);

		/* SET RESPONSE */
		return res.status(200).json({
			result: parkingTypeData.result,
			data : {
				code: 200,
				message: "Successfull get parking type.",
				datas: parkingTypeData.dataValues
			}
		});
	}
}