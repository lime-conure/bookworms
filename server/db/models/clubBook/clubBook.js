const Sequelize = require('sequelize')
const db = require('../../db')

const ClubBook = db.define('clubs_books', {
  type: {
    type: Sequelize.ENUM('past', 'now', 'future'),
    allowNull: false
  }
})

module.exports = ClubBook
