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
    allowNull: true,
    get() {
      if (this.getDataValue('dueDate')) {
        return new Date(this.getDataValue('dueDate')).toLocaleDateString()
      }
    }
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true
  }
})

Poll.prototype.getClubId = function() {
  return Number(this.clubId)
}

module.exports = Poll
