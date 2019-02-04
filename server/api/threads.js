const router = require('express').Router()
const {Club, User, Message, Thread} = require('../db/models')

module.exports = router

//GET /api/threads
router.get('/', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const clubs = await req.user.getClubs()
      const clubsThreads = await Promise.all(
        clubs.map(club =>
          Thread.findAll({
            where: {
              clubId: club.id
            },
            include: [{model: Message, include: User}]
          })
        )
      )
      const merged = [].concat.apply([], clubsThreads)
      res.send(merged)
    }
  } catch (err) {
    next(err)
  }
})
