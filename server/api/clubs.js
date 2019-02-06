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
  Message,
  Meeting
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

//POST api/clubs/create - to create a new club
router.post('/create', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const {name} = req.body
      const club = await Club.create({name})
      const clubId = club.id
      await club.addUser(req.user.id)
      const hash = Math.floor(Math.random() * 100000000)
      const inviteLink = `/clubs/${clubId}/join/${hash}`
      const newClub = await club.update({inviteLink})
      res.json(newClub)
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
          const hostName = process.env.HOST_NAME || 'http://localhost:8080'
          const inviteLink = hostName + club.inviteLink
          club.inviteLink = inviteLink
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
          const polls = await Poll.findAll({where: {clubId}})
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
          const newPoll = await Poll.create({
            title,
            notes,
            dueDate: new Date(dueDate),
            creatorId: req.user.id
          })
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
              const dateTime = new Date(date)
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

// PUT /api/clubs/:clubId/polls - delete a poll, given pollId (in req.body) and clubId
router.put('/:clubId/polls', async (req, res, next) => {
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
          const {pollId} = req.body
          // make sure our club has this meeting before we remove it
          const poll = await Poll.findOne({
            where: {clubId, id: pollId}
          })
          if (!poll) {
            res.status(404).send(`${club.name} does not have that poll`)
          } else if (poll.creatorId !== req.user.id) {
            res.status(403).send(`Not authorized to delete poll`)
          } else {
            await poll.destroy()
            res.status(200).send()
          }
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
              const options = await poll.getOptions({include: [{model: Book}]})

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
//GET messages /api/clubs/:clubId/messages

router.get('/:clubId/messages', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const clubId = Number(req.params.clubId)
      const club = await Club.findById(clubId)
      if (!club) res.send('Club does not exist!')
      const messages = await Message.findAll({
        where: {
          clubId: club.id
        },
        include: [{all: true}]
      })

      res.send(messages)
    }
  } catch (err) {
    next(err)
  }
})

// POST a message  /api/clubs/:clubId/threads
router.post('/:clubId/threads', async (req, res, next) => {
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
          const thread = await Thread.create({
            name: '',
            clubId
          })
          await Message.create({
            text: req.body.text,
            userId: req.user.id,
            clubId,
            threadId: thread.id
          })

          const threaddy = await Thread.findOne({
            where: {
              id: thread.id
            },
            include: [{model: Message, include: [{model: User}]}]
          })
          res.send(threaddy)
        }
      }
    }
  } catch (err) {
    next(err)
  }
})

//GET thread /api/clubs/:clubId/threads/:id
router.get('/:clubId/threads/:threadId', async (req, res, next) => {
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
          const thread = await Thread.findOne({
            where: {id: req.params.threadId},
            include: [{model: Message, include: User}]
          })

          if (!thread) res.status(404).send(`Thread does not exist!`)
          else res.send(thread)
        }
      }
    }
  } catch (err) {
    next(err)
  }
})

//POST message to the thread /api/clubs/:clubId/threads/:threadId
router.post('/:clubId/threads/:threadId', async (req, res, next) => {
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
          const thread = await Thread.findOne({
            where: {id: req.params.threadId}
          })
          if (!thread) res.send('Thread does not exist')
          else {
            const message = await Message.create({
              text: req.body.text,
              userId: req.user.id,
              clubId: clubId,
              threadId: thread.id
            })
            const updatedMessage = await Message.findOne({
              where: {id: message.id},
              include: [{model: User}]
            })
            res.send(updatedMessage)
          }
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
        inviteLink: `/clubs/${req.params.clubId}/join/${req.params.hash}`
      }
    })
    if (!club) res.status(403).send('Invalid link')
    else res.send(club.name)
  } catch (err) {
    next(err)
  }
})

//POST /api/clubs/:clubId/join - join confirmation
router.post('/:clubId/join/:hash', async (req, res, next) => {
  try {
    if (req.user && req.user.id) {
      const inviteLink = `/clubs/${req.params.clubId}/join/${req.params.hash}`
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

//****** ROUTES FOR MEETINGS ******//

//GET api/clubs/clubId/meetings - to find all meetings in one club
router.get('/:clubId/meetings', async (req, res, next) => {
  try {
    if (!req.user.id) res.status(403).send('Not authorized')
    if (!req.params.clubId) res.status(403).send('Not authorized')
    else {
      const user = await User.findById(req.user.id)
      const club = await Club.findById(req.params.clubId)
      const check = await club.hasUser(user.id)
      if (!check)
        res
          .status(403)
          .send('You are not authorized to see the meetings for this club')
      else {
        const meetings = await Meeting.findAll({
          where: {clubId: club.id},
          include: [{model: Book}]
        })
        res.json(meetings)
      }
    }
  } catch (err) {
    next(err)
  }
})

//POST api/:clubId/meetings - to create a meeting
router.post('/:clubId/meetings', async (req, res, next) => {
  try {
    if (!req.user.id) res.status(403).send('Not authorized')
    if (!req.params.clubId) res.status(403).send('Not authorized')
    else {
      const user = await User.findById(req.user.id)
      const club = await Club.findById(req.params.clubId)
      const check = await club.hasUser(user.id)
      if (check) {
        const {clubId} = req.params
        const {name, location, date, book} = req.body
        let existingBook = await Book.findOne({
          where: {goodReadsId: book.goodReadsId}
        })
        if (!existingBook) {
          existingBook = await Book.create(book)
        }
        const newMeeting = await Meeting.create({
          name,
          location,
          date: new Date(date),
          creatorId: req.user.id,
          clubId
        })
        await newMeeting.setBook(existingBook)
        res.json(newMeeting)
      } else {
        res.status(403).send('Not authorized to create a meeting for this club')
      }
    }
  } catch (err) {
    next(err)
  }
})

// PUT /api/clubs/:clubId/meetings - delete a meeting, given meetingId (in req.body) and clubId
router.put('/:clubId/meetings', async (req, res, next) => {
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
          const {meetingId} = req.body
          // make sure our club has this meeting before we remove it
          const meeting = await Meeting.findOne({
            where: {clubId, id: meetingId}
          })
          if (!meeting) {
            res.status(404).send(`${club.name} does not have that meeting`)
          } else if (meeting.creatorId !== req.user.id) {
            res.status(403).send(`Not authorized to delete meeting`)
          } else {
            await meeting.destroy()
            res.status(200).send()
          }
        }
      }
    }
  } catch (err) {
    next(err)
  }
})
