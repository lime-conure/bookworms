import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchClubBooks} from '../store'
import {Search, BookList} from './index'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const apiKey = 'jrAzhFY1JP1FdDk1vp7Zg'

const styles = theme => ({
  bookSection: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    width: 660
  }
})

export class ClubBooks extends Component {
  constructor() {
    super()
    this.state = {
      searchResults: []
    }
    this.setResults = this.setResults.bind(this)
    this.handleAddBook = this.handleAddBook.bind(this)
  }

  componentDidMount() {
    const clubId = Number(this.props.match.params.clubId)
    this.props.fetchClubBooks(clubId)
  }

  setResults = results => {
    this.setState({searchResults: results})
  }

  handleAddBook(e, bookResult) {
    e.preventDefault()

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
    console.log('new book: ', newBook)
    // this.setState({
    //   selectedBooks: [...this.state.selectedBooks, newBook]
    // })
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
        <Divider />

        <div className={classes.bookSection}>
          <Typography variant="h5" gutterBottom>
            Books We've Read
          </Typography>
          {pastBooks.length ? (
            <List>
              {pastBooks.map(book => (
                <ListItem button key={book.id}>
                  <ListItemText>{book.title}</ListItemText>
                </ListItem>
              ))}
            </List>
          ) : (
            ''
          )}
          <Search setResults={this.setResults} />
          <BookList
            books={this.state.searchResults}
            addBook={this.handleAddBook}
          />
        </div>
      </div>
    )
  }
}

const StyledClubBooks = withStyles(styles)(ClubBooks)

const mapState = state => ({
  books: state.clubBooks
})

const mapDispatch = dispatch => ({
  fetchClubBooks: clubId => dispatch(fetchClubBooks(clubId))
})

export default connect(mapState, mapDispatch)(StyledClubBooks)
