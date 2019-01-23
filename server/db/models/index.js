const Author = require('./user/author.js')
const Book = require('./user/book.js')
const Club = require('./user/club.js')
const Media = require('./user/media.js')
const Media = require('./user/media.js')
const Message = require('./user/message.js')
const Option = require('./user/option.js')
const Poll = require('./user/poll.js')
const Thread = require('./user/thread.js')
const User = require('./user/user.js')

/**
 * One-to-Many Associations
 */

// Users, Books, Clubs, & Authors have a mediaId
User.hasMany(Media)
Media.belongsTo(User)
Book.hasMany(Media)
Media.belongsTo(Book)
Club.hasMany(Media)
Media.belongsTo(Club)
Author.hasMany(Media)
Media.belongsTo(Author)

// Messages have a userId, clubId, & threadId
User.hasMany(Message)
Message.belongsTo(User)
Club.hasMany(Message)
Message.belongsTo(Club)
Thread.hasMany(Message)
Message.belongsTo(Thread)

// Meetings have a bookId and clubId
Book.hasMany(Meeting)
Meeting.belongsTo(Book)
Club.hasMany(Meeting)
Meeting.belongsTo(Club)

// Polls have a clubId
Club.hasMany(Poll)
Poll.belongsTo(Club)

// Threads have a clubId
Club.hasMany(Thread)
Thread.belongsTo(Club)

// Options have a bookId (which can be null)
Book.hasMany(Option)
Option.belongsTo(Book)

 /**
 * Many-to-Many Associations
 */

// books_authors association table columns: bookId, authorId
Book.belongsToMany(Author, {through: 'books_authors'})
Author.belongsToMany(Book, {through: 'books_authors'})

// users_books association table columns: userId, bookId
User.belongsToMany(Book, {through: 'users_books'})
Book.belongsToMany(User, {through: 'users_books'})

// users_clubs association table columns: userId, clubId
User.belongsToMany(Club, {through: 'users_clubs'})
Club.belongsToMany(User, {through: 'users_clubs'})

// votes association table columns: pollId, optionId, userId
// each row in this table represents a vote
Poll.belongsToMany(Option, {through: 'votes'})
Option.belongsToMany(Poll, {through: 'votes'})
Option.belongsToMany(User, {through: 'votes'})
User.belongsToMany(Option, {through: 'votes'})


/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  Author,
  Book,
  Club,
  Media,
  Meeting,
  Message,
  Option,
  Poll,
  Thread,
  User
}
