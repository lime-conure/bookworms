import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPolls, deletePoll} from '../store'
import {Link} from 'react-router-dom'
import {formatDateDisplay} from '../utils'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Icon from '@material-ui/core/Icon'
import Divider from '@material-ui/core/Divider'
import Tooltip from '@material-ui/core/Tooltip'

const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit * 4
  },
  icon: {
    color: '#fff'
  },
  dueDate: {
    display: 'inline',
    paddingLeft: theme.spacing.unit * 2
  }
})

class Polls extends Component {
  componentDidMount() {
    this.props.fetchPolls(this.props.match.params.clubId)
  }

  render() {
    const {classes} = this.props
    const polls = this.props.polls
    return (
      <div>
        <Typography variant="h3" component="h3">
          Polls
        </Typography>
        <Divider />

        <List>
          {polls.map(poll => (
            <ListItem
              button
              component={Link}
              key={poll.id}
              to={`/clubs/${this.props.match.params.clubId}/polls/${poll.id}`}
            >
              <ListItemIcon>
                <Icon className={classes.icon}>poll</Icon>
              </ListItemIcon>
              <ListItemText component="div">
                <Typography variant="h5">
                  {poll.title}
                  {poll.dueDate ? (
                    <Typography
                      variant="subtitle1"
                      component="span"
                      className={classes.dueDate}
                    >
                      Voting ends on {formatDateDisplay(poll.dueDate, false)}
                    </Typography>
                  ) : (
                    ''
                  )}
                </Typography>
              </ListItemText>
              {this.props.userId === poll.creatorId && (
                <Tooltip placement="left" title="Delete this Poll">
                  <ListItemIcon
                    onClick={() =>
                      this.props.deleteMeeting(this.props.clubId, poll.id)
                    }
                  >
                    <Icon className={classes.icon}>cancel</Icon>
                  </ListItemIcon>
                </Tooltip>
              )}
            </ListItem>
          ))}
        </List>
        <Link to={`/clubs/${this.props.match.params.clubId}/createpoll`}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
          >
            Create a New Poll
          </Button>
        </Link>
      </div>
    )
  }
}

const StyledPolls = withStyles(styles)(Polls)

const mapState = state => ({
  polls: state.polls,
  userId: state.user.id,
  clubId: state.singleClub.id
})

const mapDispatch = dispatch => ({
  fetchPolls: clubId => dispatch(fetchPolls(clubId)),
  deletePoll: (clubId, pollId) => dispatch(deletePoll(clubId, pollId))
})

export default connect(mapState, mapDispatch)(StyledPolls)
