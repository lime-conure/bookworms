const router = require('express').Router()
module.exports = router

router.use('/clubs', require('./clubs'))
router.use('/books', require('./books'))
router.use('/threads', require('./threads'))
// router.use('/meetings', require('./meetings'))
router.use('/user', require('./user'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
