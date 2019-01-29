import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchSingleClub} from '../store/singleClub'

export class SingleClub extends Component {
  constructor(props) {
    super(props)
    console.log(this.props, '****')
    this.id = Number(this.props.club.id)
  }

  componentDidMount() {
    console.log(this.props, 'THIS.PROPS')
    this.props.fetchSingleClub(this.id)
  }
  render() {
    const club = this.props.club
    return (
      <div>
        <h2>{club.name}</h2>
      </div>
    )
  }
}

const mapState = state => ({
  singleClub: state.singleClub
})

const mapDispatch = dispatch => ({
  fetchSingleClub: id => dispatch(fetchSingleClub(id))
})

export default connect(mapState, mapDispatch)(SingleClub)
