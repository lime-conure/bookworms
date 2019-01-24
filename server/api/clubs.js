const router = require('express').Router()
const {Club, Poll, Option, Vote} = require('../db/models')
module.exports = router

// GET /api/clubs/:clubId/polls
// router.get('/:clubId/polls', async (req, res, next) => {
//   try {
//     // Poll.findAll(... )
//   } catch (err) {
//     next(err)
//   }
// })

// GET /api/clubs/:clubId/polls/:pollId
router.get('/:clubId/polls/:pollId', async (req, res, next) => {
  try {
    const id = req.params.pollId
    const poll = await Poll.findById(id)
    res.json(poll)
  } catch (err) {
    next(err)
  }
})

router.put('/:clubId/polls/:pollId', async (req, res, next) => {
  try {
    //add security for req.user dont trust user!!!
    const votes = req.body.votes
    const pollId = req.params.pollId
    votes.forEach(async vote => {
      const existingVote = await Vote.findOne({
        where: {optionId: vote, userId: 1, pollId}
      })
      if (existingVote) {
        res.json('You already voted')
      } else {
        await Vote.create({optionId: vote, userId: 1, pollId})
        res.json('You Voted!')
      }
    })
  } catch (err) {
    console.log(err, 'ERROR ERROR')
    next(err)
  }
})
