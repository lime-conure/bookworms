const router = require('express').Router()
const {Book, ClubBook, Club, Author} = require('../db/models')
const Op = require('sequelize').Op
module.exports = router

/****** ROUTES FOR ClubBook ******/
//GET /api/clubs/:clubId/books - get all books from club
router.get('/:clubId/books', async (req, res, next) => {
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
          const rowsWithClubId = await ClubBook.findAll({
            where: {
              clubId
            },
            order: [['startTime', 'DESC'], ['endTime', 'ASC']]
          })

          let books = await Promise.all(
            rowsWithClubId.map(row =>
              Book.findOne({
                where: {id: row.bookId},
                include: [{model: Author}]
              })
            )
          )

          const newBooks = books.map((book, idx) => {
            return {
              book,
              clubs_books: {
                type: rowsWithClubId[idx].type,
                startTime: rowsWithClubId[idx].startTime,
                endTime: rowsWithClubId[idx].endTime
              }
            }
          })

          res.send(newBooks)
        }
      }
    }
  } catch (err) {
    next(err)
  }
})

// POST /api/clubs/:clubId/books/add - add a book to club
router.post('/:clubId/books/add', async (req, res, next) => {
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
          const {book, type} = req.body
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
          // type === 'now' or type === 'future', no duplicated row allowed in clubs_books table
          if (type === 'now' || type === 'future') {
            const existingRow = await ClubBook.findOne({
              where: {
                bookId: existingBook.id,
                clubId,
                type: {
                  [Op.or]: ['now', 'future']
                }
              }
            })

            if (existingRow) res.json({})
            else {
              ClubBook.create({
                type,
                clubId: club.id,
                bookId: existingBook.id,
                startTime: book.startTime,
                endTime: book.endTime
              })
              res.json({
                book: existingBook,
                clubs_books: {
                  type,
                  startTime: book.startTime,
                  endTIme: book.endTime
                }
              })
            }
          } else {
            ClubBook.create({
              type,
              clubId: club.id,
              bookId: existingBook.id,
              startTime: book.startTime,
              endTime: book.endTime
            })
            res.json({
              book: existingBook,
              clubs_books: {
                type,
                starttime: book.startTime,
                endTime: book.endTime
              }
            })
          }
        }
      }
    }
  } catch (err) {
    next(err)
  }
})

// PUT /api/clubs/:clubId/books/delete - delete a book from club, given its id
router.put('/:clubId/books/delete', async (req, res, next) => {
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
          const {book} = req.body
          // make sure our club has this book before we remove it
          let bookToDel
          if (book.clubs_books.type === 'past') {
            bookToDel = await ClubBook.findOne({
              where: {
                clubId,
                bookId: book.id,
                type: 'past',
                endTime: book.clubs_books.endTime
              }
            })
          } else {
            bookToDel = await ClubBook.findOne({
              where: {
                clubId,
                bookId: book.id,
                type: book.clubs_books.type
              }
            })
          }

          if (!bookToDel) {
            res.send(`${club.name} does not have that book`)
          } else {
            await bookToDel.destroy()
            res.status(200).json()
          }
        }
      }
    }
  } catch (err) {
    next(err)
  }
})
