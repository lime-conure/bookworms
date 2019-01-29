const Sequelize = require('sequelize')
const db = require('../../db')

const Club = db.define('club', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  inviteLink: {
    type: Sequelize.STRING,
    allowNull: true
  }
  // }, {
  //   hooks: {
  //     afterCreate: (club) => {
  //   const hash = Math.floor(Math.random * 1000000)
  //   club.inviteLink = `http://localhost:8080/clubs/${club.id}/join/${hash}`
  // }}
})
Club.afterCreate(club => {
  console.log('after create')
  const hash = Math.floor(Math.random() * 1000000)
  console.log(hash, 'hash')
  club.inviteLink = `http://localhost:8080/clubs/${club.id}/join/${hash}`
  console.log(club.inviteLink, 'club')
  console.log(club)
})
// /: clubId/join/: hash

module.exports = Club
