const Sequelize = require('sequelize')
const db = require('../../db')

const Poll = db.define('poll', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  dueDate: {
    type: Sequelize.DATE,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true
  }
})

module.exports = Poll
