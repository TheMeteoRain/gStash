import React, { Component } from 'react'

import Colors from './Colors'
import { Col, Row, Card, Tag, Button } from 'antd'
import { propType } from 'graphql-anywhere/lib/src/utilities'

const formatColor = (value, valueType) => <span style={{ color: Colors.ValueTypes[valueType] }}>{value}</span>


const REQUIREMENT_ORDER = ['Level', 'Str', 'Dex', 'Int']

const formatProperty = ({
  name, displayMode, value1 = null, value2 = null, valueType, progress,
}) => {
  if (displayMode !== 3)
    name = formatColor(name, 0)

  if (value1 === null && value2 === null)
    return <span>{name}</span>

  // name: value or name: value-value
  if (displayMode === 0) {
    if (value2 === null)
      return <span>{name}: {formatColor(value1, valueType)}</span>

    return <span>{name}: {formatColor(`${value1}-${value2}`, valueType)}</span>
  }

  // property does not have displayMode 1

  // experience bar
  if (displayMode === 2) {
    if (value2 === null)
      return <span>{progress}</span>
  }

  // name %0 something %1
  if (displayMode === 3) {
    let i = 0
    name = name.replace(/#/g, () => {
      i++
      if (i == 1) return formatColor(value1, valueType)
      if (i == 2) return formatColor(value2, valueType)
    })

    return <span>{name}</span>
  }
}

const formatRequirements = ({
  name, displayMode, value, valueType, last = true,
}) => {
  value = formatColor(value, valueType)

  if (displayMode === 0) {
    if (last)
      return <span>{name} {value}</span>

    return <span>{name} {value}, </span>
  }

  if (displayMode === 1) {
    if (last)
      return <span>{value} {name}</span>

    return <span>{value} {name}, </span>
  }

  // there is no displayMode 2 or 3 in requirements
}

export default class Item extends Component {
  constructor(props) {
    super(props)

    this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this)
  }
  renderRequirements(requirements) {
    if (requirements.length === 0) return

    // APOLLO IS IMMUTABLE, DO THIS
    const sortedList = Array.of(...requirements).sort(
      (a, b) =>
        REQUIREMENT_ORDER.indexOf(a.requirementName) -
        REQUIREMENT_ORDER.indexOf(b.requirementName)
    )

    const requirementList = sortedList.map((requirement, index, array) => {
      if (!requirement) return
      const {
        nodeId,
        requirementName,
        requirementValue,
        requirementValueType,
        requirementDisplayMode,
      } = requirement

      const last = array.length - 1 > index ? false : true

      const name = formatRequirements({
        name: requirementName,
        displayMode: requirementDisplayMode,
        value: requirementValue,
        valueType: requirementValueType,
        last: last,
      })

      return (
        <span key={nodeId}>
          {name}
        </span>
      )
    })

    return (
      <div>
        {'Requires '}
        {requirementList}
        <hr />
      </div>
    )
  }

  renderProperties(properties) {
    if (properties.length === 0) return

    const propertiesList = properties.map((property) => {
      const {
        nodeId,
        propertyName,
        propertyValue1,
        propertyValue2,
        propertyValueType,
        propertyDisplayMode,
        propertyProgress,
      } = property

      const name = formatProperty({
        name: propertyName,
        displayMode: propertyDisplayMode,
        value1: propertyValue1,
        value2: propertyValue2,
        valueType: propertyValueType,
        progress: propertyProgress,
      })

      return (
        <div key={nodeId}>
          {name}
        </div>
      )
    })

    return <div>{propertiesList}</div>
  }

  renderMods(mods) {
    if (mods.length === 0) return

    const modsList = mods.map(mod => {
      const { nodeId, modValue1, modValue2, modValue3, modValue4 } = mod

      let i = 0
      const modName = mod.modName.replace(/#/g, () => {
        i++
        if (i == 1) return modValue1
        if (i == 2) return modValue2
        if (i == 3) return modValue3
        if (i == 4) return modValue4
      })

      return (
        <div key={nodeId} style={{ color: Colors.ValueTypes[1] }}>
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
      note,
      stashByStashId: { stashName },
      accountByAccountName: { lastCharacterName },
    } = this.props.node

    const temporaryElement = document.createTextNode(
      `@${lastCharacterName} Hi, I would like to buy your ${typeLine} listed for ${note} in ${league} (stash tab "${stashName}"; position: left: ${x}, top: ${y})`
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
      note,
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
                  <div>{note}</div>
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
