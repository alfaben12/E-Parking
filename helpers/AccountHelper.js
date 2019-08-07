const ZSequelize = require('../libraries/ZSequelize');

exports.getAccount = async function(accountid) {
	let field = ['id', 'full_name', 'email', 'balance', 'createdAt'];
	let where = {
		id: accountid
	};
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
		],
		[
			{
				'fromModel' : 'AccountModel',
				'fromKey' : 'account.id',
				'bridgeType' : 'hasOne',
				'toModel' : 'AssignmentModel',
				'toKey' : 'accountid',
				'attributes' : ['id', 'location_name', 'location_address', 'district', 'city']
			}
		]
	];
	let result = await ZSequelize.fetchJoins(false, field, where, orderBy, groupBy, model, joins);
	return result;
};