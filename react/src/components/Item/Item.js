import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles'

import { COLORS } from '../../constants'

import Property from './Property'
import Requirement from './Requirement'
import Mod from './Mod'
import Unmet from './Unmet'
import Experience from './Experience'

import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

const styles = theme => ({
  card: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 3,
  },
  heading: {},
  content: {
    minHeight: 100,
  },
  media: {
    width: 'auto',
    height: '100%',
    backgroundSize: 'unset',
  },
  relative: {
    position: 'relative',
  },
  absolute: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
})

class Item extends Component {
  constructor(props) {
    super(props)

    //this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this)
  }

  // handleCopyToClipboard() {
  //   const {
  //     typeLine,
  //     league,
  //     x,
  //     y,
  //     note,
  //     stashByStashId: { stashName },
  //     accountByAccountName: { lastCharacterName },
  //   } = this.props.node

  //   const temporaryElement = document.createTextNode(
  //     `@${lastCharacterName} Hi, I would like to buy your ${typeLine} listed for ${note} in ${league} (stash tab "${stashName}"; position: left: ${x}, top: ${y})`
  //   )
  //   document.body.appendChild(temporaryElement)
  //   const selection = window.getSelection()
  //   const range = document.createRange()
  //   range.selectNodeContents(temporaryElement)
  //   selection.removeAllRanges()
  //   selection.addRange(range)

  //   document.execCommand('copy')
  //   selection.removeAllRanges()
  //   temporaryElement.remove()
  // }
  openWikiLink = () => {
    const {
      node: { name },
    } = this.props

    window.open(
      `https://pathofexile.gamepedia.com/${name.split(' ').join('_')}`,
      '_blank'
    )
  }

  render() {
    const {
      classes,
      node: {
        item_id,
        name,
        type_line,
        frame_type,
        account_name,
        icon,
        ilvl,
        note,
        corrupted,
        identified,
        requirementsByItemId: requirements,
        propertiesByItemId: properties,
        modsByItemId: mods,
      },
    } = this.props

    return (
      <Card className={classes.card}>
        <Grid container spacing={24}>
          <Grid item xs={3}>
            <CardMedia className={classes.media} image={icon} />
          </Grid>

          <Grid item xs={9}>
            <CardContent>
              <div className={classes.heading}>
                <Typography
                  variant="headline"
                  style={{ color: COLORS.FrameTypes[frame_type] }}
                >
                  {name}
                </Typography>
                <Typography variant="subheading" color="textSecondary">
                  {type_line}
                </Typography>
              </div>
              <div className={classes.content}>
                {Property(properties)}
                <Divider />
                {Requirement(requirements)}
                <Divider />

                <Mod mods={mods} />
                <Divider />

                {Unmet(identified, corrupted)}
                {Experience(properties)}
              </div>
            </CardContent>
          </Grid>
        </Grid>
        <CardActions>
          <Button size="small" color="primary">
            Whisper
          </Button>
          <Button size="small" color="primary">
            Refresh
          </Button>

          {name &&
            frame_type === 3 && (
              <Button size="small" color="primary" onClick={this.openWikiLink}>
                Wiki
              </Button>
            )}
        </CardActions>
      </Card>
    )

    // <Card style={{ margin: '1rem 0' }}>
    //   <CardHeader
    //     title={name}
    //     subtitle={typeLine}
    //     actAsExpander={true}
    //     titleStyle={{
    //       color: `${Colors.FrameTypes[frameType]}`,
    //     }}
    //   />

    //   <CardText style={{ textAlign: 'center' }}>
    //     <div style={{ display: 'inline-block', width: '20%' }}>
    //       <img src={icon} alt="" />
    //     </div>

    //     <div style={{ display: 'inline-block', width: '80%' }}>
    //       {Property(properties)}
    //       <Divider />
    //       {Requirement(requirements)}
    //       <Divider />

    //       {Mod(mods)}
    //       <Divider />

    //       {Unmet(identified, corrupted)}
    //     </div>
    //   </CardText>
    //   <CardActions>
    //     <Button flatPrimary label="Whisper" />
    //     <Button flatSecondary label="Refresh" />
    //   </CardActions>
    // </Card>
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

export default withStyles(styles)(Item)
