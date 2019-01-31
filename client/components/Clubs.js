import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchClubs} from '../store'
import {leaveClub} from '../store/clubs'
import {Link} from 'react-router-dom'

import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 16,
    marginLeft: theme.spacing.unit * 16,
    marginRight: theme.spacing.unit * 16
  },
  button: {
    marginTop: theme.spacing.unit * 4
  }
})

class Clubs extends Component {
  constructor(props) {
    super(props)
    this.leaveClub = this.leaveClub.bind(this)
  }

  componentDidMount() {
    this.props.fetchClubs()
  }
  leaveClub(id) {
    this.props.leaveClub(id)
  }
  render() {
    const {classes} = this.props
    const clubs = this.props.clubs
    return (
      <Paper className={classes.root} elevation={1}>
        <div>
          <Typography variant="h2" component="h2" gutterBottom>
            Your Clubs
          </Typography>
          <Divider />
          <List>
            {clubs.map(club => (
              <ListItem
                button
                component={Link}
                key={club.id}
                to={`/clubs/${club.id}`}
              >
                <ListItemText>
                  <Typography variant="h5">{club.name}</Typography>
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
  clubs: state.clubs
})

const mapDispatch = dispatch => ({
  fetchClubs: () => dispatch(fetchClubs()),
  leaveClub: id => dispatch(leaveClub(id))
})

export default connect(mapState, mapDispatch)(StyledClubs)
