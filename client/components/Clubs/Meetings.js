import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchMeetings, deleteMeeting} from '../../store'
import {formatDateDisplay} from '../../utils'
import {Link} from 'react-router-dom'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 16,
    marginLeft: theme.spacing.unit * 24,
    marginRight: theme.spacing.unit * 24
  },
  button: {
    marginTop: theme.spacing.unit * 4
  },
  icon: {
    color: '#fff'
  },
  pastMeetings: {
    opacity: 0.5
  },
  pastMeetingsHeader: {
    lineHeight: '4.5rem'
  },
  bookImage: {
    maxHeight: 70,
    marginLeft: theme.spacing.unit * 2
  }
})

class Meetings extends Component {
  componentDidMount() {
    const clubId = this.props.match.params.clubId
    this.props.fetchMeetings(clubId)
  }
  renderMeetingList(meetings, classes, isPast) {
    return (
      <List>
        {meetings.map(meeting => (
          <ListItem button key={meeting.id}>
            <ListItemIcon>
              <Icon
                fontSize={isPast ? 'default' : 'large'}
                className={classes.icon}
              >
                event
              </Icon>
            </ListItemIcon>{' '}
            {meeting.book && (
              <ListItemAvatar>
                <img
                  className={classes.bookImage}
                  src={meeting.book.imageUrl}
                  alt={meeting.book.title}
                />
              </ListItemAvatar>
            )}
            <ListItemText component="div">
              <Typography variant="h5">
                {meeting.name}
                {meeting.date ? (
                  <Typography
                    variant="subtitle1"
                    component="span"
                    className={classes.meetingMetadata}
                  >
                    {formatDateDisplay(meeting.date)} at {meeting.location}
                  </Typography>
                ) : (
                  ''
                )}
              </Typography>
            </ListItemText>
            {this.props.userId === meeting.creatorId && (
              <Tooltip placement="left" title="Delete this Meeting">
                <ListItemIcon
                  onClick={() =>
                    this.props.deleteMeeting(this.props.clubId, meeting.id)
                  }
                >
                  <Icon className={classes.icon}>cancel</Icon>
                </ListItemIcon>
              </Tooltip>
            )}
          </ListItem>
        ))}
      </List>
    )
  }

  render() {
    const {classes} = this.props
    const upcomingMeetings = this.props.upcomingMeetings
    const pastMeetings = this.props.pastMeetings
    return (
      <Grid container spacing={40}>
        <Grid item md={6}>
          <Typography variant="h3" component="h3">
            Upcoming Meetings
          </Typography>
          <Divider />
          {upcomingMeetings.length
            ? this.renderMeetingList(upcomingMeetings, classes, false)
            : ''}
          <Link to={`/clubs/${this.props.clubId}/createmeeting`}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
            >
              Create a New Meeting
            </Button>
          </Link>
        </Grid>

        {pastMeetings.length ? (
          <Grid item md={6} className={classes.pastMeetings}>
            <Typography
              variant="h4"
              component="h4"
              className={classes.pastMeetingsHeader}
            >
              Past Meetings
            </Typography>
            <Divider />
            {this.renderMeetingList(pastMeetings, classes, true)}
          </Grid>
        ) : (
          ''
        )}
      </Grid>
    )
  }
}

const StyledMeetings = withStyles(styles)(Meetings)

const mapState = state => ({
  meetings: state.meetings,
  upcomingMeetings: state.meetings.filter(
    meeting => new Date(meeting.date) >= new Date()
  ),
  pastMeetings: state.meetings.filter(
    meeting => new Date(meeting.date) < new Date()
  ),
  userId: state.user.id,
  clubId: state.singleClub.id
})

const mapDispatch = dispatch => ({
  fetchMeetings: clubId => dispatch(fetchMeetings(clubId)),
  deleteMeeting: (clubId, meetingId) =>
    dispatch(deleteMeeting(clubId, meetingId))
})

export default connect(mapState, mapDispatch)(StyledMeetings)
