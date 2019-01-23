const Sequelize = require('sequelize')
const db = require('../../db')

const Media = db.define('media', {
  url: {
    type: Sequelize.STRING,
    allowNull: false
  },
  altText: {
    type: Sequelize.STRING,
    allowNull: false
  }
})
module.exports = Media
