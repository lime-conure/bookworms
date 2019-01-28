const Sequelize = require('sequelize')
const db = require('../../db')

const Author = db.define('author', {
  goodReadsId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  bio: {
    type: Sequelize.TEXT,
    allowNull: true
  }
})

module.exports = Author
