const Author = require('./author/author.js')
const Book = require('./book/book.js')
const Club = require('./club/club.js')
const Media = require('./media/media.js')
const Meeting = require('./meeting/meeting.js')
const Message = require('./message/message.js')
const Option = require('./option/option.js')
const Poll = require('./poll/poll.js')
const Thread = require('./thread/thread.js')
const User = require('./user/user.js')
//const Vote = require('./vote/vote.js')
const db = require('../db')

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
const BookAuthor = db.define('books_authors')
const UserBook = db.define('users_books')
const UserClub = db.define('users_clubs')
const Vote = db.define('users_options')

// books_authors association table columns: bookId, authorId
Book.belongsToMany(Author, {through: BookAuthor})
Author.belongsToMany(Book, {through: BookAuthor})

// users_books association table columns: userId, bookId
User.belongsToMany(Book, {through: UserBook})
Book.belongsToMany(User, {through: UserBook})

// users_clubs association table columns: userId, clubId
User.belongsToMany(Club, {through: UserClub})
Club.belongsToMany(User, {through: UserClub})

// votes association table columns: userId, optionId
// each row in this table represents a vote

User.belongsToMany(Option, {through: Vote})
Option.belongsToMany(User, {through: Vote})

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
  User,
  UserBook,
  UserClub,
  BookAuthor,
  Vote
}
