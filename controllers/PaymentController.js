const AccountHelper = require('../helpers/AccountHelper');
const ZSequelize = require('../libraries/ZSequelize');
const AccountModel = require('../models/AccountModel');
const PaymentModel = require('../models/PaymentModel');

module.exports = {
	processPaymentParking: async function(req, res) {
        /* GLOBAL PARAMETER */
		let nominal = req.body.nominal;
		
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
		let location_detail = receiver_account_result.dataValues.assignment.location_name +", "+ receiver_account_result.dataValues.assignment.location_address +", "+ receiver_account_result.dataValues.assignment.district +", "+ receiver_account_result.dataValues.assignment.city +".";

		/* PARAMETER ZSequelize PAYMENT  */
		let payment_value = {
			from_accountid: sender_accountid,
			to_accountid: receiver_accountid,
			location_detail: location_detail,
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
					message: "Payment success.",
					datas: sender_account_balance
				}
			});
		}else{
			return res.status(404).json({
				result : sender_account_result.result,
				data:{
					code: 404,
					message: "Payment failed."
				},
			});
		}
    },
    
    processFetchPaymentDatas: function(req, res) {
        PaymentModel.findAll({
            attributes: ['id', 'nominal', 'createdAt'],
            include: [
                {
                    attributes: ['id', 'full_name', 'balance'],
                    model: AccountModel,
                    as: 'sender'
                  },
                {
                    attributes: ['id', 'full_name', 'balance'],
                    model: AccountModel,
                    as: 'receiver'
                },
            ]
        }).then((results) => {
            res.status(200).json({
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