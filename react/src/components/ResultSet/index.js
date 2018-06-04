import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import { Query } from 'react-apollo'
import { QUERY_ITEMS } from '../../queries'

import ItemList from '../ItemList'

/** Apollo network status constants */
import { APOLLO } from '../../constants'

const styles = theme => ({
  loading: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 3,
  },
})

const ResultSet = ({ classes, filter, first }) => (
  <Query
    query={QUERY_ITEMS}
    variables={{ filter, first }}
    notifyOnNetworkStatusChange
  >
    {({ networkStatus, loading, error, fetchMore, data }) => {
      if (loading && networkStatus === APOLLO.NETWORK_STATUS.LOADING)
        return (
          <div className={classes.loading}>
            <CircularProgress size={100} />
          </div>
        )
      if (error) {
        console.log(error)
        return `Error! ${error.message}`
      }

      const fetchingMore =
        networkStatus === APOLLO.NETWORK_STATUS.FETCH_MORE ? true : false

      const handleLoadMore = () => {
        fetchMore({
          variables: {
            filter,
            first,
            cursor: data.allItems.pageInfo.endCursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            const next = fetchMoreResult.allItems

            return next.edges.length
              ? {
                // Put the new items at the end of the list and update `pageInfo`
                // so we have the new `endCursor` and `hasNextPage` values
                allItems: {
                  __typename: prev.allItems.__typename,
                  edges: [...prev.allItems.edges, ...next.edges],
                  pageInfo: next.pageInfo,
                  totalCount: next.totalCount,
                },
              }
              : prev
          },
        })
      }

      return (
        <ItemList
          allItems={data.allItems}
          onLoadMore={handleLoadMore}
          loading={fetchingMore}
        />
      )
    }}
  </Query>
)

export default withStyles(styles)(ResultSet)
