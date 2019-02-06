const Sequelize = require('sequelize')
const db = require('../../db')

const UserBook = db.define('users_books', {
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
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  bookId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = UserBook
