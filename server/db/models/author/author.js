const Sequelize = require('sequelize')
const db = require('../db')

const Author = db.define('author', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	bio: {
		type: Sequelize.TEXT,
		allowNull: true
	}
})