const Sequelzie = require('sequelize')
const db = require('../db')

const Club = db.define('club', {
	name: {
		type: Sequelzie.STRING,
		allowNull: false
	},
	inviteLink: {
		type: Sequelzie.STRING,
		allowNull: false
	}
})

module.exports = Club