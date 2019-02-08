import React, {Component} from 'react'
import {connect} from 'react-redux'
import {createNewClub, fetchClubs} from '../../store/clubs'
import axios from 'axios'
import socket from '../../socket'

import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Textfield from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 16,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '95%',
    // md = 960px or larger
    [theme.breakpoints.up('md')]: {
      width: '70%',
      padding: theme.spacing.unit * 8
    }
  },
  button: {
    marginTop: theme.spacing.unit * 4
  },
  form: {
    marginTop: theme.spacing.unit * 4
  },
  clubsHeader: {
    // 960px or smaller
    [theme.breakpoints.down('md')]: {
      fontSize: '2.5rem',
      lineHeight: '3.75rem'
    }
  }
})

export class CreateClub extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.createClub = this.createClub.bind(this)
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  async createClub(evt) {
    evt.preventDefault()
    try {
      const {name} = this.state
      const newClub = {name, userId: this.props.userId}
      const club = await axios.post('/api/clubs/create', newClub)
      this.props.fetchClubs()
      socket.emit('JOIN', club.data.id)
      this.props.history.push(`/clubs/${club.data.id}/books`)
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const {classes} = this.props
    return (
      <Paper className={classes.root} elevation={2}>
        <Typography
          variant="h3"
          component="h3"
          gutterBottom
          className={classes.clubsHeader}
        >
          Create a New Book Club
        </Typography>
        <form className={classes.form}>
          <Grid
            container
            spacing={24}
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={8}>
              <Textfield
                name="name"
                label="Name of Your Club"
                value={this.state.name}
                onChange={this.handleChange}
                variant="filled"
                type="text"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                onClick={this.createClub}
                type="submit"
                color="secondary"
                variant="contained"
                size="large"
              >
                Create Club
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    )
  }
}

const StyledCreateClub = withStyles(styles)(CreateClub)

const mapState = state => ({
  userId: state.user.id
})

const mapDispatch = dispatch => ({
  createNewClub: newClub => dispatch(createNewClub(newClub)),
  fetchClubs: () => dispatch(fetchClubs())
})

export default connect(mapState, mapDispatch)(StyledCreateClub)
