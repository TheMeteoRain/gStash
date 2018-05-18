import React, { Component } from 'react'

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
      data: { loading, networkStatus, error, searchItems, loadMoreEntries },
    } = this.props

    if (loading && networkStatus === 1) {
      return 'sss'
    }

    if (error) {
      console.log(error)
      return <div>ERROR - open console</div>
    }

    if (searchItems.edges.length === 0) {
      return 'asd'
    }

    const {
      pageInfo: { hasNextPage },
    } = searchItems

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
  options: props => ({
    variables: {
      ...props,
    },
    notifyOnNetworkStatusChange: true,
    //fetchPolicy: 'cache-and-network',
  }),
  // This function re-runs every time `data` changes, including after `updateQuery`,
  // meaning our loadMoreEntries function will always have the right cursor
  props: ({ data, ownProps: { updating, ...ownProps } }) => {
    const { loading, cursor, searchItems, fetchMore } = data
    console.log(data)
    data.loadMoreEntries = () => {
      return fetchMore({
        query: getItems,
        variables: {
          cursor: searchItems.pageInfo.endCursor,
          ...ownProps,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEdges = fetchMoreResult.searchItems.edges
          const pageInfo = fetchMoreResult.searchItems.pageInfo

          return newEdges.length
            ? {
              // Put the new comments at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              searchItems: {
                __typename: previousResult.searchItems.__typename,
                edges: [...previousResult.searchItems.edges, ...newEdges],
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
