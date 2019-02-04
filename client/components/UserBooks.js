import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchUserBooks, postUserBook, deleteUserBook} from '../store'
import {makeBookObject, renderBookSearch} from '../utils'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

const styles = theme => ({
  bookSection: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
    width: 720
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

  async handleAddBook(e, bookResult, type) {
    e.preventDefault()
    const newBook = await makeBookObject(bookResult)
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

        {renderBookSearch(books, type, this)}
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
        {this.renderBookSection(currentBooks, 'now', classes)}
        <Divider />
        {this.renderBookSection(futureBooks, 'future', classes)}
        <Divider />
        {this.renderBookSection(pastBooks, 'past', classes)}
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
