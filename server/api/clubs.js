const router = require('express').Router()
const {Club, Poll, Option, Vote, Book, User, Author} = require('../db/models')
module.exports = router

const FAKE_USER = {
  id: 1,
  email: 'brynn.shepherd@gmail.com',
  name: 'Brynn Shepherd'
}
module.exports = router

//****** ROUTES FOR CLUBS ******//

//GET /api/clubs - to get all clubs by user
router.get('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    const clubs = await user.getClubs()
    res.send(clubs)
  } catch (err) {
    next(err)
  }
})

//POST /api/clubs/:clubId/deleteMember
router.post('/:clubId/deletemember', async (req, res, next) => {
  try {
    const clubId = req.params.clubId
    const club = await Club.findById(clubId)
    const user = await User.findById(req.user.id)
    await club.removeUser(user)
    const updatedClub = await Club.findById(clubId)
    res.send(updatedClub)
  } catch (err) {
    next(err)
  }
})

//GET /api/clubs/clubid - to get a club by id
router.get('/:clubId', async (req, res, next) => {
  try {
    const clubId = Number(req.params.clubId)
    const club = await Club.findById(clubId)
    res.json(club)
  } catch (err) {
    next(err)
  }
})

//****** ROUTES FOR POLLS ******
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

    console.log(req.body.selectedDates)

    const newPoll = await Poll.create({title, dueDate, notes})

    const books = []
    for (let i = 0; i < selectedBooks.length; i++) {
      const book = selectedBooks[i]
      let existingBook = await Book.findOne({
        where: {goodReadsId: book.goodReadsId}
      })
      if (!existingBook) {
        existingBook = await Book.create(book)
        let existingAuthor = await Author.findOne({
          where: {goodReadsId: book.author.id}
        })
        console.log('book', book)
        console.log(existingBook, 'existing book')
        if (!existingAuthor) {
          existingAuthor = await Author.create({
            name: book.author.name,
            goodReadsId: book.author.id
          })
        }
        existingBook.setAuthors([existingAuthor])
      }
      books.push(existingBook)
    }
    console.log(books, 'books')

    await Promise.all(
      books.map(book =>
        Option.create({
          type: 'book',
          bookId: book.id,
          bookName: book.title,
          pollId: newPoll.id
        })
      )
    )

    await Promise.all(
      selectedDates.map(date => {
        console.log('date:', date)
        const dateTime = new Date(date)
        console.log('dateTime:', dateTime)
        return Option.create({
          type: 'time',
          dateTime: dateTime,
          pollId: newPoll.id
        })
      })
    )

    await Promise.all(
      selectedPlaces.map(place =>
        Option.create({type: 'location', location: place, pollId: newPoll.id})
      )
    )

    //const newPoll = await Poll.create({title, dueDate, notes})
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
    const clubId = Number(req.params.clubId)

    const poll = await Poll.findById(pollId)
    if (!poll) {
      res.status(404).send(`Poll does not exist`)
    } else if (!req.user) {
      res
        .status(403)
        .send(`Not authorized: you can't vote if you're not logged in`)
    } else {
      const clubIdOfPoll = poll.getClubId()
      if (clubId === clubIdOfPoll) {
        // load poll options
        const options = await poll.getOptions()

        // count votes for each option
        const allOptions = await Promise.all(
          options.map(async option => {
            const votes = await Vote.findAll({
              where: {optionId: option.id},
              attributes: ['userId']
            })
            return {option, votes, numVotes: votes.length}
          })
        )
        res.json({poll, allOptions})
      } else {
        res
          .status(403)
          .send(`Not authorized: you can't vote for polls not in your club`)
      }
    }
  } catch (err) {
    next(err)
  }
})

router.put('/:clubId/polls/:pollId', async (req, res, next) => {
  try {
    const clubId = Number(req.params.clubId)
    const pollId = Number(req.params.pollId)
    const votes = req.body.votes

    // security: check if the clubId in route is equal to clubId of poll
    const poll = await Poll.findById(pollId)
    if (!poll) {
      res.status(404).send(`Poll does not exist`)
    } else if (!req.user) {
      res
        .status(403)
        .send(`Not authorized: you can't vote if you're not logged in`)
    } else {
      const userId = req.user.id
      const clubIdOfPoll = poll.getClubId()

      if (clubId === clubIdOfPoll) {
        const optionsInPoll = await poll.getOptions()
        optionsInPoll.forEach(async option => {
          const existingVote = await Vote.findOne({
            where: {optionId: option.id, userId}
          })
          const voting = votes.includes(option.id)
          if (!existingVote && voting) {
            // adding a new vote
            await Vote.create({optionId: option.id, userId})
          } else if (existingVote && !voting) {
            // undoing a vote
            await Vote.destroy({where: {optionId: option.id, userId}})
          }
        })
        res.json(votes)
      } else {
        res
          .status(403)
          .send(`Not authorized: you can't vote for polls not in your club`)
      }
    }
  } catch (err) {
    console.log(err, 'ERROR ERROR')
    next(err)
  }
})
//GET /api/clubs/:clubId/join - join request
router.get('/:clubId/join/:hash', async (req, res, next) => {
  try {
    const club = await Club.findOne({
      where: {
        inviteLink: `http://localhost:8080/clubs/${req.params.clubId}/join/${
          req.params.hash
        }`
      }
    })
    if (!club) res.json('Invalid link')
    res.send(club.name)
  } catch (err) {
    next(err)
  }
})

//POST /api/clubs/:clubId/join - join confirmation
router.post('/:clubId/join', async (req, res, next) => {
  try {
    if (req.user && req.user.id) {
      const club = await Club.findOne({where: {id: req.params.clubId}})
      const clubUser = await club.getUser(req.user.id)
      if (!clubUser) await club.setUser(req.user.id)
      res.send(club)
    }
    res.sendStatus(404)
  } catch (err) {
    next(err)
  }
})
