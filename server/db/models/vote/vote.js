const Sequelize = require('sequelize')
const db = require('../../db')

const Vote = db.define('vote', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  }
})

module.exports = Vote
