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
import Grid from '@material-ui/core/Grid'

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
  },
  pastPolls: {
    opacity: 0.5
  },
  pastPollsHeader: {
    lineHeight: '4.5rem'
  }
})

class Polls extends Component {
  componentDidMount() {
    this.props.fetchPolls(this.props.match.params.clubId)
  }

  renderPollList(polls, classes, isActive) {
    return (
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
                    Voting {isActive ? 'ends' : 'ended'} on{' '}
                    {formatDateDisplay(poll.dueDate, false)}
                  </Typography>
                ) : (
                  ''
                )}
              </Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    )
  }

  render() {
    const {classes} = this.props
    const activePolls = this.props.activePolls
    const pastPolls = this.props.pastPolls

    return (
      <Grid container spacing={40}>
        <Grid item xs={6}>
          <Typography variant="h3" component="h3">
            Active Polls
          </Typography>
          <Divider />
          {this.renderPollList(activePolls, classes, true)}
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
        </Grid>
        <Grid item xs={6} className={classes.pastPolls}>
          <Typography
            variant="h4"
            component="h4"
            className={classes.pastPollsHeader}
          >
            Past Polls
          </Typography>
          <Divider />
          {this.renderPollList(pastPolls, classes, false)}
        </Grid>
      </Grid>
    )
  }
}

const StyledPolls = withStyles(styles)(Polls)

const mapState = state => ({
  polls: state.polls,
  activePolls: state.polls.filter(poll => new Date(poll.dueDate) >= new Date()),
  pastPolls: state.polls.filter(poll => new Date(poll.dueDate) < new Date())
})

const mapDispatch = dispatch => ({
  fetchPolls: clubId => dispatch(fetchPolls(clubId))
})

export default connect(mapState, mapDispatch)(StyledPolls)
