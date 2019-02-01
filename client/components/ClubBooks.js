import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchClubBooks, postClubBook, deleteClubBook} from '../store'
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

export class ClubBooks extends Component {
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
    const clubId = Number(this.props.match.params.clubId)
    this.props.fetchClubBooks(clubId)
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
    this.props.postClubBook(newBook, type, this.props.clubId)
    this.setState({
      nowResults: [],
      futureResults: [],
      pastResults: []
    })
  }

  handleRemoveBook(e, idx, bookId) {
    e.preventDefault()
    this.props.deleteClubBook(bookId, this.props.clubId)
  }

  renderBookSection(books, type, classes) {
    return (
      <div className={classes.bookSection}>
        <Typography variant="h4" component="h4" gutterBottom>
          {type === 'now'
            ? `Books We're Reading`
            : type === 'future' ? `Books We Want To Read` : `Books We've Read`}
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
    const currentBooks = books.filter(book => book.clubs_books.type === 'now')
    const pastBooks = books.filter(book => book.clubs_books.type === 'past')
    const futureBooks = books.filter(book => book.clubs_books.type === 'future')

    return (
      <div>
        <Typography variant="h3" gutterBottom color="primary">
          Books
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

const StyledClubBooks = withStyles(styles)(ClubBooks)

const mapState = state => ({
  books: state.clubBooks,
  clubId: state.singleClub.id
})

const mapDispatch = dispatch => ({
  fetchClubBooks: clubId => dispatch(fetchClubBooks(clubId)),
  postClubBook: (book, type, clubId) =>
    dispatch(postClubBook(book, type, clubId)),
  deleteClubBook: (bookId, clubId) => dispatch(deleteClubBook(bookId, clubId))
})

export default connect(mapState, mapDispatch)(StyledClubBooks)
