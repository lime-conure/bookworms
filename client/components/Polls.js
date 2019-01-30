import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPolls} from '../store'
import {NavLink, Link} from 'react-router-dom'
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core'

class Polls extends Component {
  componentDidMount() {
    this.props.fetchPolls(this.props.match.params.clubId)
  }

  render() {
    const polls = this.props.polls
    return (
      <div>
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
      </div>
    )
  }
}

const mapState = state => ({
  polls: state.polls
})

const mapDispatch = dispatch => ({
  fetchPolls: clubId => dispatch(fetchPolls(clubId))
})

export default connect(mapState, mapDispatch)(Polls)
