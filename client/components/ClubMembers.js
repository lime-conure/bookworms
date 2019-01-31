import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchClubMembers} from '../store'
import {Button, Typography} from '@material-ui/core'

export class ClubMembers extends Component {
  componentDidMount() {
    const clubId = Number(this.props.match.params.clubId)
    this.props.fetchClubMembers(clubId)
  }

  render() {
    const members = this.props.clubMembers
    return (
      <div>
        <Typography variant="h2" gutterBottom>
          {members.length}
        </Typography>
      </div>
    )
  }
}

const mapState = state => ({
  members: state.clubMembers
})

const mapDispatch = dispatch => ({
  fetchClubMembers: clubId => dispatch(fetchClubMembers(clubId))
})

export default connect(mapState, mapDispatch)(ClubMembers)
