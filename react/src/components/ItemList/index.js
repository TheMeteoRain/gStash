import React from 'react'
import PropTypes from 'prop-types'

/** Apollo */
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

/** MUI */
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

/** Components */
import { Item } from '../Item'

const styles = theme => ({
  paper: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 5,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
  },
  loading: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 3,
  },
})

const ItemList = ({ classes, allItems = [], onLoadMore, loading }) => {
  if (allItems && allItems.edges && allItems.edges.length) {
    const { hasNextPage } = allItems.pageInfo

    const items = allItems.edges.map(node => (
      <article key={node.cursor}>
        <Item {...node} />
      </article>
    ))

    return (
      <React.Fragment>
        {items}
        <Button
          onClick={onLoadMore}
          fullWidth
          disabled={hasNextPage ? false : true}
          variant="raised"
          color={'secondary'}
          className={classes.button}
        >
          Load more
        </Button>
        {loading && (
          <div className={classes.loading}>
            <CircularProgress size={100} />
          </div>
        )}
      </React.Fragment>
    )
  }

  return (
    <Paper className={classes.paper}>
      No items were found. Try again with different options.
    </Paper>
  )
}

ItemList.protoTypes = {
  allItems: PropTypes.arrayOf(Item).isRequired,
  onLoadMore: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}

export default withStyles(styles)(ItemList)
