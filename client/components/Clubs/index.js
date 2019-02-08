import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchClubs, fetchMessages, leaveClub} from '../../store'
import {Link} from 'react-router-dom'

import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 8,
    marginTop: theme.spacing.unit * 16,
    marginLeft: theme.spacing.unit * 36,
    marginRight: theme.spacing.unit * 36
  },
  button: {
    marginTop: theme.spacing.unit * 4
  },
  icon: {
    color: '#fff'
  }
})

class Clubs extends Component {
  constructor(props) {
    super(props)
    this.leaveClub = this.leaveClub.bind(this)
  }

  componentDidMount() {
    this.props.fetchClubs()
    this.props.fetchMessages()
  }
  leaveClub(id) {
    this.props.leaveClub(id)
  }
  render() {
    const {classes} = this.props
    const clubs = this.props.clubs
    return (
      <Paper className={classes.root} elevation={2}>
        <div>
          <Typography variant="h2" component="h2" gutterBottom>
            Your Book Clubs
          </Typography>

          <List>
            <Divider />
            {clubs.map(club => (
              <ListItem
                button
                component={Link}
                key={club.id}
                to={`/clubs/${club.id}/books`}
              >
                <ListItemIcon className={classes.icon}>
                  <Icon>group</Icon>
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="h5" component="h5">
                    {club.name}
                  </Typography>
                </ListItemText>

                <Button
                  type="submit"
                  onClick={() => this.leaveClub(club.id)}
                  className="leaveClub"
                  color="primary"
                  variant="contained"
                >
                  Leave Club
                </Button>
              </ListItem>
            ))}
            <Divider />
          </List>
        </div>

        <Link to="/createclub">
          <Button
            type="button"
            color="secondary"
            variant="contained"
            size="large"
            className={classes.button}
          >
            Create a New Club
          </Button>
        </Link>
      </Paper>
    )
  }
}

const StyledClubs = withStyles(styles)(Clubs)

const mapState = state => ({
  clubs: state.clubs,
  messages: state.messages
})

const mapDispatch = dispatch => ({
  fetchClubs: () => dispatch(fetchClubs()),
  leaveClub: id => dispatch(leaveClub(id)),
  fetchMessages: () => dispatch(fetchMessages())
})

export default connect(mapState, mapDispatch)(StyledClubs)
