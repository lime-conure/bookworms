import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import UserBooks from './UserBooks'

import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    flexGrow: 1,
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 16,
    marginLeft: theme.spacing.unit * 24,
    marginRight: theme.spacing.unit * 24
  },
  userInfo: {
    textAlign: 'center'
  },
  bigAvatar: {
    width: 200,
    height: 200,
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
          <Grid item xs={4} className={classes.userInfo}>
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
              className={classes.userEmail}
            >
              {user.email}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <UserBooks />
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
