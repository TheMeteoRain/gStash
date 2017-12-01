import React, { Component } from 'react'

import Item from './Item'
import { Row } from 'antd'

export default class ItemList extends Component {
  render() {
    const {
      data: { loading, error, searchItems, _searchItemsMeta },
      data,
    } = this.props

    const items = searchItems.edges.map(item => (
      <Item key={item.itemId} {...item} />
    ))

    return <Row gutter={24}>{items}</Row>
  }
}
