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
          const books = await club.getBooks({include: [{model: Author}]})
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
          const {bookId} = req.body
          // make sure our club has this book before we remove it
          const clubBooks = await club.getBooks({where: {id: bookId}})
          if (!clubBooks.length) {
            res.send(`${club.name} does not have that book`)
          } else {
            await club.removeBook(bookId)
            res.status(200).send()
          }
        }
      }
    }
  } catch (err) {
    next(err)
  }
})
