import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Search, BookList} from './index'
import {fetchClubBooks} from '../store'

import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const apiKey = 'jrAzhFY1JP1FdDk1vp7Zg'

export class ClubBooks extends Component {
  componentDidMount() {
    const clubId = Number(this.props.match.params.clubId)
    this.props.fetchClubBooks(clubId)
  }

  render() {
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
          <Typography variant="h5" gutterBottom>
            Books We've Read
          </Typography>
          {/* <Search />
          <BookList books={pastBooks} /> */}
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
          <Divider />
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  books: state.clubBooks
})

const mapDispatch = dispatch => ({
  fetchClubBooks: clubId => dispatch(fetchClubBooks(clubId))
})

export default connect(mapState, mapDispatch)(ClubBooks)
