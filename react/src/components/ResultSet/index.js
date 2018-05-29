import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'

import { Query, graphql } from 'react-apollo'
import { getItems } from '../../queries'

import ItemList from '../ItemList'

const styles = theme => ({
  marginTop: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 3,
  },
  paper: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 5,
  },
})

class ResultSet extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      classes,
      data,
      data: { loading, networkStatus, error, allItems, loadMoreEntries },
    } = this.props

    if (error) {
      console.log(data)
      console.log(error)
      return <div>ERROR - open console</div>
    }

    if (networkStatus === 6) {
      return (
        <div className={classes.marginTop}>
          <CircularProgress variant="static" value={75} size={100} />
        </div>
      )
    } else if (networkStatus < 7) {
      return (
        <div className={classes.marginTop}>
          <CircularProgress size={100} />
        </div>
      )
    } else if (typeof allItems === 'undefined' || allItems.edges.length === 0) {
      return (
        <Paper className={classes.paper}>
          No items were found. Try again with different options.
        </Paper>
      )
    }

    const {
      pageInfo: { hasNextPage },
    } = allItems

    return <ItemList {...this.props} />
  }
}

export default graphql(getItems, {
  // options: (props) => {}
  options: ({ first, filter }) => ({
    variables: {
      first,
      filter,
    },
    notifyOnNetworkStatusChange: true,
    //fetchPolicy: 'cache-and-network',
  }),
  // This function re-runs every time `data` changes, including after `updateQuery`,
  // meaning our loadMoreEntries function will always have the right cursor
  props: ({ data, ownProps: { updating, ...ownProps } }) => {
    const { loading, cursor, allItems, fetchMore } = data
    console.log('#####', data, updating, ownProps, cursor)
    data.loadMoreEntries = () => {
      console.log(allItems.pageInfo.endCursor)
      return fetchMore({
        query: getItems,
        variables: {
          cursor: allItems.pageInfo.endCursor,
          ...ownProps,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.allItems.edges
          const pageInfo = fetchMoreResult.allItems.pageInfo
          console.log('####')
          return newEdges.length
            ? {
              // Put the new comments at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              allItems: {
                __typename: previousResult.allItems.__typename,
                edges: [...previousResult.allItems.edges, ...newEdges],
                pageInfo,
              },
            }
            : previousResult
        },
      })
    }
    return (data = { data })
  },
})(withStyles(styles)(ResultSet))
