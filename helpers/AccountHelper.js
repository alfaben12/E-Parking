const ZSequelize = require('../libraries/ZSequelize');

exports.getAccount = async function(accountid) {
	let field = ['id','balance', 'full_name', 'email', 'createdAt'];
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
		]
	];
	let result = await ZSequelize.fetchJoins(false, field, where, orderBy, groupBy, model, joins);
	return result;
};