const router = require('express').Router()
module.exports = router

router.use('/clubs', require('./clubs'))
router.use('/user', require('./user'))
router.use('/messages', require('./messages'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
