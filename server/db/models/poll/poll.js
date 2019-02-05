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
    get() {
      if (this.getDataValue('dueDate')) {
        return new Date(this.getDataValue('dueDate')).toISOString()
      }
    }
  },
  notes: {
    type: Sequelize.TEXT
  },
  creatorId: {
    type: Sequelize.INTEGER
  }
})

Poll.prototype.getClubId = function() {
  return Number(this.clubId)
}

module.exports = Poll
