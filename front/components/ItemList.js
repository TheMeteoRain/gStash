import React, { Component } from "react";

import Item from "./Item";
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
  Tag
} from "antd";

export default class ItemList extends Component {
  render() {
    const {
      data: { loading, error, searchItems, _searchItemsMeta },
      data
    } = this.props;

    const items = searchItems.edges.map(item => <Item {...item} />);

    return <Row gutter={24}>{items}</Row>;
  }
}
