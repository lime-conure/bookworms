import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPolls} from '../store'
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
    const now = new Date()
    if (polls.length) {
      const pastPolls = polls.filter(poll => new Date(poll.dueDate) < now)
      console.log('polls: ', polls)
      console.log('now: ', now)
      console.log('past polls: ', pastPolls)
    }

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
  pastPolls: state.polls.filter(poll => new Date(poll.dueDate) < new Date())
})

const mapDispatch = dispatch => ({
  fetchPolls: clubId => dispatch(fetchPolls(clubId))
})

export default connect(mapState, mapDispatch)(StyledPolls)
