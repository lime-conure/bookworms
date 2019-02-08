import React, {Component} from 'react'
import {connect} from 'react-redux'
import ProgressCharts from './ProgressCharts'

class UserProgress extends Component {
  render() {
    return this.props.results.length ? (
      <ProgressCharts results={this.props.results} scope="user" />
    ) : (
      <div>Loading progress...</div>
    )
  }
}

const mapState = state => ({
  results: state.user.books
})

export default connect(mapState)(UserProgress)
