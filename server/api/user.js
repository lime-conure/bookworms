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
      const books = await req.user.getBooks({include: [{model: Author}]})
      res.send(books)
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
            BookId: existingBook.id,
            UserId: req.user.id,
            type: {
              [Op.or]: ['now', 'future']
            }
          }
        })
        if (!existingRow) existingBook.addUser(req.user, {through: {type}})
      } else existingBook.addUser(req.user, {through: {type}})
      res.json(existingBook)
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
      const {bookId} = req.body
      // make sure user has this book before we remove it
      const userBooks = await req.user.getBooks({where: {id: bookId}})
      if (!userBooks.length) {
        res.send(`${req.user.fullName} does not have that book`)
      } else {
        await req.user.removeBook(bookId)
        res.status(200).send()
      }
    }
  } catch (err) {
    next(err)
  }
})
