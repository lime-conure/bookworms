const router = require('express').Router()
const {Book, ClubBook, Club, Author} = require('../db/models')
module.exports = router

/****** ROUTES FOR ClubBook ******/
//GET /api/books/:clubId - get all books from club
router.get('/:clubId', async (req, res, next) => {
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
          const books = await ClubBook.findAll({
            where: {clubId}
          })
          res.send(books)
        }
      }
    }
  } catch (err) {
    next(err)
  }
})

// POST /api/books/:clubId/add - add a book to club
router.post('/:clubId/add', async (req, res, next) => {
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
          await ClubBook.create({
            type,
            bookId: existingBook.id,
            bookName: existingBook.title,
            clubId
          })
          res.json(existingBook)
        }
      }
    }
  } catch (err) {
    next(err)
  }
})

// Put /api/books/:clubId/delete - delete a book from club
router.put('/:clubId/delete', async (req, res, next) => {
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
          if (existingBook) {
            const clubBooks = await club.getBooks({where: {type}})
            if (!clubBooks.includes(clubBook => clubBook.id == book.id))
              res.send(`${club.name} does not have ${book.title}`)
            else {
              await club.removeBook(book.id)
              res.status(200).send()
            }
          }
        }
      }
    }
  } catch (err) {
    next(err)
  }
})
