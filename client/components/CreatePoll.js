import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {Search, BookResults} from './index'
import BookSearch from './BookSearch'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

const apiKey = 'jrAzhFY1JP1FdDk1vp7Zg'

const styles = theme => ({
  form: {
    maxWidth: 660
  },
  optionsSection: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    // width: 660,
    // height: 450
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  },
  description: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  }
})

class CreatePoll extends Component {
  constructor() {
    super()
    this.state = {
      open: false,
      description: 'loading...',
      searchResults: [],
      selectedBooks: [],
      selectedDates: [],
      selectedPlaces: [],
      title: '',
      notes: '',
      dueDate: null,
      searchValue: '',
      date: '',
      time: '',
      place: ''
    }
    this.createPoll = this.createPoll.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.addBook = this.addBook.bind(this)
    this.addDateTime = this.addDateTime.bind(this)
    this.addPlaces = this.addPlaces.bind(this)
    this.setResults = this.setResults.bind(this)

    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  setResults = results => {
    this.setState({searchResults: results})
  }

  getDescription = async bookId => {
    const requestUri =
      `https://cors-anywhere.herokuapp.com/` +
      `https://www.goodreads.com/book/show/${bookId}?key=${apiKey}`
    let description = 'loading...'
    try {
      const {data} = await axios.get(requestUri)
      const parser = new DOMParser()
      const XMLResponse = parser.parseFromString(data, 'application/xml')
      description = XMLResponse.getElementsByTagName('description')[0]
        .textContent
      if (!description) {
        return 'No description found.'
      }
      // remove html tags
      const shorterDescWithoutHTML = description
        .replace(/<\/?[^>]+(>|$)/g, '')
        .substr(0, 500)
      return `${shorterDescWithoutHTML}...`
    } catch (err) {
      console.error(err)
    }
  }

  async createPoll(e) {
    e.preventDefault()
    try {
      const {
        selectedBooks,
        selectedDates,
        selectedPlaces,
        title,
        dueDate,
        notes
      } = this.state
      const newPoll = {
        selectedBooks,
        selectedDates,
        selectedPlaces,
        title,
        dueDate,
        notes
      }
      await axios.post(
        `/api/clubs/${this.props.match.params.clubId}/polls`,
        newPoll
      )
      this.props.history.push(`/clubs/${this.props.match.params.clubId}/polls`)
    } catch (err) {
      console.error(err)
    }
  }

  addDateTime(e) {
    e.preventDefault()
    const {time, date} = this.state

    const dateTime = new Date(
      Number(date.slice(0, 4)),
      Number(date.slice(5, 7)) - 1,
      Number(date.slice(8, 10)),
      Number(time.slice(0, 2)),
      Number(time.slice(3, 5))
    )
    this.setState({
      selectedDates: [...this.state.selectedDates, dateTime],
      date: '',
      time: ''
    })
  }

  addPlaces(e) {
    e.preventDefault()
    this.setState({
      selectedPlaces: [...this.state.selectedPlaces, this.state.place],
      place: ''
    })
  }

  addBook(e, book) {
    e.preventDefault()

    const newBook = {
      author: book.best_book.author,
      goodReadsId: book.best_book.id,
      title: book.best_book.title,
      imageUrl: book.best_book.image_url,
      smallImageUrl: book.best_book.small_image_url,
      pubDate:
        book.original_publication_month +
        '-' +
        book.original_publication_day +
        '-' +
        book.original_publication_year,
      rating: Math.round(book.average_rating * 100)
    }
    this.setState({
      selectedBooks: [...this.state.selectedBooks, newBook]
    })
  }

  deleteOption(idx, method, e) {
    e.preventDefault()
    if (method === 'book') {
      this.setState({
        selectedBooks: this.state.selectedBooks.filter(
          book => book !== this.state.selectedBooks[idx]
        )
      })
    }
    if (method === 'place') {
      this.setState({
        selectedPlaces: this.state.selectedPlaces.filter(
          place => place !== this.state.selectedPlaces[idx]
        )
      })
    }
    if (method === 'date') {
      this.setState({
        selectedDates: this.state.selectedDates.filter(
          date => date !== this.state.selectedDates[idx]
        )
      })
    }
  }

  handleClickOpen = async (e, bookId) => {
    e.preventDefault()
    const description = await this.getDescription(bookId)
    this.setState({
      open: true,
      description
    })
  }

  handleClose = () => {
    this.setState({open: false, description: 'loading...'})
  }

  render() {
    const {classes} = this.props
    return (
      <div>
        <form className={classes.form}>
          <Typography variant="h2" gutterBottom color="primary">
            Create a New Poll
          </Typography>

          <TextField
            label="Title"
            name="title"
            value={this.state.title}
            onChange={this.handleChange}
            margin="normal"
            variant="filled"
            fullWidth
          />
          <br />
          <TextField
            label="Notes"
            name="notes"
            value={this.state.notes}
            onChange={this.handleChange}
            margin="normal"
            multiline
            rows="3"
            variant="filled"
            fullWidth
          />
          <br />
          {/* select dueDate */}
          <TextField
            label="When should voting end for this poll?"
            type="date"
            name="dueDate"
            value={this.state.dueDate}
            onChange={this.handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            variant="filled"
            fullWidth
          />
          {/* select books */}
          <div className={classes.optionsSection}>
            <Typography variant="h5" color="secondary" gutterBottom>
              Add Book Options
            </Typography>
            <BookSearch
              bookList={this.state.selectedBooks}
              results={this.state.searchResults}
              setResults={this.setResults}
              addBook={this.addBook}
              removeBook={this.deleteOption}
            />
            {/* <Search setResults={this.setResults} />
            <br />
            {this.state.selectedBooks.length ? (
              <List>
                {this.state.selectedBooks.map((book, idx) => (
                  <div key={idx}>
                    <ListItem
                      button
                      onClick={e => this.handleClickOpen(e, book.goodReadsId)}
                    >
                      <ListItemText>{book.title}</ListItemText>

                      <IconButton
                        onClick={e => this.deleteOption(idx, 'book', e)}
                      >
                        <Icon>cancel</Icon>
                      </IconButton>
                    </ListItem>
                    <Dialog
                      aria-labelledby="book-modal"
                      onClose={this.handleClose}
                      open={this.state.open}
                    >
                      <DialogTitle id="book-modal">{book.title}</DialogTitle>
                      <DialogContent>
                        <img src={book.imageUrl} alt={book.title} />
                        <DialogContentText>
                          <Typography
                            variant="body1"
                            className={classes.description}
                          >
                            {this.state.description}
                          </Typography>
                        </DialogContentText>
                        <Button
                          target="_blank"
                          href={`https://www.goodreads.com/book/show/${
                            book.goodReadsId
                          }`}
                          variant="contained"
                          color="primary"
                        >
                          View On Goodreads
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </List>
            ) : null}
            <BookResults
              books={this.state.searchResults}
              addBook={this.addBook}
            /> */}
          </div>
          {/* select dates */}

          <div className={classes.optionsSection}>
            <Typography variant="h5" color="secondary" gutterBottom>
              Add Date/Time Options
            </Typography>
            <Grid
              container
              spacing={24}
              justify="space-between"
              alignItems="center"
            >
              <Grid item xs={4}>
                <TextField
                  name="date"
                  type="date"
                  label="yyyy/mm/dd"
                  value={this.state.date}
                  onChange={this.handleChange}
                  variant="filled"
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="time"
                  type="time"
                  label="hh:mm"
                  value={this.state.time}
                  onChange={this.handleChange}
                  variant="filled"
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  disabled={!this.state.date || !this.state.time}
                  onClick={this.addDateTime}
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  Add Date/Time
                </Button>
              </Grid>
            </Grid>

            <br />
            <List>
              {this.state.selectedDates.length
                ? this.state.selectedDates.map((date, idx) => (
                    <ListItem button key={idx}>
                      <ListItemText> {date.toString()}</ListItemText>
                      <IconButton
                        onClick={e => this.deleteOption(idx, 'date', e)}
                      >
                        <Icon>cancel</Icon>
                      </IconButton>
                    </ListItem>
                  ))
                : null}
            </List>
          </div>
          {/* select location */}
          <div className={classes.optionsSection}>
            <Typography variant="h5" color="secondary" gutterBottom>
              Add Location Options
            </Typography>
            <Grid
              container
              spacing={24}
              justify="space-between"
              alignItems="center"
            >
              <Grid item xs={8}>
                <TextField
                  name="place"
                  label="Type a location..."
                  value={this.state.place}
                  onChange={this.handleChange}
                  variant="filled"
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  disabled={!this.state.place}
                  onClick={this.addPlaces}
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  Add Location
                </Button>
              </Grid>
            </Grid>
            <br />
            <List>
              {this.state.selectedPlaces.length
                ? this.state.selectedPlaces.map((place, idx) => (
                    <ListItem button key={idx}>
                      <ListItemText> {place}</ListItemText>
                      <IconButton
                        onClick={e => this.deleteOption(idx, 'place', e)}
                      >
                        <Icon>cancel</Icon>
                      </IconButton>
                    </ListItem>
                  ))
                : null}
            </List>
          </div>
          <br />
          <Button
            type="submit"
            onClick={this.createPoll}
            disabled={!this.state.title}
            variant="contained"
            color="primary"
            size="large"
          >
            Create Poll
          </Button>
        </form>
      </div>
    )
  }
}

export default withStyles(styles)(CreatePoll)
