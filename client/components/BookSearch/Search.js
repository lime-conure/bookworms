import React, {Component} from 'react'
import Axios from 'axios'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'

const apiKey = 'jrAzhFY1JP1FdDk1vp7Zg'

const styles = theme => ({
  spinner: {
    marginRight: theme.spacing.unit
  }
})

class Search extends Component {
  state = {
    searchText: '',
    error: '',
    fetchingData: false
  }

  onTextChange = e => {
    this.setState({
      searchText: e.target.value
    })
  }

  onButtonClick = e => {
    e.preventDefault()
    this.setState({
      fetchingData: true
    })
    const {searchText} = this.state
    const requestUri =
      `https://cors-anywhere.herokuapp.com/` +
      `https://www.goodreads.com/search/index.xml?key=${apiKey}&q=${searchText}`

    Axios.get(requestUri)
      .then(res => {
        this.parseXMLResponse(res.data)
      })
      .catch(error => {
        this.setState({
          error: error.toString(),
          fetchingData: false
        })
      })
  }

  // parse string xml received from goodreads api
  parseXMLResponse = response => {
    const parser = new DOMParser()
    const XMLResponse = parser.parseFromString(response, 'application/xml')
    const parseError = XMLResponse.getElementsByTagName('parsererror')

    if (parseError.length) {
      this.setState({
        error: 'There was an error fetching results.',
        fetchingData: false
      })
    } else {
      const XMLresults = new Array(...XMLResponse.getElementsByTagName('work'))
      const searchResults = XMLresults.map(result => this.XMLToJson(result))
      this.setState({fetchingData: false}, () => {
        this.props.setResults(searchResults)
      })
    }
  }

  // Function to convert simple XML document into JSON.
  // Loops through each child and saves it as key, value pair
  // if there are sub-children, call the same function recursively on its children.
  XMLToJson = XML => {
    const allNodes = new Array(...XML.children)
    const jsonResult = {}
    allNodes.forEach(node => {
      if (node.children.length) {
        jsonResult[node.nodeName] = this.XMLToJson(node)
      } else {
        jsonResult[node.nodeName] = node.innerHTML
      }
    })
    return jsonResult
  }

  render() {
    const {classes} = this.props
    return (
      <Grid container spacing={24} justify="space-between" alignItems="center">
        <Grid item xs={8}>
          <TextField
            type="text"
            label="Search Books By title, author, or ISBN..."
            name="searchText"
            className={classes.search}
            onChange={this.onTextChange}
            value={this.state.searchText}
            variant="filled"
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            disabled={!this.state.searchText}
            onClick={e => this.onButtonClick(e)}
            variant="contained"
            color="secondary"
            size="large"
          >
            {this.state.fetchingData ? (
              <CircularProgress
                size={20}
                color="inherit"
                className={classes.spinner}
              />
            ) : (
              ''
            )}Search
          </Button>
        </Grid>
      </Grid>
    )
  }
}

Search.propTypes = {
  //results: PropTypes.array,
  setResults: PropTypes.func
  //expandBook: PropTypes.func
}

export default withStyles(styles)(Search)
