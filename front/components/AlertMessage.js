import React, { Component } from 'react'

import Item from './Item'
import { Alert } from 'antd'

export default class AlertMessage extends Component {
  notFound() {
    return (
      <Alert
        message="Not found"
        description="No results could be found with the given search terms. Search is too vague or there were no results. Try to change search terms and try again."
        type="info"
      />
    )
  }

  notNew() {
    return (
      <Alert
        message="No new items"
        description="There is no more items for the given search criterias."
        type="info"
      />
    )
  }

  render() {
    const { notFound, notNew } = this.props

    if (notFound) {
      return this.notFound()
    }

    if (notNew) {
      return this.notNew()
    }
  }
}
