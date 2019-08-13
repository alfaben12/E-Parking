const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const AccountModel = require('../models/AccountModel');
const ParkingTypeModel = require('../models/ParkingTypeModel');
const dotenv = require('dotenv');
dotenv.config();

const PaymentParking = sequelize.define(
	'payment_parking',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		parking_typeid: {
			type: Sequelize.INTEGER,
		},
        from_accountid: {
			type: Sequelize.INTEGER,
		},
		to_accountid: {
			type: Sequelize.INTEGER
        },
        nominal: {
			type: Sequelize.INTEGER
		},
		vehicle_registration: {
			type: Sequelize.TEXT
		},
		location_detail: {
			type: Sequelize.TEXT
		},
		createdAt: {
			type: 'TIMESTAMP',
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull: false
		},
		updatedAt: {
			type: 'TIMESTAMP',
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull: false
		}
	},
	{
		timestamps: process.env.TIMESTAMPS, // true = ketambahan 2 kolom create_at & update_at (AUTO) klo false tidak ketambahan
		freezeTableName: true // true = nama table asli , false = nama table ketambahan 's' diakhir
	}
);

AccountModel.hasMany(PaymentParking);
PaymentParking.belongsTo(AccountModel, { as: 'sender', foreignKey: 'from_accountid'});
PaymentParking.belongsTo(AccountModel, { as: 'receiver', foreignKey: 'to_accountid'});
PaymentParking.belongsTo(ParkingTypeModel, { as: 'parking_type', foreignKey: 'parking_typeid'});

module.exports = PaymentParking;
