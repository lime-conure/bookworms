const router = require('express').Router()
const {
  Club,
  Poll,
  Option,
  Vote,
  Book,
  User,
  Author,
  Thread,
  Message
} = require('../db/models')

module.exports = router

//GET /api/messages
router.get('/', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const messages = await Message.findAll({
        where: {
          userId: req.user.id,
          main: true
        },
        include: User
      })
      res.send(messages)
    }
  } catch (err) {
    next(err)
  }
})
