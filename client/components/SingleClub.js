import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchSingleClub, leaveClub} from '../store/'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit * 4
  }
})
export class SingleClub extends Component {
  constructor(props) {
    super(props)
    this.leaveClub = this.leaveClub.bind(this)
  }
  componentDidMount() {
    const singleClubId = Number(this.props.match.params.clubId)
    this.props.fetchSingleClub(singleClubId)
  }
  leaveClub() {
    this.props.leaveClub(this.props.singleClub.id)
  }
  render() {
    const {classes} = this.props
    const club = this.props.singleClub
    return (
      <div>
        <Typography variant="h3" component="h3">
          {club.name}
        </Typography>
        <Divider />
        <Button
          type="button"
          className={classes.button}
          onClick={this.leaveClub}
          color="primary"
          size="large"
          variant="contained"
        >
          Leave Club
        </Button>
      </div>
    )
  }
}

const StyledSingleClub = withStyles(styles)(SingleClub)

const mapState = state => ({
  singleClub: state.singleClub
})

const mapDispatch = dispatch => ({
  fetchSingleClub: id => dispatch(fetchSingleClub(id)),
  leaveClub: id => dispatch(leaveClub(id))
})

export default connect(mapState, mapDispatch)(StyledSingleClub)
