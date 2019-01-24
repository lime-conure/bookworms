const router = require('express').Router()
const {Club, Poll, Option, Vote} = require('../db/models')
module.exports = router

const FAKE_USER = {
  id: 1,
  email: 'brynn.shepherd@gmail.com',
  name: 'Brynn Shepherd'
}

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
    // TODO: replace FAKE_USER with req.user
    const clubId = Number(req.params.clubId)
    const pollId = Number(req.params.pollId)
    const votes = req.body.votes

    // security: check if the clubId in route is equal to clubId of poll
    const poll = await Poll.findById(pollId)
    const clubIdOfPoll = poll.getClubId()
    if (clubId === clubIdOfPoll) {
      votes.forEach(async vote => {
        const existingVote = await Vote.findOne({
          where: {optionId: vote, userId: FAKE_USER.id, pollId}
        })
        if (existingVote) {
          res.json('You already voted')
        } else {
          await Vote.create({optionId: vote, userId: FAKE_USER.id, pollId})
          res.json('You voted!')
        }
      })
    } else {
      res
        .status(403)
        .send(`Not authorized: you can't vote for polls not in your club`)
    }
  } catch (err) {
    console.log(err, 'ERROR ERROR')
    next(err)
  }
})
