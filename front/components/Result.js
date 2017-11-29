import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import ItemList from './ItemList'
import Loading from './Loading'
import AlertMessage from './AlertMessage'
import queries from '../queries'

import {
  Form,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  Slider,
  Button,
  LocaleProvider,
  Col,
  Row,
  Card,
  Tag,
} from 'antd'

class Result extends Component {
  constructor(props) {
    super(props)

    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll(e) {
    const {
      data: { networkStatus, loadMoreEntries, searchItems },
    } = this.props
    const { pageInfo: { hasNextPage } } = searchItems
    const scroll = window.scrollY + document.body.clientHeight
    const height = document.body.scrollHeight

    if (scroll >= height && networkStatus !== 3 && hasNextPage) {
      loadMoreEntries()
    }
  }

  render() {
    console.log(this.props)
    const {
      data,
      data: { loading, networkStatus, error, searchItems, loadMoreEntries },
    } = this.props

    if (loading && networkStatus === 1) {
      return <Loading />
    }

    if (error) {
      console.log(error)
      return <div>ERROR - open console</div>
    }

    if (searchItems.edges.length === 0) {
      return <AlertMessage notFound />
    }

    const { pageInfo: { hasNextPage } } = searchItems

    return (
      <section>
        <ItemList {...this.props} />
        {loading && networkStatus === 3 && <Loading />}
        {!hasNextPage && networkStatus === 7 && <AlertMessage notNew />}
      </section>
    )
  }
}

export default graphql(queries.getItems, {
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

    data.loadMoreEntries = () => {
      return fetchMore({
        query: queries.getItems,
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
})(Result)
