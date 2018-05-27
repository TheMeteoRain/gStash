import React, { Component } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'

import { graphql } from 'react-apollo'
import { getItems } from '../../queries'

import ItemList from '../ItemList'

class ResultSet extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log(this.props)
    const {
      data,
      data: { loading, networkStatus, error, allItems, loadMoreEntries },
    } = this.props

    if (networkStatus === 6) {
      return <div>Polling!</div>
    } else if (networkStatus < 7) {
      return <CircularProgress size={50} />
    }

    if (error) {
      console.log(data)
      console.log(error)
      return <div>ERROR - open console</div>
    }

    if (allItems.edges.length === 0) {
      return 'empty'
    }

    const {
      pageInfo: { hasNextPage },
    } = allItems

    return (
      <section>
        <ItemList {...this.props} />
        {loading && networkStatus === 3 && 'asd'}
        {!hasNextPage && networkStatus === 7 && 'a'}
      </section>
    )
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
    console.log(data)
    data.loadMoreEntries = () => {
      return fetchMore({
        query: getItems,
        variables: {
          cursor: allItems.pageInfo.endCursor,
          ...ownProps,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.allItems.edges
          const pageInfo = fetchMoreResult.allItems.pageInfo

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
})(ResultSet)
