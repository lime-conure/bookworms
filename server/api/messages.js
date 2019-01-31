const router = require('express').Router()
const {Club, User, Message} = require('../db/models')

module.exports = router

//GET /api/messages
router.get('/', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const clubs = await req.user.getClubs()
      const clubsMessages = await Promise.all(
        clubs.map(club =>
          Message.findAll({
            where: {
              clubId: club.id
            },
            include: [{all: true}]
          })
        )
      )
      const merged = [].concat.apply([], clubsMessages)
      res.send(merged)
    }
  } catch (err) {
    next(err)
  }
})
