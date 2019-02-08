import React, {Component} from 'react'
import axios from 'axios'
import BookSearch from '../../components/BookSearch'
import {
  formatDate,
  formatDateString,
  formatDateDisplay,
  makeBookObject
} from '../../utils'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Checkbox from '@material-ui/core/Checkbox'

const styles = theme => ({
  form: {
    maxWidth: 720
  },
  formSection: {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  },
  optionText: {
    color: '#fff'
  },
  checkboxLabel: {
    fontSize: 16
  }
})

class CreatePoll extends Component {
  constructor() {
    super()
    // default date/time option is next week at the same time
    const today = new Date()
    const defaultDateTime = new Date(today.setDate(today.getDate() + 7))

    // default dueDate option is next month
    const defaultDueDate = new Date(today.setDate(today.getDate() + 30))
    const defaultDueDateString = formatDateString(defaultDueDate).slice(0, 10)
    this.state = {
      searchResults: [],
      selectedBooks: [],
      selectedDates: [],
      selectedPlaces: [],
      title: '',
      notes: '',
      dueDate: defaultDueDateString,
      dateTime: formatDateString(defaultDateTime),
      place: '',
      autoGenerateMeeting: true
    }
    this.createPoll = this.createPoll.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCheck = this.handleCheck.bind(this)
    this.addBook = this.addBook.bind(this)
    this.addDateTime = this.addDateTime.bind(this)
    this.addPlaces = this.addPlaces.bind(this)
    this.setResults = this.setResults.bind(this)
  }

  handleChange(e) {
    if (e.target.name === 'dueDate') {
      // prevent users from selecting due dates in the past
      const selectedDate = formatDate(e.target.value)
      const today = new Date()
      if (selectedDate < today) {
        const todayString = formatDateString(today).slice(0, 10)
        this.setState({
          dueDate: todayString
        })
      } else {
        this.setState({
          dueDate: e.target.value
        })
      }
    } else {
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  }

  handleCheck(e) {
    this.setState({autoGenerateMeeting: e.target.checked})
  }

  setResults = results => {
    this.setState({searchResults: results})
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
    const dateTime = formatDate(this.state.dateTime)
    this.setState({
      selectedDates: [
        ...this.state.selectedDates,
        formatDateDisplay(dateTime, true)
      ],
      dateTime: ''
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

    const newBook = makeBookObject(book)
    this.setState({
      selectedBooks: [...this.state.selectedBooks, newBook]
    })
  }

  deleteOption(e, idx, method) {
    e.preventDefault()
    e.stopPropagation()
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

  render() {
    const {classes} = this.props
    return (
      <div>
        <form className={classes.form}>
          <Typography variant="h3" component="h3">
            Create a New Poll
          </Typography>
          <Divider />
          <div className={classes.formSection}>
            <TextField
              label="Title"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
              margin="normal"
              variant="filled"
              fullWidth
              autoFocus={true}
              required
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
              type="datetime-local"
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
          </div>

          {/* select books */}
          <div className={classes.formSection}>
            <Typography variant="h5" gutterBottom>
              Add Book Options
            </Typography>
            <BookSearch
              bookList={this.state.selectedBooks}
              results={this.state.searchResults}
              setResults={this.setResults}
              addBook={(e, book) => this.addBook(e, book)}
              removeBook={(e, idx) => this.deleteOption(e, idx, 'book')}
              hideBookActions={true}
            />
          </div>
          {/* select dates */}
          <div className={classes.formSection}>
            <Typography variant="h5" gutterBottom>
              Add Date &amp; Time Options
            </Typography>
            <Grid
              container
              spacing={24}
              justify="space-between"
              alignItems="center"
            >
              <Grid item xs={8}>
                <TextField
                  name="dateTime"
                  type="datetime-local"
                  label="yyyy/mm/dd"
                  defaultValue={this.state.dateTime}
                  onChange={this.handleChange}
                  mindate={0}
                  variant="filled"
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                  inputProps={{
                    // prevent users from selecting past dates
                    min: new Date().toISOString().slice(0, 16)
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  disabled={!this.state.dateTime}
                  onClick={this.addDateTime}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Add Date/Time
                </Button>
              </Grid>
            </Grid>
            <List>
              {this.state.selectedDates.length
                ? this.state.selectedDates.map((date, idx) => (
                    <ListItem button key={date}>
                      <ListItemText className={classes.optionText}>
                        {' '}
                        {date.toString()}
                      </ListItemText>
                      <IconButton
                        onClick={e => this.deleteOption(e, idx, 'date')}
                      >
                        <Icon>cancel</Icon>
                      </IconButton>
                    </ListItem>
                  ))
                : null}
            </List>
          </div>
          {/* select location */}
          <div className={classes.formSection}>
            <Typography variant="h5" gutterBottom>
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
                  color="primary"
                >
                  Add Location
                </Button>
              </Grid>
            </Grid>
            <br />
            <List>
              {this.state.selectedPlaces.length
                ? this.state.selectedPlaces.map((place, idx) => (
                    <ListItem button key={place}>
                      <ListItemText className={classes.optionText}>
                        {' '}
                        {place}
                      </ListItemText>
                      <IconButton
                        onClick={e => this.deleteOption(e, idx, 'place')}
                      >
                        <Icon>cancel</Icon>
                      </IconButton>
                    </ListItem>
                  ))
                : null}
            </List>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.autoGenerateMeeting}
                  onChange={this.handleCheck}
                  color="secondary"
                />
              }
              label="When voting ends, automatically generate a meeting with the winning options from this poll"
              classes={{
                label: classes.checkboxLabel
              }}
            />
          </div>

          <Button
            type="submit"
            onClick={this.createPoll}
            disabled={!this.state.title}
            variant="contained"
            color="secondary"
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
