import React, { Component } from 'react'

import { Container } from './css'
import { Header, MainPage } from './containers'

class App extends Component {
  render() {
    return (
      <Container>
        <MainPage />
      </Container>
    )
  }
}

export default App
