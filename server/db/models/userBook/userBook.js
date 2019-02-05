const Sequelize = require('sequelize')
const db = require('../../db')

const UserBook = db.define('users_books', {
  type: {
    type: Sequelize.ENUM('past', 'now', 'future'),
    allowNull: false
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
