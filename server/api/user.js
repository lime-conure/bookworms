const router = require('express').Router()
const {Book, UserBook, Author} = require('../db/models')
const Op = require('sequelize').Op
module.exports = router

//********* ROUTES FOR USER **********//

// GET /api/user/books - to get user books
router.get('/books', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send('Not authorized')
    else {
      const rowsWithUserId = await UserBook.findAll({
        where: {
          userId: req.user.id
        }
      })

      let books = await Promise.all(
        rowsWithUserId.map(row =>
          Book.findOne({
            where: {id: row.bookId},
            include: [{model: Author}]
          })
        )
      )

      const newBooks = books.map((book, idx) => {
        return {book, users_books: {type: rowsWithUserId[idx].type}}
      })

      res.send(newBooks)
    }
  } catch (err) {
    next(err)
  }
})

// POST /api/user/books/add - to add a book to user
router.post('/books/add', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
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
      // type === 'now' or type === 'future', no duplicated row allowed in users_books table
      if (type === 'now' || type === 'future') {
        const existingRow = await UserBook.findOne({
          where: {
            bookId: existingBook.id,
            userId: req.user.id,
            type: {
              [Op.or]: ['now', 'future']
            }
          }
        })

        if (existingRow) res.json({})
        else {
          UserBook.create({type, userId: req.user.id, bookId: existingBook.id})
          res.json(existingBook)
        }
      } else {
        UserBook.create({type, userId: req.user.id, bookId: existingBook.id})
        res.json(existingBook)
      }
    }
  } catch (err) {
    next(err)
  }
})

// PUT /api/user/books/delete - delete a book from user
router.put('/books/delete', async (req, res, next) => {
  try {
    if (!req.user) res.status(403).send(`Not authorized`)
    else {
      const {bookId, type} = req.body
      // make sure user has this book before we remove it
      const book = await UserBook.findOne({
        where: {bookId, type, userId: req.user.id}
      })
      if (!book) {
        res.send(`${req.user.fullName} does not have that book`)
      } else {
        await book.destroy()
        res.status(200).send()
      }
    }
  } catch (err) {
    next(err)
  }
})
