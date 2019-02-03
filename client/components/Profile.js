import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import UserBooks from './UserBooks'

import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
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
  bigAvatar: {
    margin: 60,
    width: 150,
    height: 150
  }
})

class Profile extends Component {
  render() {
    const {classes} = this.props
    const user = this.props.user
    return (
      <Paper className={classes.root} elevation={2}>
        <Grid container spacing={40} justify="center" alignItems="center">
          <Avatar
            alt={user.fullName}
            src={user.imageUrl}
            className={classes.bigAvatar}
          />
          <Grid item>
            <Typography gutterBottom variant="h5">
              {user.fullName}
            </Typography>
            <Typography gutterBottom variant="h5">
              {user.email}
            </Typography>
          </Grid>
        </Grid>
        <Divider />
        <UserBooks />
      </Paper>
    )
  }
}

const StyledProfile = withStyles(styles)(Profile)

const mapState = state => ({
  user: state.user
})

export default connect(mapState)(StyledProfile)
