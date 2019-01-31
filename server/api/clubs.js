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
  UserClub,
  Message
} = require('../db/models')
module.exports = router

router.use('/', require('./books'))

//****** ROUTES FOR CLUBS ******//

//GET /api/clubs - to get all clubs by user
router.get('/', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const user = await User.findById(req.user.id)
      const clubs = await user.getClubs()
      res.send(clubs)
    }
  } catch (err) {
    next(err)
  }
})

//POST /api/clubs/:clubId/deleteMember
router.post('/:clubId/deletemember', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const clubId = req.params.clubId
      const club = await Club.findById(clubId)
      if (!club) {
        res.status(404).send(`Club does not exist!`)
      } else {
        const check = await club.hasUser(req.user.id)
        if (!check) res.status(403).send('Not authorized')
        else {
          await club.removeUser(req.user.id)
          const updatedClub = await Club.findById(clubId)
          res.send(updatedClub)
        }
      }
    }
  } catch (err) {
    next(err)
  }
})

//GET /api/clubs/clubid - to get a club by id
router.get('/:clubId', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const clubId = Number(req.params.clubId)
      const club = await Club.findById(clubId)
      if (!club) res.send('Club does not exist!')
      else {
        const check = await club.hasUser(req.user.id)
        if (!check) res.status(403).send(`Not authorized`)
        else {
          res.json(club)
        }
      }
    }
  } catch (err) {
    next(err)
  }
})

//****** ROUTES FOR POLLS ******
//GET /api/clubs/:clubId/polls
router.get('/:clubId/polls', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const clubId = req.params.clubId
      const club = await Club.findById(clubId)
      if (!club) res.send('Club does not exist!')
      else {
        const check = await club.hasUser(req.user.id)
        if (!check) res.status(403).send(`Not authorized`)
        else {
          const polls = await Poll.findAll({where: {clubId: clubId}})
          res.send(polls)
        }
      }
    }
  } catch (err) {
    next(err)
  }
})

//POST /api/clubs/:clubId/polls
router.post('/:clubId/polls', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const clubId = req.params.clubId
      const club = await Club.findById(clubId)
      if (!club) res.send('Club does not exist!')
      else {
        const check = await club.hasUser(req.user.id)
        if (!check) res.status(403).send(`Not authorized`)
        else {
          const {
            selectedBooks,
            selectedDates,
            selectedPlaces,
            title,
            dueDate,
            notes
          } = req.body
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
              Option.create({
                type: 'location',
                location: place,
                pollId: newPoll.id
              })
            )
          )
          newPoll.setClub(club)
          res.send(newPoll)
        }
      }
    }
  } catch (err) {
    next(err)
  }
})

// GET /api/clubs/:clubId/polls/:pollId
router.get('/:clubId/polls/:pollId', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const clubId = Number(req.params.clubId)
      const club = await Club.findById(clubId)
      if (!club) res.send('Club does not exist!')
      else {
        const check = await club.hasUser(req.user.id)
        if (!check) res.status(403).send(`Not authorized`)
        else {
          const pollId = Number(req.params.pollId)
          const poll = await Poll.findById(pollId)
          if (!poll) {
            res.status(404).send(`Poll does not exist`)
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
                .send(
                  `Not authorized: you can't vote for polls not in your club`
                )
            }
          }
        }
      }
    }
  } catch (err) {
    next(err)
  }
})

