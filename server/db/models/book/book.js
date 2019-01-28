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
    allowNull: true
  },
  pubDate: {
    type: Sequelize.STRING,
    allowNull: true
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true
  },
  smallImageUrl: {
    type: Sequelize.STRING,
    allowNull: true
  },
  // pageNum: {
  //   type: Sequelize.INTEGER,
  //   allowNull: true
  // },
  // amazonUrl: {
  //   type: Sequelize.STRING,
  //   allowNull: false
  // },
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
