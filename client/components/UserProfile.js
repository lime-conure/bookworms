import React, {Component} from 'react'
import {connect} from 'react-redux'
import UserBooks from './UserBooks'
import UserProgress from './UserProgress'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
const styles = theme => ({
  root: {
    // ...theme.mixins.gutters(),
    flexGrow: 1,
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 16,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '95%',
    // md = 960px or larger
    [theme.breakpoints.up('md')]: {
      width: '70%'
    }
  },
  userInfo: {
    textAlign: 'center'
  },
  bigAvatar: {
    width: '100%',
    height: '100%',
    maxWidth: 200,
    maxHeight: 200,
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  userEmail: {
    fontWeight: 300,
    fontSize: '18px'
  }
})

class Profile extends Component {
  constructor() {
    super()
    this.state = {
      progress: false
    }
    this.toggleProgress = this.toggleProgress.bind(this)
  }

  toggleProgress() {
    this.setState({progress: !this.state.progress})
  }

  render() {
    const {classes} = this.props
    const user = this.props.user
    return (
      <Paper className={classes.root} elevation={2}>
        <Grid
          container
          spacing={32}
          justify="space-between"
          alignItems="flex-start"
        >
          <Grid item md={3} className={classes.userInfo}>
            <Avatar
              alt={user.fullName}
              src={user.imageUrl}
              className={classes.bigAvatar}
            />

            <Typography variant="h6" component="h6">
              {user.fullName}
            </Typography>
            <Typography
              variant="subtitle1"
              component="p"
              noWrap
              className={classes.userEmail}
            >
              {user.email}
            </Typography>
            <Button
              style={{marginTop: 20}}
              variant="outlined"
              size="small"
              color="secondary"
              onClick={this.toggleProgress}
            >
              {this.state.progress ? 'Hide progress' : 'Show progress'}
            </Button>
          </Grid>
          <Grid item md={9}>
            <UserBooks />
            {this.state.progress ? <UserProgress /> : ''}
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

const StyledProfile = withStyles(styles)(Profile)

const mapState = state => ({
  user: state.user
})

export default connect(mapState)(StyledProfile)
