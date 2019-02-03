import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import UserBooks from './UserBooks'

import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import ButtonBase from '@material-ui/core/ButtonBase'

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
  // button: {
  //   marginTop: theme.spacing.unit * 4,
  //   marginBottom: theme.spacing.unit * 4
  // },
  // image: {
  //   width: 200,
  //   height: 200
  // },
  // img: {
  //   margin: 'auto',
  //   display: 'block',
  //   maxWidth: '100%',
  //   maxHeight: '100%'
  //
})

class Profile extends Component {
  render() {
    const {classes} = this.props
    const user = this.props.user
    return (
      <Paper className={classes.root} elevation={2}>
        <Grid container spacing={40} justify="center" alignItems="center">
          {/* <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={user.imageUrl} />
            </ButtonBase>
					</Grid> */}
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
        {/* <div>
          <img src={user.imageUrl} alt={user.fullName} />
          <Typography variant="h3" component="h3" gutterBottom>
            {user.fullName}
          </Typography>
          <Divider />
          <UserBooks />
        </div> */}
      </Paper>
    )
  }
}

const StyledProfile = withStyles(styles)(Profile)

const mapState = state => ({
  user: state.user
})

export default connect(mapState)(StyledProfile)
