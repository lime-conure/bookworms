//import {UserClub} from '../db/models'

module.exports = io => {
  io.on('connection', socket => {
    const {UserClub} = require('../db/models')
    const {Club} = require('../db/models')
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })

    socket.on('LOGIN', async userId => {
      const clubs = await UserClub.findAll({where: {userId}})
      clubs.forEach(club => {
        socket.join(`${club.clubId}`)
      })
    })

    socket.on('LOGOUT', async userId => {
      const clubs = await UserClub.findAll({where: {userId}})
      clubs.forEach(club => {
        socket.leave(`${club.clubId}`)
      })
    })

    socket.on('JOIN', clubId => {
      console.log('socket JOINed clubroom ', clubId)
      socket.join(`${clubId}`)
    })

    socket.on('NEW_MESSAGE', async message => {
      const club = await Club.findById(message.clubId)
      socket.broadcast
        .in(`${message.clubId}`)
        .emit('NEW_MESSAGE', {message, clubName: club.name})
    })

    socket.on('NEW_THREAD', async message => {
      const club = await Club.findById(message.data.clubId)
      socket.broadcast
        .in(`${message.data.clubId}`)
        .emit('NEW_THREAD', {...message, clubName: club.name})
    })
  })
}
