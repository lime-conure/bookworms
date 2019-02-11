import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchClubBooks, postClubBook, deleteClubBook} from '../../store'
import {makeBookObject, renderBookSearch} from '../../utils'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

const styles = theme => ({
  bookSection: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
    // 1280px or larger
    [theme.breakpoints.up('lg')]: {
      width: '70%'
    }
  },
  sectionHeader: {
    marginBottom: theme.spacing.unit * 3
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

  async componentDidMount() {
    const clubId = Number(this.props.match.params.clubId)
    await this.props.fetchClubBooks(clubId)
  }

  setResults = (results, type) => {
    this.setState({[`${type}Results`]: results})
  }

  async handleAddBook(e, bookResult, type) {
    e.preventDefault()
    const newBook = await makeBookObject(bookResult)
    this.props.postClubBook(newBook, type, this.props.clubId)
    this.setState({
      nowResults: [],
      futureResults: [],
      pastResults: []
    })
  }

  handleRemoveBook(e, idx, book) {
    e.preventDefault()
    this.props.deleteClubBook(book, this.props.clubId)
  }

  renderBookSection(books, type, classes) {
    return (
      <div className={classes.bookSection}>
        <Typography
          variant="h5"
          component="h5"
          gutterBottom
          className={classes.sectionHeader}
        >
          {type === 'now' ? (
            <span>Books We're Reading &nbsp;&nbsp;📖</span>
          ) : type === 'future' ? (
            <span>Books We Want To Read &nbsp;&nbsp;📘</span>
          ) : (
            <span>Books We've Read &nbsp;&nbsp;📚</span>
          )}
        </Typography>
        {renderBookSearch(books, type, this)}
      </div>
    )
  }

  render() {
    const {classes} = this.props

    const books = this.props.books
    const currentBooks = books.filter(book => book.clubs_books.type === 'now')
    const pastBooks = books.filter(book => book.clubs_books.type === 'past')
    const futureBooks = books.filter(book => book.clubs_books.type === 'future')

    return this.props.books ? (
      <div>
        <Typography variant="h3" component="h3">
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
    ) : (
      <div>Loading...</div>
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
  deleteClubBook: (book, clubId) => dispatch(deleteClubBook(book, clubId))
})

export default connect(mapState, mapDispatch)(StyledClubBooks)
