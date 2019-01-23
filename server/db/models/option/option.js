const Sequelize = require('sequelize')
const db = require('../db')

const Option = db.define('option', {
  type: {
    type: Sequelize.ENUM('book', 'time', 'location', 'custom'),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  dateTime: {
    type: Sequelize.DATE,
    allowNull: true
  },
  location: {
    type: Sequelize.TEXT,
    allowNull: true
  }
})

module.exports = Option
