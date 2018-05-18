import React, { Component } from 'react'

import { Header as HeaderComponent } from '../../css'

import { Row, Col } from 'react-flexa'

class Header extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <HeaderComponent>
        <Row style={{ border: '1px solid black' }}>
          <Col xs={12}>HELLO</Col>
        </Row>
      </HeaderComponent>
    )
  }
}

export default Header
