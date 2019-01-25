const Sequelize = require('sequelize')
const db = require('../../db')

const Option = db.define('option', {
  type: {
    type: Sequelize.ENUM('book', 'time', 'location', 'custom'),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  bookName: {
    type: Sequelize.STRING,
    defaultValue: null,
    allowNull: true
  },
  dateTime: {
    type: Sequelize.DATE,
    defaultValue: null,
    allowNull: true
  },
  location: {
    type: Sequelize.STRING,
    defaultValue: null,
    allowNull: true
  }
})

module.exports = Option
