import React, { Component } from 'react'

import { Container, Row } from 'reactstrap'

import { Item } from '../Item'

export default class ItemList extends Component {
  render() {
    const { loading, error, searchItems, _searchItemsMeta } = this.props.data

    const items = searchItems.edges.map(item => (
      <Item key={item.itemId} {...item} />
    ))

    return <Container>{items}</Container>
  }
}
