import React, { Component } from 'react'

import Colors from '../../Colors'

import Property from './Property'
import Requirement from './Requirement'
import Mod from './Mod'
import Unmet from './Unmet'

import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText,
} from 'material-ui/Card'

export default class Item extends Component {
  constructor(props) {
    super(props)

    this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this)
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
      corrupted,
      identified,
      requirementsByItemId: { nodes: requirements },
      propertiesByItemId: { nodes: properties },
      modsByItemId: { nodes: mods },
    } = this.props.node

    const expfind = properties.find(
      property => property.propertyName === 'Experience'
    )
    const exp = expfind !== undefined ? expfind.propertyProgress : null

    return (
      <Card style={{ margin: '1rem 0' }}>
        <CardHeader
          title={name}
          subtitle={typeLine}
          actAsExpander={true}
          titleStyle={{
            color: `${Colors.FrameTypes[frameType]}`,
          }}
        />

        <CardText style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '20%' }}>
            <img src={icon} alt="" />
          </div>

          <div style={{ display: 'inline-block', width: '80%' }}>
            {Property(properties)}
            <Divider />
            {Requirement(requirements)}
            <Divider />

            {Mod(mods)}
            <Divider />

            {Unmet(identified, corrupted, exp)}
          </div>
        </CardText>
        <CardActions>
          <FlatButton label="Whisper" />
          <FlatButton label="Refresh" />
        </CardActions>
      </Card>
    )
    /**return (
      <article>
        <Row
          style={{
            textAlign: 'center',
          }}
        >
          <Col
            style={{
              color: `${Colors.FrameTypes[frameType]}`,
              backgroundColor: '#3F3F3F',
            }}
          >
            <h6>
              <div>{name}</div>
              <div>{typeLine}</div>
            </h6>
          </Col>
        </Row>

        <Row style={{ textAlign: 'center' }}>
          <Col>
            <img
              src={icon}
              style={{
                position: 'absolute',
                top: '0',
                bottom: '0',
                left: '0',
                right: '0',
                margin: 'auto',
              }}
            />
          </Col>

          <Col
            xs={{ size: 12 }}
            lg={{ size: 6 }}
            style={{
              backgroundColor: '#222222',
              color: '#FFFFFF',
            }}
          >
            <Row>
              <Col>{Property(properties)}</Col>
            </Row>
            <Row>
              <Col>
                <div>Item level: {ilvl}</div>
                {Requirement(requirements)}
              </Col>
            </Row>
            <Row>
              <Col>{Mod(mods)}</Col>
            </Row>
            <Row>
              <Col>{Unmet(identified, corrupted, exp)}</Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col>
                <div>{note}</div>
              </Col>
              <Col>{accountName}</Col>
              <Col>
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
      </article>
    )*/
  }
}
