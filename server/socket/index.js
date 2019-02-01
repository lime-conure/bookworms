//import {UserClub} from '../db/models'

module.exports = io => {
  io.on('connection', socket => {
    const {UserClub} = require('../db/models')
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })

    socket.on('LOGIN', async userId => {
      const clubs = await UserClub.findAll({where: {userId}})
      console.log(`LOGIN: Clubs for user ${userId}:`, clubs)
      clubs.forEach(club => socket.join(`${club.id}`))
    })

    socket.on('LOGOUT', async userId => {
      console.log('LOGOUT:', userId)
      const clubs = await UserClub.findAll({where: {userId}})
      console.log(`LOGOUT: Clubs for user ${userId}:`, clubs)
      clubs.forEach(club => socket.leave(`${club.id}`))
    })

    socket.on('JOIN', clubId => {
      socket.join(clubId)
    })

    socket.on('NEW_MESSAGE', message => {
      console.log('server gets a new message', message)
      socket.broadcast.in(`${message.clubId}`).emit('NEW_MESSAGE', message)
    })
  })
}
