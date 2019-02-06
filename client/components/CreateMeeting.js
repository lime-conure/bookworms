import React, {Component} from 'react'
import {connect} from 'react-redux'
import {postMeeting} from '../store'
import BookSearch from './BookSearch'
import {formatDateString, formatDate, makeBookObject} from '../utils'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Textfield from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  form: {
    maxWidth: 660
  },
  formSection: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  }
})

export class CreateMeeting extends Component {
  constructor(props) {
    super(props)
    // default date option is next week at the same time
    const today = new Date()
    const defaultDate = new Date(today.setDate(today.getDate() + 7))
    // don't include the time
    const defaultDateString = formatDateString(defaultDate).slice(0, 10)
    this.state = {
      name: '',
      location: '',
      date: defaultDateString,
      selectedBooks: [],
      searchResults: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.addBook = this.addBook.bind(this)
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
    if (e.target.name === 'date') {
      // prevent users from selecting due dates in the past
      const selectedDate = formatDate(e.target.value)
      const today = new Date()
      if (selectedDate < today) {
        const todayString = formatDateString(today).slice(0, 10)
        this.setState({
          date: todayString
        })
      } else {
        this.setState({
          date: e.target.value
        })
      }
    } else {
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  }

  addBook(e, book) {
    e.preventDefault()
    const newBook = makeBookObject(book)
    this.setState({selectedBooks: [newBook]})
  }

  removeBook(e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({selectedBooks: []})
  }

  render() {
    const {classes} = this.props
    return (
      <div>
        <form className={classes.form}>
          <Typography variant="h3" component="h3">
            Create a New Meeting
          </Typography>
          <Divider />
          <div className={classes.formSection}>
            <Textfield
              label="Name your meeting"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
              margin="normal"
              variant="filled"
              fullWidth
              autoFocus={true}
              required
            />
            <br />
            <Textfield
              label="Type a location"
              name="location"
              value={this.state.location}
              onChange={this.handleChange}
              margin="normal"
              variant="filled"
              fullWidth
              required
            />
            <br />
            <Textfield
              label="Choose a date"
              type="date"
              name="date"
              value={this.state.date}
              onChange={this.handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              variant="filled"
              fullWidth
              required
            />
          </div>
          {/* select book */}
          <div className={classes.formSection}>
            <Typography variant="h5" gutterBottom>
              Add a Book
            </Typography>
            <BookSearch
              bookList={this.state.selectedBooks} // array of one book object
              results={this.state.searchResults}
              addBook={(e, book) => this.addBook(e, book)}
              removeBook={e => this.removeBook(e)}
              hideBookActions={true}
              // meetings can only have one book, so disable search after selecting one
              hideSearch={this.state.selectedBooks.length}
            />
          </div>

          <Button
            type="button"
            onClick={() =>
              this.props.postMeeting(this.props.clubId, {
                name: this.state.name,
                location: this.state.location,
                date: this.state.date,
                book: this.state.selectedBooks[0]
              })
            }
            disabled={!this.state.name || !this.state.location}
            variant="contained"
            color="primary"
            size="large"
          >
            Create Meeting
          </Button>
        </form>
      </div>
    )
  }
}

const StyledCreateMeeting = withStyles(styles)(CreateMeeting)

const mapState = state => ({
  user: state.user,
  clubId: state.singleClub.id
})

const mapDispatch = dispatch => ({
  postMeeting: (clubId, meeting) => dispatch(postMeeting(clubId, meeting))
})

export default connect(mapState, mapDispatch)(StyledCreateMeeting)
