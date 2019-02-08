import React, {Component} from 'react'

//Material UI
import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'

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

class AboutUs extends Component {
  render() {
    const {classes} = this.props
    return (
      <Paper className={classes.root} elevation={2}>
        <Typography variant="h6" component="h6">
          "Our goal is to help you organize your reading life"
        </Typography>
      </Paper>
    )
  }
}

const StyledAboutUs = withStyles(styles)(AboutUs)
export default StyledAboutUs
