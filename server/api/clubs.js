const router = require('express').Router()
const {Club, Poll, Option} = require('../db/models')
module.exports = router

// GET /api/clubs/:clubId/polls
router.get('/:clubId/polls', async (req, res, next) => {
  try {
    // Poll.findAll(... )
  } catch (err) {
    next(err)
  }
})

// GET /api/clubs/:clubId/polls/:pollId
router.get('/:clubId/polls', async (req, res, next) => {
  try {
    // Poll.findByPk(... )
  } catch (err) {
    next(err)
  }
})
