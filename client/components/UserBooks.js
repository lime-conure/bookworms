import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchUserBooks, postUserBook, deleteUserBook} from '../store'
import BookSearch from './BookSearch'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

const styles = theme => ({
  bookSection: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
    width: 660
  }
})

class UserBooks extends Component {
  constructor() {
    super()
    this.state = {
      nowResults: [],
      futureResults: [],
      pastResults: []
    }
    this.setResults = this.setResults.bind(this)
    this.handleAddBook = this.handleAddBook.bind(this)
  }

  componentDidMount() {
    this.props.fetchUserBooks()
  }

  setResults = (results, type) => {
    this.setState({[`${type}Results`]: results})
  }

  handleAddBook(e, bookResult, type) {
    e.preventDefault()
    // TODO: fetch book description and save to db
    const newBook = {
      author: bookResult.best_book.author,
      goodReadsId: bookResult.best_book.id,
      title: bookResult.best_book.title,
      imageUrl: bookResult.best_book.image_url,
      smallImageUrl: bookResult.best_book.small_image_url,
      pubDate:
        bookResult.original_publication_month +
        '-' +
        bookResult.original_publication_day +
        '-' +
        bookResult.original_publication_year,
      rating: Math.round(bookResult.average_rating * 100)
    }
    this.props.postUserBook(newBook, type)
    this.setState({
      nowResults: [],
      futureResults: [],
      pastResults: []
    })
  }

  handleRemoveBook(e, idx, bookId) {
    e.preventDefault()
    this.props.deleteUserBook(bookId)
  }

  renderBookSection(books, type, classes) {
    return (
      <div className={classes.bookSection}>
        <Typography variant="h4" component="h4" gutterBottom>
          {type === 'now'
            ? `Books I'm Reading`
            : type === 'future' ? `Books I Want To Read` : `Books I've Read`}
        </Typography>

        <BookSearch
          bookList={books}
          results={this.state[`${type}Results`]}
          setResults={results => this.setResults(results, type)}
          addBook={(e, book) => this.handleAddBook(e, book, type)}
          removeBook={(e, idx, bookId) => this.handleRemoveBook(e, idx, bookId)}
        />
      </div>
    )
  }

  render() {
    const {classes} = this.props
    const books = this.props.books
    const currentBooks = books.filter(book => book.users_books.type === 'now')
    const pastBooks = books.filter(book => book.users_books.type === 'past')
    const futureBooks = books.filter(book => book.users_books.type === 'future')

    return (
      <div>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          My Books
        </Typography>
        <div>
          <Divider />
          {this.renderBookSection(currentBooks, 'now', classes)}
          <Divider />
          {this.renderBookSection(futureBooks, 'future', classes)}
          <Divider />
          {this.renderBookSection(pastBooks, 'past', classes)}
        </div>
      </div>
    )
  }
}

const StyledUserBooks = withStyles(styles)(UserBooks)

const mapState = state => ({
  books: state.user.books
})

const mapDispatch = dispatch => ({
  fetchUserBooks: () => dispatch(fetchUserBooks()),
  postUserBook: (book, type) => dispatch(postUserBook(book, type)),
  deleteUserBook: bookId => dispatch(deleteUserBook(bookId))
})

export default connect(mapState, mapDispatch)(StyledUserBooks)
