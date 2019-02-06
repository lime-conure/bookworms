const Sequelize = require('sequelize')
const db = require('../../db')

const ClubBook = db.define('clubs_books', {
  type: {
    type: Sequelize.ENUM('past', 'now', 'future'),
    allowNull: false
  },
  startTime: {
    type: Sequelize.DATE,
    allowNull: true
  },
  endTime: {
    type: Sequelize.DATE,
    allowNull: true
  },
  clubId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  bookId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = ClubBook
