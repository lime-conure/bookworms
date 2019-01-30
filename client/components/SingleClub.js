import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchSingleClub} from '../store/singleClub'
import {leaveClub} from '../store/clubs'
import {Button, Typography} from '@material-ui/core'

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
    const club = this.props.singleClub
    return (
      <div>
        <Typography variant="h3" gutterBottom>
          {club.name}
        </Typography>
        <Button
          type="button"
          onClick={this.leaveClub}
          color="secondary"
          size="large"
          variant="contained"
        >
          Leave Club
        </Button>
      </div>
    )
  }
}

const mapState = state => ({
  singleClub: state.singleClub
})

const mapDispatch = dispatch => ({
  fetchSingleClub: id => dispatch(fetchSingleClub(id)),
  leaveClub: id => dispatch(leaveClub(id))
})

export default connect(mapState, mapDispatch)(SingleClub)
