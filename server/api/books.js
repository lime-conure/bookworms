const router = require('express').Router()
const {Book, ClubBook, Club, Author} = require('../db/models')
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
          const books = await club.getBooks()
          res.send(books)
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
          // await ClubBook.create({
          //   type,
          //   bookId: existingBook.id,
          //   bookName: existingBook.title,
          //   clubId
          // })
          // club.addBook(existingBook, {through: {type}})
          existingBook.addClub(club, {through: {type}})
          res.json(existingBook)
        }
      }
    }
  } catch (err) {
    next(err)
  }
})

// PUT /api/clubs/:clubId/books/delete - delete a book from club
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
