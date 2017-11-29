import React, { Component } from 'react'

import Item from './Item'
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
  Spin,
} from 'antd'

export default class Loading extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center', margin: '50px' }}>
        <Spin size="large" />
      </div>
    )
  }
}
