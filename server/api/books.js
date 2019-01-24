const router = require('express').Router()
const {Book} = require('../db/models')
module.exports = router

//GET /api/books
router.get('/', async (req, res, next) => {
  try {
    res.send(await Book.findAll())
  } catch (err) {
    next(err)
  }
})