router.put('/:clubId/polls/:pollId', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const clubId = Number(req.params.clubId)
      const club = await Club.findById(clubId)
      if (!club) res.send('Club does not exist!')
      else {
        const check = await club.hasUser(req.user.id)
        if (!check) res.status(403).send(`Not authorized`)
        else {
          const pollId = Number(req.params.pollId)
          const votes = req.body.votes

          // security: check if the clubId in route is equal to clubId of poll
          const poll = await Poll.findById(pollId)
          if (!poll) {
            res.status(404).send(`Poll does not exist`)
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
                .send(
                  `Not authorized: you can't vote for polls not in your club`
                )
            }
          }
        }
      }
    }
  } catch (err) {
    console.log(err, 'ERROR ERROR')
    next(err)
  }
})
//GET /api/clubs/:clubId/messages
router.get('/:clubId/messages', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const clubId = Number(req.params.clubId)
      const club = await Club.findById(clubId)
      if (!club) res.send('Club does not exist!')
      else {
        const check = await club.hasUser(req.user.id)
        if (!check) res.status(403).send(`Not authorized`)
        else {
          const messages = await Message.findAll({
            where: {
              clubId,
              main: true
            }
          })
          res.send(messages)
        }
      }
    }
  } catch (err) {
    next(err)
  }
})
// POST a message  /api/clubs/:clubId/messages
router.post('/:clubId/messages', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const clubId = Number(req.params.clubId)
      const club = await Club.findById(clubId)
      if (!club) res.send('Club does not exist!')
      else {
        const check = await club.hasUser(req.user.id)
        if (!check) res.status(403).send(`Not authorized`)
        else {
          await Message.create({
            text: req.body.text,
            userId: req.user.id,
            clubId,
            main: true
          })
          const messages = await Message.findAll({
            where: {
              clubId,
              main: true
            }
          })
          res.send(messages)
        }
      }
    }
  } catch (err) {
    next(err)
  }
})

//GET thread /api/clubs/:clubId/messages/:id
router.get('/:clubId/messages/:id', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const clubId = Number(req.params.clubId)
      const club = await Club.findById(clubId)
      if (!club) res.send('Club does not exist!')
      else {
        const check = await club.hasUser(req.user.id)
        if (!check) res.status(403).send(`Not authorized`)
        else {
          const message = await Message.findOne({
            where: {id: req.params.id, main: true}
          })
          if (!message) res.status(404).send(`Message does not exist!`)
          else if (message.threadId) {
            const threadMessages = await Message.findAll({
              where: {threadId: message.threadId}
            })
            res.send(threadMessages)
          } else res.send(message)
        }
      }
    }
  } catch (err) {
    next(err)
  }
})

//POST message to the thread /api/clubs/:clubId/messages/:id
router.post('/:clubId/messages/:id', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const clubId = Number(req.params.clubId)
      const club = await Club.findById(clubId)
      if (!club) res.send('Club does not exist!')
      else {
        const check = await club.hasUser(req.user.id)
        if (!check) res.status(403).send(`Not authorized`)
        else {
          const message = await Message.findOne({where: {id: req.params.id}})
          if (!message) res.status(404).send(`Message does not exist!`)
          let thread = await Thread.findOne({where: {id: message.threadId}})
          if (!thread) {
            thread = await Thread.create({
              name: message.text,
              clubId: req.params.clubId
            })
            await message.setThread(thread.id)
          }
          await Message.create({
            text: req.body.text,
            userId: req.user.id,
            clubId: message.clubId,
            threadId: message.threadId,
            main: false
          })
          const updatedThread = await Thread.findOne({
            where: {id: thread.id},
            include: [{model: Message, where: {main: false}}]
          })
          res.send(updatedThread)
        }
      }
    }
  } catch (err) {
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
    if (!club) res.status(403).send('Invalid link')
    res.send(club.name)
  } catch (err) {
    next(err)
  }
})

//POST /api/clubs/:clubId/join - join confirmation
router.post('/:clubId/join/:hash', async (req, res, next) => {
  try {
    if (req.user && req.user.id) {
      const inviteLink = `http://localhost:8080/clubs/${
        req.params.clubId
      }/join/${req.params.hash}`
      const club = await Club.findOne({
        where: {
          inviteLink
        }
      })
      if (club) {
        const clubUsers = await club.getUsers()
        if (!clubUsers.includes(clubUser => clubUser.id == req.user.id))
          await club.addUser(req.user)
        res.send(club)
      }
    } else res.status(403).send('Not authorized')
  } catch (err) {
    next(err)
  }
})

// GET /api/clubs/:clubId/users
router.get('/:clubId/users', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const clubId = req.params.clubId
      const club = await Club.findById(clubId)
      if (!club) res.status(403).send('Club does not exist!')
      else {
        const isUser = await club.hasUser(req.user.id)
        if (!isUser) res.status(403).send(`Not authorized`)
        else {
          const users = await club.getUsers()
          res.send(users)
        }
      }
    }
  } catch (err) {
    next(err)
  }
})
