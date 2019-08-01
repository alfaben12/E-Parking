const AccountHelper = require('../helpers/AccountHelper');
const ZSequelize = require('../libraries/ZSequelize');
const AccountModel = require('../models/AccountModel');
const PaymentModel = require('../models/PaymentModel');

module.exports = {
	processPaymentParking: async function(req, res) {
        /* GLOBAL PARAMETER */
        let nominal = 2000;
		/* PARAMETER ZSequelize SENDER  */
		let sender_accountid = req.payload.accountid;

		/* FETCH ZSequelize SENDER */
		let sender_account_result = await AccountHelper.getAccount(sender_accountid);
		let sender_account_balance = sender_account_result.dataValues.balance;

        if (sender_account_balance < nominal) {
            return res.status(200).json({
				result : false,
				data:{
					code: 200,
					message: "Saldo kurang."
				},
			});
        }

		/* PARAMETER ZSequelize RECEIVER  */
		let receiver_accountid = req.body.receiverid;

		/* FETCH ZSequelize RECEIVER */
		let receiver_account_result = await AccountHelper.getAccount(receiver_accountid);
		let receiver_account_balance = receiver_account_result.dataValues.balance;

        /* PARAMETER ZSequelize PAYMENT  */
		let payment_value = {
			from_accountid: sender_accountid,
			to_accountid: receiver_accountid,
            nominal: nominal
		};

		/* INSERT ZSequelize PAYMENT */
        let voucher_result = await ZSequelize.insertValues(payment_value, "PaymentModel");
        
        /* SENDER ACCOUNT VALUE */
        let final_sender_balance = sender_account_balance - nominal;
        
        /* PARAMETER ZSequelize SENDER ACCOUNT  */
		let sender_account_value = {
			balance: final_sender_balance,
		};

		let sender_account_where = {
			id: sender_accountid
		};

		/* UPDATE ZSequelize SENDER ACCOUNT */
        let sender_payment_result = await ZSequelize.updateValues(sender_account_value, sender_account_where, "AccountModel");

        /* SENDER ACCOUNT VALUE */
        let final_receiver_balance = receiver_account_balance + nominal;

        /* PARAMETER ZSequelize RECEIVER ACCOUNT  */
		let receiver_account_value = {
			balance: final_receiver_balance,
		};

		let receiver_account_where = {
			id: receiver_accountid
		};

		/* UPDATE ZSequelize RECEIVER ACCOUNT */
        let reciver_payment_result = await ZSequelize.updateValues(receiver_account_value, receiver_account_where, "AccountModel");
        
        /* FETCTH RESULT & CONDITION & RESPONSE */
		if (sender_account_result.result) {
			return res.status(200).json({
				result : sender_account_result.result,
				data: {
					code: 200,
					message: "Success fetch data.",
					datas: sender_account_balance
				}
			});
		}else{
			return res.status(404).json({
				result : sender_account_result.result,
				data:{
					code: 404,
					message: "Data does not exist ."
				},
			});
		}
    },
    
    processFetchPaymentDatas: function(req, res) {
		// let field = ['id', 'from_accountid', 'to_accountid', 'nominal', 'createdAt'];
        // let where = false;
        // let orderBy = false;
        // let groupBy = false;
        // let model = 'PaymentModel'
        // let joins = [
        //     [
        //         {
        //             'fromModel' : 'PaymentModel',
        //             'fromKey' : 'from_accountid',
        //             'bridgeType' : 'belongsTo',
        //             'toModel' : 'AccountModel',
        //             'toKey' : 'id',
        //             'attributes' : ['id', 'full_name']
        //         }
        //     ]
        // ];
        // let payment_result = await ZSequelize.fetchJoins(true, field, where, orderBy, groupBy, model, joins);
		
		// /* FETCTH RESULT & CONDITION & RESPONSE */
		// if (payment_result.result) {
		
		// }else{
		// 	return res.status(404).json({
		// 		result : payment_result.result,
		// 		data:{
		// 			code: 404,
		// 			message: "Data does not exist ."
		// 		},
		// 	});
        // }
        
        AccountModel.hasMany(PaymentModel);
        PaymentModel.belongsTo(AccountModel, { as: 'sender', foreignKey: 'from_accountid'});
        PaymentModel.belongsTo(AccountModel, { as: 'receiver', foreignKey: 'to_accountid'});

        PaymentModel.findAll({
                attributes: ['id', 'nominal', 'createdAt'
            ],
        include: [
                { model: AccountModel, as: 'sender'},
                { model: AccountModel, as: 'receiver'},
            ]
        }).then((results) => {
            return res.status(200).json({
				result : true,
				data: {
					code: 200,
					message: "Success fetch data.",
					datas: results
				}
			});
        });
	},
}