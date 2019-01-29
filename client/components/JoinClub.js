import React, {Component} from 'react'
import {connect} from 'react-redux'
import Axios from 'axios'

class JoinClubs extends Component {
  constructor() {
    super()
    this.state = {
      clubName: ''
    }
  }
  async componentDidMount() {
    const {data} = await Axios.get(
      `/api/clubs/${this.props.match.params.clubId}/${
        this.props.match.params.hash
      }`
    )
    this.setState({
      clubName: data.name
    })
  }
  render() {
    console.log(this.props, 'props')
    return <p>hi</p>
  }
}
const mapState = state => ({
  joinLink: state.joinLink
})
const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(JoinClubs)
