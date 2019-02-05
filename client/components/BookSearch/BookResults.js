import React, {Component} from 'react'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Tooltip from '@material-ui/core/Tooltip'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 2,
    width: '100%',
    maxWidth: 720,
    height: 350
  },
  gridListTile: {
    cursor: 'pointer'
  }
})

class BookResults extends Component {
  render() {
    const {type, results, classes} = this.props
    if (results.length) {
      return (
        <div className={classes.root}>
          <GridList cellHeight={240} cols={4} className={classes.gridList}>
            {results.map(bookResult => (
              <GridListTile
                cols={1}
                key={bookResult.best_book.id}
                className={classes.gridListTile}
                onClick={e => {
                  this.props.addBook(e, bookResult, type)
                  // set search results to a empty after adding book
                  this.props.setResults([])
                }}
              >
                <img
                  src={bookResult.best_book.image_url}
                  alt={bookResult.best_book.title}
                />

                <GridListTileBar
                  title={
                    <Tooltip placement="top" title={bookResult.best_book.title}>
                      <div>{bookResult.best_book.title}</div>
                    </Tooltip>
                  }
                  subtitle={<span>by: {bookResult.best_book.author.name}</span>}
                  actionIcon={
                    <IconButton>
                      <Icon>add_circle</Icon>
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      )
    } else {
      return <div />
    }
  }
}

export default withStyles(styles)(BookResults)
