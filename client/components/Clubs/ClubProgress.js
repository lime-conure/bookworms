import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchClubBooks} from '../../store'
import ProgressCharts from '../../components/ProgressCharts'

class ClubProgress extends Component {
  async componentDidMount() {
    const clubId = Number(this.props.match.params.clubId)
    await this.props.fetchClubBooks(clubId)
  }

  render() {
    return this.props.results ? (
      <ProgressCharts results={this.props.results} scope="club" />
    ) : (
      <div>Loading charts...</div>
    )
  }
}

const mapState = state => ({
  results: state.clubBooks
})
const mapDispatch = dispatch => ({
  fetchClubBooks: clubId => dispatch(fetchClubBooks(clubId))
})

export default connect(mapState, mapDispatch)(ClubProgress)
