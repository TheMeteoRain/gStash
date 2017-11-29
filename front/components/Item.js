import React, { Component } from 'react'

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

export default class Item extends Component {
  renderRequirements(requirements) {
    if (!requirements) return

    return requirements.map(requirement => {
      const { requirementName, requirementValue, requirementKey } = requirement
      return (
        <span key={requirementKey}>
          {requirementName}: {requirementValue},
        </span>
      )
    })
  }

  renderProperties(properties) {
    if (!properties) return

    return properties.map(property => {
      const { propertyName, propertyValue1, propertyKey } = property
      return (
        <Tag key={propertyKey} color="purple">
          {propertyName}: {propertyValue1}
        </Tag>
      )
    })
  }

  renderMods(mods) {
    if (!mods) return

    return mods.map(mod => {
      const {
        modName,
        modValue1,
        modValue2,
        modValue3,
        modValue4,
        modKey,
      } = mod

      let i = 0
      const name = modName.replace(/#/g, () => {
        i++
        if (i == 1) return modValue1
        if (i == 2) return modValue2
        if (i == 3) return modValue3
        if (i == 4) return modValue4
      })

      return (
        <Tag key={modKey} color="green">
          {name}
        </Tag>
      )
    })
  }

  render() {
    const {
      name,
      typeLine,
      accountName,
      icon,
      ilvl,
      price,
      nodeId,
      requirementsByItemId: { nodes: requirements },
      propertiesByItemId: { nodes: properties },
      modsByItemId: { nodes: mods },
    } = this.props.node

    return (
      <Col key={nodeId} span={24}>
        <Card title={`${typeLine} - ${ilvl}`} extra={<a href="#">More</a>}>
          <Row style={{ textAlign: 'center' }}>
            <Col span={4}>
              <img src={icon} />
            </Col>
            <Col span={12}>
              Item Level: {ilvl}
              <Row>
                <Col>
                  Requires {this.renderRequirements(requirements)}
                </Col>
                <Col>
                  {this.renderMods(mods)}
                </Col>
              </Row>

            </Col>
            <Col span={6}>
              {this.renderProperties(properties)}
            </Col>
          </Row>

          <p>
            IGN: {accountName}
            <a
              href={`https://www.pathofexile.com/account/view-profile/${accountName}`}
            >
              Profile
            </a>
          </p>
        </Card>
      </Col>
    )
  }
}
