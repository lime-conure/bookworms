import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchSinglePoll, sendVotes} from '../store'
import {withStyles} from '@material-ui/core/styles'
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Checkbox,
  Button
} from '@material-ui/core'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  poll: {
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3
  }
})

export class SinglePoll extends Component {
  constructor(props) {
    super(props)
    // local state for keeping track of which checkbox options are selected
    this.state = {
      votes: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCheck = this.handleCheck.bind(this)
  }

  async componentDidMount() {
    // load poll
    const singlePollId = Number(this.props.match.params.pollId)
    const clubId = Number(this.props.match.params.clubId)
    await this.props.fetchSinglePoll(clubId, singlePollId)

    // set local checkbox state
    const existingVotes = this.props.singlePoll.allOptions
      .filter(optionObj => this.optionIsChecked(optionObj))
      .map(optionObj => optionObj.option.id)
    this.setState({votes: existingVotes})
  }
  handleCheck(event) {
    const checked = event.target.checked
    const optionId = Number(event.target.value)
    if (checked) {
      // add vote
      this.setState(prevState => ({
        votes: [...prevState.votes, optionId]
      }))
    } else {
      // undo vote
      this.setState(prevState => ({
        votes: prevState.votes.filter(id => id !== optionId)
      }))
    }
  }
  handleSubmit(event) {
    event.preventDefault()
    const singlePollId = Number(this.props.match.params.pollId)
    const clubId = Number(this.props.match.params.clubId)
    const payload = {
      userId: Number(this.props.userId),
      clubId,
      pollId: singlePollId,
      votes: this.state.votes
    }
    this.props.sendVotes(payload)
  }

  optionIsChecked(optionObj) {
    if (
      this.props.userId &&
      optionObj.votes.map(vote => vote.userId).includes(this.props.userId)
    ) {
      return true
    } else return false
  }
  renderPoll(options, type, classes) {
    const columnName =
      type === 'Book'
        ? 'bookName'
        : type === 'Date/Time' ? 'dateTime' : 'location'
    if (options && options.length) {
      return (
        <Paper elevation={2} className={classes.poll}>
          <Typography variant="h6" id="tableTitle">
            {type} Options
          </Typography>
          <Table>
            <TableHead />
            <TableBody>
              <TableRow>
                {options.map(optionObj => (
                  <TableCell key={optionObj.option.id}>
                    <strong>{optionObj.option[columnName]}</strong>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {options.map(optionObj => (
                  <TableCell key={optionObj.option.id}>
                    {optionObj.numVotes}{' '}
                    {optionObj.numVotes === 1 ? 'vote' : 'votes'}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow selected>
                {options.map(optionObj => (
                  <TableCell key={optionObj.option.id} padding="checkbox">
                    <Checkbox
                      value={optionObj.option.id}
                      defaultChecked={
                        this.optionIsChecked(optionObj) ? 'checked' : ''
                      }
                      onChange={this.handleCheck}
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      )
    }
  }

  // eslint-disable-next-line complexity
  render() {
    const {classes} = this.props

    const poll = this.props.singlePoll.poll
    const allOptions = this.props.singlePoll.allOptions
    const bookOptions = allOptions.filter(
      optionObj => optionObj.option.type === 'book'
    )
    const timeOptions = allOptions.filter(
      optionObj => optionObj.option.type === 'time'
    )
    const locationOptions = allOptions.filter(
      optionObj => optionObj.option.type === 'location'
    )

    if (poll) {
      return (
        <main className={classes.root}>
          <Button
            component={Link}
            to={`/clubs/${this.props.match.params.clubId}/polls/`}
          >
            ← Back to all polls
          </Button>
          <Typography variant="h3" gutterBottom color="primary">
            {poll.title}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {poll.notes}
          </Typography>

          {poll.dueDate ? (
            <Typography variant="subtitle2" gutterBottom>
              Voting ends on {poll.dueDate.slice(0, 10)}
            </Typography>
          ) : (
            ''
          )}

          <form onSubmit={this.handleSubmit}>
            {this.renderPoll(bookOptions, 'Book', classes)}
            {this.renderPoll(timeOptions, 'Date/Time', classes)}
            {this.renderPoll(locationOptions, 'Location', classes)}
            <br />
            {allOptions.length ? (
              <Button
                size="large"
                color="primary"
                variant="outlined"
                type="submit"
              >
                Vote
              </Button>
            ) : (
              ''
            )}
          </form>
        </main>
      )
    } else {
      return <main className={classes.root}>Loading...</main>
    }
  }
}

const StyledSinglePoll = withStyles(styles)(SinglePoll)

const mapState = state => ({
  singlePoll: state.singlePoll,
  userId: state.user.id
})

const mapDispatch = dispatch => ({
  fetchSinglePoll: (clubId, pollId) =>
    dispatch(fetchSinglePoll(clubId, pollId)),
  sendVotes: (clubId, pollId, votes) =>
    dispatch(sendVotes(clubId, pollId, votes))
})

export default connect(mapState, mapDispatch)(StyledSinglePoll)
