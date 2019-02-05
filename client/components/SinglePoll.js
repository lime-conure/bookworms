import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchSinglePoll, sendVotes} from '../store'
import {formatDateDisplay} from '../utils'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Icon from '@material-ui/core/Icon'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'

const styles = theme => ({
  poll: {
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3
  },
  headerIcon: {
    marginRight: theme.spacing.unit
  },
  bookImage: {
    width: 80
  },
  checkmark: {
    marginRight: theme.spacing.unit
  },
  pollNotes: {
    marginTop: theme.spacing.unit * 3
  }
})

export class SinglePoll extends Component {
  constructor(props) {
    super(props)
    // local state for keeping track of which checkbox options are selected
    this.state = {
      votes: [],
      justVoted: false
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
    this.setState({justVoted: true})
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
        : type === 'Date & Time' ? 'dateTime' : 'location'
    if (options && options.length) {
      return (
        <Paper elevation={2} className={classes.poll}>
          <Typography variant="h6" id="tableTitle" gutterBottom>
            {type} Options
          </Typography>
          <Table>
            <TableHead />
            <TableBody>
              <TableRow>
                {options.map(optionObj => (
                  <TableCell key={optionObj.option.id}>
                    <strong>
                      {type === 'Book' ? (
                        <Button
                          target="_blank"
                          href={`https://www.goodreads.com/book/show/${
                            optionObj.option.book.goodReadsId
                          }`}
                        >
                          <Tooltip title="View on Goodreads" placement="right">
                            <img
                              src={optionObj.option.book.imageUrl}
                              alt={optionObj.option.book.title}
                              className={classes.bookImage}
                            />
                          </Tooltip>
                        </Button>
                      ) : (
                        ''
                      )}

                      {type === 'Date & Time' &&
                        formatDateDisplay(optionObj.option[columnName])}
                      {type === 'Location' && optionObj.option[columnName]}
                    </strong>
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
                      defaultChecked={this.optionIsChecked(optionObj)}
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
        <div>
          <Typography variant="h3" component="h3">
            {poll.title}
          </Typography>
          <Divider />

          <Typography
            variant="subtitle1"
            gutterBottom
            className={classes.pollNotes}
          >
            {poll.notes}
          </Typography>

          {poll.dueDate ? (
            <Typography variant="subtitle2" gutterBottom color="secondary">
              Voting ends on {poll.dueDate.slice(0, 10)}
            </Typography>
          ) : (
            ''
          )}

          <form onSubmit={this.handleSubmit}>
            {this.renderPoll(bookOptions, 'Book', classes)}
            {this.renderPoll(timeOptions, 'Date & Time', classes)}
            {this.renderPoll(locationOptions, 'Location', classes)}
            <br />
            {allOptions.length ? (
              <Grid
                container
                className={classes.root}
                spacing={24}
                justify="flex-start"
                alignItems="center"
              >
                <Grid item>
                  <Button
                    size="large"
                    color="secondary"
                    variant="contained"
                    type="submit"
                  >
                    {this.state.justVoted && (
                      <Icon color="inherit" className={classes.checkmark}>
                        check_circle
                      </Icon>
                    )}
                    Vote
                  </Button>
                </Grid>
                {this.state.justVoted && (
                  <Typography variant="body2" component="p" color="secondary">
                    <Grid
                      container
                      item
                      spacing={8}
                      justify="flex-end"
                      alignItems="stretch"
                    >
                      <Grid item>You voted!</Grid>
                    </Grid>
                  </Typography>
                )}
              </Grid>
            ) : (
              ''
            )}
          </form>
        </div>
      )
    } else {
      return <div className={classes.root}>Loading...</div>
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
