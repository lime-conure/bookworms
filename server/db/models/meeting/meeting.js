const Sequelize = require('sequelize')
const db = require('../../db')

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
    allowNull: false,
    validate: {
      notEmpty: true
    },
    get() {
      return new Date(this.getDataValue('date')).toLocaleDateString()
    }
  },
  creatorId: {
    type: Sequelize.INTEGER
  }
})

module.exports = Meeting
