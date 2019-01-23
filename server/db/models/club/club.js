const Sequelize = require('sequelize')
const db = require('../../db')

const Club = db.define('club', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  inviteLink: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Club
