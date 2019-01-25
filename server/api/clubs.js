const router = require('express').Router()
const {Club, Poll, Option, Vote, Book} = require('../db/models')
module.exports = router

const FAKE_USER = {
  id: 1,
  email: 'brynn.shepherd@gmail.com',
  name: 'Brynn Shepherd'
}
//GET /api/clubs/:clubId/polls
router.get('/:clubId/polls', async (req, res, next) => {
  try {
    const clubId = req.params.clubId
    const polls = await Poll.findAll({where: {clubId: clubId}})
    res.send(polls)
  } catch (err) {
    next(err)
  }
})

//POST /api/clubs/:clubId/polls
router.post('/:clubId/polls', async (req, res, next) => {
  try {
    const {
      selectedBooks,
      selectedDates,
      selectedPlaces,
      title,
      dueDate,
      notes
    } = req.body
    const books = []
    for (let i = 0; i < selectedBooks.length; i++) {
      const book = selectedBooks[i]
      let existingBook = await Book.findOne({
        where: {goodReadsId: book.goodReadsId}
      })
      if (!existingBook) {
        existingBook = await Book.create(book)
      }
      books.push(existingBook)
    }
    console.log(books, 'books')

    await Promise.all(
      books.map(book => Option.create({type: 'book', bookId: book.id}))
    )

    await Promise.all(
      selectedDates.map(date => Option.create({type: 'time', dayTime: date}))
    )

    await Promise.all(
      selectedPlaces.map(place =>
        Option.create({type: 'location', location: place})
      )
    )

    const newPoll = await Poll.create({title, dueDate, notes})
    const club = await Club.findById(req.params.clubId)
    newPoll.setClub(club)
    res.send(newPoll)
  } catch (err) {
    next(err)
  }
})

// GET /api/clubs/:clubId/polls/:pollId
router.get('/:clubId/polls/:pollId', async (req, res, next) => {
  try {
    const pollId = Number(req.params.pollId)
    const poll = await Poll.findById(pollId)
    // load poll options
    const options = await poll.getOptions()

    // count votes for each option
    const optionsWithVotes = await Promise.all(
      options.map(async option => {
        const votes = await Vote.findAll({where: {optionId: option.id}})
        return {option, votes: votes.length}
      })
    )

    // group options by type
    const bookOptions = optionsWithVotes.filter(
      optionObj => optionObj.option.type === 'book'
    )
    const timeOptions = optionsWithVotes.filter(
      optionObj => optionObj.option.type === 'time'
    )
    const locationOptions = optionsWithVotes.filter(
      optionObj => optionObj.option.type === 'location'
    )

    res.json({poll, bookOptions, timeOptions, locationOptions})
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
          console.log('you already voted on ', vote)
          //TO DO UPDATE USERS VOTE IF ALREADY VOTED
        } else {
          await Vote.create({optionId: vote, userId: FAKE_USER.id, pollId})
        }
      })
      res.status(200).send('Voted!')
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
