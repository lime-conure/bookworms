import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPolls} from '../store'
import {NavLink, Link} from 'react-router-dom'
import {withStyles} from '@material-ui/core/styles'
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 2
  }
})

class Polls extends Component {
  componentDidMount() {
    this.props.fetchPolls(this.props.match.params.clubId)
  }

  render() {
    const polls = this.props.polls
    const {classes} = this.props
    return (
      <main className={classes.root}>
        <Typography variant="h3" gutterBottom color="primary">
          All Polls
        </Typography>

        <List>
          {polls.map(poll => (
            <ListItem
              button
              component={Link}
              key={poll.id}
              to={`/clubs/${this.props.match.params.clubId}/polls/${poll.id}`}
            >
              <ListItemText>
                <Typography variant="h5">
                  {poll.title}
                  {poll.dueDate ? (
                    <em>&mdash;voting ends on {poll.dueDate}</em>
                  ) : (
                    ''
                  )}
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <Link to={`/clubs/${this.props.match.params.clubId}/polls/create`}>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            size="large"
          >
            Create a New Poll
          </Button>
        </Link>
      </main>
    )
  }
}

const StyledPolls = withStyles(styles)(Polls)

const mapState = state => ({
  polls: state.polls
})

const mapDispatch = dispatch => ({
  fetchPolls: clubId => dispatch(fetchPolls(clubId))
})

export default connect(mapState, mapDispatch)(StyledPolls)
