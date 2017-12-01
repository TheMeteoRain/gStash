import React, { Component } from 'react'

import Colors from './Colors'
import { Col, Row, Card, Tag, Button } from 'antd'
import { propType } from 'graphql-anywhere/lib/src/utilities'

const formatColor = (value, valueType) => {
  return <span style={{ color: Colors.ValueTypes[valueType] }}>{value}</span>
}

const REQUIREMENT_ORDER = ['Level', 'Str', 'Dex', 'Int']

const formatValue = (
  name,
  displayMode,
  value1,
  value2 = null,
  valueType1,
  valueType2 = null,
  last = false,
  comma = false,
  colon = false
) => {
  // VALUE NAME
  if (last && displayMode === 1)
    return (
      <span>
        {formatColor(value1, valueType1)} {formatColor(name, 0)}
      </span>
    )
  // NAME[ VALUE][, ]
  if (!value1 && displayMode === 0)
    return (
      <span>
        {formatColor(name, 0)}
        {' '}
        {value1 ? formatColor(value1, valueType1) : ''}
        {comma ? ', ' : ''}
      </span>
    )

  if (displayMode === 0) {
    // NAME[:][ ][VALUE][,]
    return (
      <span>
        {formatColor(name, 0)}
        {colon ? ':' : ''}
        {value1 ? ' ' : ''}
        {value1 ? formatColor(value1, valueType1) : ''}
        {comma ? ',' : ''}
      </span>
    )
  }
  if (displayMode === 1) {
    // VALUE NAME[, ]
    return (
      <span>
        {' '}
        {formatColor(value1, valueType1)}
        {' '}
        {formatColor(name, 0)}
        {comma ? ', ' : ''}
      </span>
    )
  }
  if (displayMode === 3) {
    // NAME 10 NAME 11
    // formatColor(value2, valueType2)
    return (
      <span>
        {name.replace('%0', value1).replace('%1', value2)}
      </span>
    )
  }
}

export default class Item extends Component {
  constructor(props) {
    super(props)

    this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this)
  }
  renderRequirements(requirements) {
    if (requirements.length === 0) return

    // APOLLO IS IMMUTABLE DO THIS
    const b = Array.of(...requirements)

    const a = b.sort(
      (a, b) =>
        REQUIREMENT_ORDER.indexOf(a.requirementName) -
        REQUIREMENT_ORDER.indexOf(b.requirementName)
    )

    const requirementList = a.map((requirement, index, array) => {
      if (!requirement) return
      const {
        requirementName,
        requirementValue,
        requirementValueType,
        requirementKey,
        requirementDisplayMode,
      } = requirement

      const last = array.length - 1 > index ? false : true

      const name = formatValue(
        requirementName,
        requirementDisplayMode,
        requirementValue,
        null,
        requirementValueType,
        null,
        last,
        true
      )

      return (
        <span key={requirementKey}>
          {name}
        </span>
      )
    })

    return (
      <div>
        {requirementList.length > 0 ? 'Requires' : ''}
        {' '}
        {requirementList}
        <hr />
      </div>
    )
  }

  renderProperties(properties) {
    if (properties.length === 0) return

    const propertiesList = properties.map((property, index, array) => {
      const {
        propertyName,
        propertyValue1,
        propertyValue2,
        propertyKey,
        propertyDisplayMode,
      } = property
      const propertyValueTypes = JSON.parse(property.propertyValueTypes)
      const last = array.length - 1 > index ? false : true

      const name = formatValue(
        propertyName,
        propertyDisplayMode,
        propertyValue1,
        propertyValue2,
        propertyValueTypes[0],
        propertyValueTypes[1],
        last,
        false,
        true
      )

      return (
        <div key={propertyKey}>
          {name}
        </div>
      )
    })

    return <div>{propertiesList}</div>
  }

  renderMods(mods) {
    if (mods.length === 0) return

    const modsList = mods.map(mod => {
      const { modValue1, modValue2, modValue3, modValue4, modKey } = mod

      let i = 0
      const modName = mod.modName.replace(/#/g, () => {
        i++
        if (i == 1) return modValue1
        if (i == 2) return modValue2
        if (i == 3) return modValue3
        if (i == 4) return modValue4
      })

      return (
        <div key={modKey} style={{ color: Colors.ValueTypes[1] }}>
          {modName}
        </div>
      )
    })
    return <div>{modsList}</div>
  }

  renderUnmet() {
    const { identified, corrupted } = this.props.node

    if (corrupted)
      return (
        <div style={{ color: Colors.ValueTypes[2] }}>
          <span>Corrupted</span>
        </div>
      )
    if (!identified)
      return (
        <div style={{ color: Colors.ValueTypes[2] }}>
          <hr />
          <span>Unidentified</span>
        </div>
      )
  }

  handleCopyToClipboard() {
    const {
      typeLine,
      league,
      x,
      y,
      price,
      stashByStashId: { stashName },
      accountByAccountName: { lastCharacterName },
    } = this.props.node

    const temporaryElement = document.createTextNode(
      `@${lastCharacterName} Hi, I would like to buy your ${typeLine} listed for ${price} in ${league} (stash tab "${stashName}"; position: left: ${x}, top: ${y})`
    )
    document.body.appendChild(temporaryElement)
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(temporaryElement)
    selection.removeAllRanges()
    selection.addRange(range)

    document.execCommand('copy')
    selection.removeAllRanges()
    temporaryElement.remove()
  }

  render() {
    const {
      itemId,
      name,
      typeLine,
      frameType,
      accountName,
      icon,
      ilvl,
      price,
      requirementsByItemId: { nodes: requirements },
      propertiesByItemId: { nodes: properties },
      modsByItemId: { nodes: mods },
    } = this.props.node

    return (
      <Col span={24}>
        <Card>
          <Row
            style={{
              textAlign: 'center',
            }}
          >
            <Col span={5} />
            <Col
              span={14}
              style={{
                color: `${Colors.FrameTypes[frameType]}`,
                backgroundColor: '#3F3F3F',
              }}
            >
              <h3>
                <div>{name}</div>
                <div>{typeLine}</div>
              </h3>
            </Col>

          </Row>
          <Row>
            <Col span={5} style={{ textAlign: 'center' }}>
              <img src={icon} />
            </Col>
            <Col
              span={14}
              style={{
                textAlign: 'center',
                backgroundColor: '#222222',
                color: '#FFFFFF',
              }}
            >
              <Row>
                {this.renderProperties(properties)}
                <hr />

              </Row>
              <Row>
                <div>Item level: {ilvl}</div>
                {this.renderRequirements(requirements)}

              </Row>
              <Row>
                {this.renderMods(mods)}
              </Row>
              <Row>
                {this.renderUnmet()}
              </Row>

            </Col>
            <Col span={5}>
              <Row
                style={{
                  textAlign: 'center',
                }}
              >
                <Col span={24}>
                  <div>{price}</div>
                </Col>
                <Col span={24}>

                  {accountName}

                </Col>
                <Col span={24}>
                  <span type="text" value="a" id={`${itemId}whisper`} />
                  <Button
                    onClick={this.handleCopyToClipboard}
                    id={itemId}
                    name="asd"
                  >
                    Whisper
                  </Button>
                  <Button>
                    <a
                      href={`https://www.pathofexile.com/account/view-profile/${accountName}`}
                    >
                      Profile
                    </a>
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
    )
  }
}
