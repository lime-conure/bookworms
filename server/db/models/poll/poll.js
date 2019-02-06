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
    type: Sequelize.DATE
  },
  notes: {
    type: Sequelize.TEXT
  },
  creatorId: {
    type: Sequelize.INTEGER
  },
  autoGenerateMeeting: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

Poll.prototype.getClubId = function() {
  return Number(this.clubId)
}

module.exports = Poll
