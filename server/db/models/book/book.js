const Sequelize = require('sequelize')
const db = require('../../db')

const Book = db.define('book', {
  goodReadsId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  pubDate: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pageNum: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  amazonUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  //allowNull -? if the book just came up and does not have a rating yet.
  rating: {
    type: Sequelize.INTEGER,
    validate: {
      min: 0,
      max: 500
    }
  }
})

module.exports = Book
