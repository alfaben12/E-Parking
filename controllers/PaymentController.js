const AccountHelper = require('../helpers/AccountHelper');
const ZSequelize = require('../libraries/ZSequelize');
const AccountModel = require('../models/AccountModel');
const ParkingTypeModel = require('../models/ParkingTypeModel');
const PaymentParkingModel = require('../models/PaymentParkingModel');
const GlobalHelper = require('../helpers/GlobalHelper');
const Sequelize = require('sequelize');

module.exports = {
	processPaymentParking: async function(req, res) {
        /* GLOBAL PARAMETER */
		let parking_typeid = req.body.parking_typeid;
		let vehicle_registration = req.body.vehicle_registration;
		let payment_number = await GlobalHelper.generateUUID();
		let nominal = 0;

		if(parking_typeid == 1){
			nominal = 2000;
		}else if(parking_typeid == 2){
			nominal = 3000;
		}else if(parking_typeid == 3){
			nominal = 5000;
		}else if(parking_typeid == 4){
			nominal = 10000;
		}else{
			nominal = 2000;
		}

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

		if(sender_accountid == receiver_accountid){
			return res.status(200).json({
				result : false,
				data:{
					code: 200,
					message: "Can't transfer to this account."
				},
			});
		}

		/* FETCH ZSequelize RECEIVER */
		let receiver_account_result = await AccountHelper.getAccount(receiver_accountid);
		let receiver_account_balance = receiver_account_result.dataValues.balance;
		let location_detail = receiver_account_result.dataValues.assignment.location_name +", "+ receiver_account_result.dataValues.assignment.location_address +", "+ receiver_account_result.dataValues.assignment.district +", "+ receiver_account_result.dataValues.assignment.city +".";

		/* PARAMETER ZSequelize PAYMENT  */
		let payment_value = {
			from_accountid: sender_accountid,
			to_accountid: receiver_accountid,
			payment_number:payment_number,
			location_detail: location_detail,
			nominal: nominal,
			parking_typeid:parking_typeid,
			vehicle_registration:vehicle_registration
		};

		/* INSERT ZSequelize PAYMENT */
        let payment_result = await ZSequelize.insertValues(payment_value, "PaymentParkingModel");
        
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
					datas: sender_account_balance - nominal
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
	
	processPaymentTopup: async function(req, res) {
		/* GLOBAL PARAMETER */
		let payment_gateway = req.body.payment_gateway;
		let payment_gatewayid = 0;
		
		if( payment_gateway == "OVO"){
			payment_gatewayid = 1;
		}else if( payment_gateway == "Link"){
			payment_gatewayid = 2;
		}else if( payment_gateway == "BNI"){
			payment_gatewayid = 3;
		}else if( payment_gateway == "MANDIRI"){
			payment_gatewayid = 4;
		}else if( payment_gateway == "BCA"){
			payment_gatewayid = 5;
		}else if( payment_gateway == "BRI"){
			payment_gatewayid = 6;
		}else if( payment_gateway == "Alfamart"){
			payment_gatewayid = 7;
		}else if( payment_gateway == "Indomart"){
			payment_gatewayid = 8;
		}else if( payment_gateway == "Paypal"){
			payment_gatewayid = 9;
		}else{
			return res.status(400).json({
				result : false,
				data:{
					code: 400,
					message: "Invalid payment gateway."
				},
			});
		}

		let payment_number = await GlobalHelper.generateUUID();
		let nominal = parseInt(req.body.nominal, 10)
		let status = "PAID";

		/* PARAMETER ZSequelize VOUCHER  */
		let accountid = req.payload.accountid;

		/* FETCH ZSequelize ACCOUNT */
		let account_data = await AccountHelper.getAccount(accountid);

		/* ACCOUNT VALUE */
		let account_balance = account_data.dataValues.balance + nominal;

		/* PARAMETER ZSequelize PAYMENT  */
		let payment_value = {
			payment_gatewayid: payment_gatewayid,
			accountid: accountid,
			payment_number:payment_number,
			nominal: nominal,
			status: status
		};

		/* INSERT ZSequelize PAYMENT */
        let payment_result = await ZSequelize.insertValues(payment_value, "PaymentTopupModel");
        
        /* PARAMETER ZSequelize ACCOUNT  */
		let account_value = {
			balance: account_balance,
		};

		let account_where = {
			id: accountid
		};

		/* UPDATE ZSequelize ACCOUNT */
        let account_result = await ZSequelize.updateValues(account_value, account_where, "AccountModel");
        
        /* FETCTH RESULT & CONDITION & RESPONSE */
		if (account_result.result) {
			return res.status(200).json({
				result : account_result.result,
				data: {
					code: 200,
					message: "Topup success.",
					datas: account_balance
				}
			});
		}else{
			return res.status(404).json({
				result : account_result.result,
				data:{
					code: 404,
					message: "Topup failed."
				},
			});
		}
	},
	
	processPaymentWithdraw: async function(req, res) {
		/* GLOBAL PARAMETER */
		let payment_number = await GlobalHelper.generateUUID();
		let nominal = parseInt(req.body.nominal, 10)
		let status = "PAID";

		/* PARAMETER ZSequelize VOUCHER  */
		let accountid = req.payload.accountid;

		/* FETCH ZSequelize ACCOUNT */
		let account_data = await AccountHelper.getAccount(accountid);

		/* ACCOUNT VALUE */
		let account_balance = account_data.dataValues.balance - nominal;

		if (account_data.dataValues.balance < nominal) {
			return res.status(200).json({
				result : false,
				data: {
					code: 200,
					message: "Saldo kurang."
				}
			});
		}
		/* PARAMETER ZSequelize PAYMENT  */
		let payment_value = {
			accountid: accountid,
			payment_number:payment_number,
			nominal: nominal,
			status: status
		};

		/* INSERT ZSequelize PAYMENT */
        let payment_result = await ZSequelize.insertValues(payment_value, "PaymentWithdrawModel");
        
        /* PARAMETER ZSequelize ACCOUNT  */
		let account_value = {
			balance: account_balance,
		};

		let account_where = {
			id: accountid
		};

		/* UPDATE ZSequelize ACCOUNT */
        let account_result = await ZSequelize.updateValues(account_value, account_where, "AccountModel");
        
        /* FETCTH RESULT & CONDITION & RESPONSE */
		if (account_result.result) {
			return res.status(200).json({
				result : account_result.result,
				data: {
					code: 200,
					message: "Withdraw success.",
					datas: account_balance
				}
			});
		}else{
			return res.status(404).json({
				result : account_result.result,
				data:{
					code: 404,
					message: "Withdraw failed."
				},
			});
		}
    },
    
    processFetchPaymentDatas: function(req, res) {
        PaymentParkingModel.findAll({
            attributes: ['id', 'nominal','location_detail', 'vehicle_registration', 'createdAt'],
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
				{
                    attributes: ['id', 'name'],
                    model: ParkingTypeModel,
                    as: 'parking_type'
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

	processFetchPaymentDataIncomeAccount: function(req, res) {
		let accountid = req.payload.accountid;

        PaymentParkingModel.findAll({
			attributes: ['id', 'nominal','location_detail', 'vehicle_registration', 'createdAt'],
			where: {
				to_accountid: accountid
			},
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
				{
                    attributes: ['id', 'name'],
                    model: ParkingTypeModel,
                    as: 'parking_type'
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

	processFetchPaymentDataExpendAccount: function(req, res) {
		let accountid = req.payload.accountid;

        PaymentParkingModel.findAll({
			attributes: ['id', 'nominal', 'location_detail', 'vehicle_registration', 'createdAt'],
			where: {
				from_accountid: accountid
			},
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
				{
                    attributes: ['id', 'name'],
                    model: ParkingTypeModel,
                    as: 'parking_type'
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

	processGetPaymentGateway: async function(req, res){
		let payment_gateway_typeid = req.params.payment_gateway_typeid;

		/* PARAMETER ZSequelize */
		let field = ['id', 'name', 'apikey', 'image', 'position'];
		let where = false;
		if(payment_gateway_typeid != 'all'){
			where = {
				payment_gateway_typeid: payment_gateway_typeid
			};
		}else{
			where = false;
		}
		
		let orderBy = [['position', 'ASC']];
		let groupBy = false;
		let model = 'PaymentGatewayModel';
		
		/* FETCH ZSequelize */
		let paymentData = await ZSequelize.fetch(true, field, where, orderBy, groupBy, model);

		/* SET RESPONSE */
		return res.status(200).json({
			result: paymentData.result,
			data : {
				code: 200,
				message: "Successfull get payment gateway.",
				datas: paymentData.dataValues
			}
		});
	},

	processGetChartByMonth: async function(req, res){
		PaymentParkingModel.findAll({
			attributes: [
				[Sequelize.literal(`SUM(nominal)`), 'total'], 
				[Sequelize.literal(`COUNT(*)`), 'total_vehicle'], 
				[Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
				[Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year']],
			group: [Sequelize.fn('MONTH', Sequelize.col('createdAt')), Sequelize.fn('YEAR', Sequelize.col('createdAt'))]
        }).then((results) => {
			let total = 0;
			let total_vehicle = 0;
			let percent_goverment= 30;
			var datas = [];
			for (let i = 0; i < results.length; i++) {
				total = total + parseInt(results[i].dataValues.total);
				total_vehicle = total_vehicle + parseInt(results[i].dataValues.total_vehicle);
				let data = {
					total: parseInt(results[i].dataValues.total),
					goverment: Math.round(parseInt(results[i].dataValues.total) / 100 * percent_goverment),
					total_vehicle: parseInt(results[i].dataValues.total_vehicle),
					month: results[i].dataValues.month,
					year: results[i].dataValues.year,
					type: "Real Data"
				}
				datas.push(data);
			}

			total = Math.round(total/results.length, 0);
			total_vehicle = Math.round(total_vehicle/results.length, 0);
			let dateObj = new Date();
			let month = dateObj.getUTCMonth() + 2; //months from 1-12
			let year = dateObj.getUTCFullYear();

			let forecasting = {
				total: total,
				goverment: Math.round(total / 100 * percent_goverment),
				total_vehicle: total_vehicle,
				month: month,
				year: year,
				type: "Forecasting Data"
			}
			datas.push(forecasting);

            res.status(200).json({
				result : true,
				data: {
					code: 200,
					message: "Success fetch data.",
					datas: datas
				}
			});
        });
	},

	processGetChartByMonthByAccount: async function(req, res){
		let accountid = req.payload.accountid;

		PaymentParkingModel.findAll({
			attributes: [
				[Sequelize.literal(`SUM(nominal)`), 'total'],
				[Sequelize.literal(`COUNT(*)`), 'total_vehicle'], 
				[Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
				[Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year']],
			where: {
				to_accountid: accountid
			},
			group: [Sequelize.fn('MONTH', Sequelize.col('createdAt')), Sequelize.fn('YEAR', Sequelize.col('createdAt'))]
        }).then((results) => {
            let total = 0;
			let total_vehicle = 0;
			let percent_goverment= 30;
			var datas = [];
			for (let i = 0; i < results.length; i++) {
				total = total + parseInt(results[i].dataValues.total);
				total_vehicle = total_vehicle + parseInt(results[i].dataValues.total_vehicle);
				let data = {
					total: parseInt(results[i].dataValues.total),
					goverment: Math.round(parseInt(results[i].dataValues.total) / 100 * percent_goverment),
					total_vehicle: parseInt(results[i].dataValues.total_vehicle),
					month: results[i].dataValues.month,
					year: results[i].dataValues.year,
					type: "Real Data"
				}
				datas.push(data);
			}

			total = Math.round(total/results.length, 0);
			total_vehicle = Math.round(total_vehicle/results.length, 0);
			let dateObj = new Date();
			let month = dateObj.getUTCMonth() + 2; //months from 1-12
			let year = dateObj.getUTCFullYear();

			let forecasting = {
				total: total,
				goverment: Math.round(total / 100 * percent_goverment),
				total_vehicle: total_vehicle,
				month: month,
				year: year,
				type: "Forecasting Data"
			}
			datas.push(forecasting);

            res.status(200).json({
				result : true,
				data: {
					code: 200,
					message: "Success fetch data.",
					datas: datas
				}
			});
        });
	},

	processPaymentParkingDummy: async function(req, res) {

		let looping_size = parseInt(req.params.size, 10);
		let month = parseInt(req.params.month, 10);
		for (let i = 0; i < looping_size; i++) {
			/* GLOBAL PARAMETER */
			let parking_typeid = Math.floor(Math.random() * 4) + 1;

			let payment_number = await GlobalHelper.generateUUID();
			let nominal = 0;

			var min = 0;
			var max = 0;

			if(parking_typeid == 1){
				nominal = 2000;
				min = 2000;
				max = 6999;
			}else if(parking_typeid == 2){
				nominal = 3000;
				min = 1;
				max = 1999;
			}else if(parking_typeid == 3){
				nominal = 5000;
				min = 7000;
				max = 7999;
			}else if(parking_typeid == 4){
				nominal = 10000;
				min = 8000;
				max = 9999;
			}else{
				nominal = 2000;
				min = 0;
				max = 0;
			}

			// and the formula is:
			let vehicle_registration_number = Math.floor(Math.random() * (max - min + 1)) + min;
			
			let vehicle_registration_text = "";

			let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		
			let vehicle_registration_number_size = Math.floor(Math.random() * 2) + 2;
			for (let i = 0; i < vehicle_registration_number_size; i++){
				vehicle_registration_text += possible.charAt(Math.floor(Math.random() * possible.length));
			}
		
			let vehicle_registration = 'N '+ vehicle_registration_number +' '+ vehicle_registration_text;

			let data = {
				parking_typeid: parking_typeid,
				nominal: nominal,
				vehicle_registration: vehicle_registration
			}

			/* PARAMETER ZSequelize SENDER  */
			const accountid_dummy = [
				4,
				15,
				16,
				17,
				18,
				19,
				20,
				21,
				22,
			];
			
			let sender_accountid = accountid_dummy[Math.floor(Math.random() * accountid_dummy.length)];

			/* PARAMETER ZSequelize RECEIVER  */
			let receiver_accountid = 1;

			if(sender_accountid == receiver_accountid){
				return res.status(200).json({
					result : false,
					data:{
						code: 200,
						message: "Can't transfer to this account."
					},
				});
			}

			/* FETCH ZSequelize RECEIVER */
			let receiver_account_result = await AccountHelper.getAccount(receiver_accountid);

			let receiver_account_balance = receiver_account_result.dataValues.balance;
			let location_detail = receiver_account_result.dataValues.assignment.location_name +", "+ receiver_account_result.dataValues.assignment.location_address +", "+ receiver_account_result.dataValues.assignment.district +", "+ receiver_account_result.dataValues.assignment.city +".";

			let date_created = Math.floor(Math.random() * (30 - 1 + 1)) + 1;

			let createdAt = '2019-'+ month +"-"+ date_created +" 02:29:28";

			/* PARAMETER ZSequelize PAYMENT  */
			let payment_value = {
				from_accountid: sender_accountid,
				to_accountid: receiver_accountid,
				payment_number:payment_number,
				location_detail: location_detail,
				nominal: nominal,
				parking_typeid:parking_typeid,
				vehicle_registration:vehicle_registration,
				createdAt: createdAt
			};

			/* INSERT ZSequelize PAYMENT */
			let payment_result = await ZSequelize.insertValues(payment_value, "PaymentParkingModel");
		
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
		}

		return res.status(200).json({
			result : true,
			data: {
				code: 200,
				message: "Payment success.",
				datas: "Added 50 dummy data payment parking."
			}
		});
	}
}