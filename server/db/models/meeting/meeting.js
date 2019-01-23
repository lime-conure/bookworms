const Sequelize = require('sequelize')
const db = require('../db')

const Meeting = db.define('meeting', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  location: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  date: {
    type: Sequelize.DATE,
    allowNull: true,
    validate: {
      notEmpty: true
    }
  }
})

module.exports = Meeting
