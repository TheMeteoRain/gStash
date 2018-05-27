import React, { Component } from 'react'

import { Item } from '../Item'

export default class ItemList extends Component {
  render() {
    const { loading, error, allItems, _allItemsMeta } = this.props.data

    const items = allItems.edges.map(node => (
      <Item key={node.cursor} {...node} />
    ))

    return <div>{items}</div>
  }
}
