import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import {
  Form,
  Input,
  InputNumber,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
} from 'antd'
const InputGroup = Input.Group
const FormItem = Form.Item
const Option = Select.Option
const AutoCompleteOption = AutoComplete.Option

import Result from './Result'

import queries from '../queries'

const RESULTS_PER_PAGE = 10
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
}
const formItemLayout2 = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
}

class Search extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hasSearched: false,
      leagueName: 'Standard',
      frameType: null,
      search: '',
      socketAmountMin: 0,
      socketAmountMax: 6,
      linkAmountMin: 0,
      linkAmountMax: 6,
      itemLvlMin: 0,
      itemLvlMax: 100,
      isEnchanted: null,
      isVerified: null,
      isCrafted: null,
      isIdentified: null,
      isCorrupted: null,
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    e.preventDefault()
    const { getFieldValue } = this.props.form
    const {
      search,
      socketAmountMin,
      socketAmountMax,
      linkAmountMin,
      linkAmountMax,
      itemLvlMin,
      itemLvlMax,
    } = e.target

    this.setState({
      hasSearched: true,
      leagueName: getFieldValue('leagueName'),
      frameType: getFieldValue('frameType'),
      search: search.value ? search.value : '',
      socketAmountMin: socketAmountMin.value
        ? Number(socketAmountMin.value)
        : 0,
      socketAmountMax: socketAmountMax.value
        ? Number(socketAmountMax.value)
        : 6,
      linkAmountMin: linkAmountMin.value ? Number(linkAmountMin.value) : 0,
      linkAmountMax: linkAmountMax.value ? Number(linkAmountMax.value) : 6,
      itemLvlMin: itemLvlMin.value ? Number(itemLvlMin.value) : 0,
      itemLvlMax: itemLvlMax.value ? Number(itemLvlMax.value) : 100,
      // is verified
      isEnchanted: getFieldValue('enchanted'),
      isCrafted: getFieldValue('crafted'),
      isIdentified: getFieldValue('identified'),
      isCorrupted: getFieldValue('corrupted'),
    })
  }

  renderLeagues() {
    const { data: { allLeagues } } = this.props
    const { getFieldDecorator } = this.props.form

    const leagues = allLeagues.nodes.map(league => {
      const { leagueName, nodeId } = league
      return <Option key={nodeId} value={leagueName}>{leagueName}</Option>
    })

    return (
      <FormItem>
        {getFieldDecorator('leagueName', {
          initialValue: 'Standard',
        })(
          <Select>
            {leagues}
          </Select>
        )}
      </FormItem>
    )
  }

  renderFrameTypes() {
    const { data: { allFrametypes } } = this.props
    const { getFieldDecorator } = this.props.form

    const frameTypes = allFrametypes.nodes.map(frameType => {
      const { frameTypeValue, id, nodeId } = frameType
      return (
        <Option key={nodeId} value={id}>
          {frameTypeValue.charAt(0) +
            frameTypeValue.slice(1).toLowerCase().replace('_', ' ')}
        </Option>
      )
    })

    frameTypes.unshift(<Option key={10} value={null}>Any</Option>)

    return (
      <FormItem {...formItemLayout} label={'Item Rarity'}>
        {getFieldDecorator('frameType', {
          initialValue: null,
        })(
          <Select>
            {frameTypes}
          </Select>
        )}
      </FormItem>
    )
  }

  render() {
    const { hasSearched, ...state } = this.state
    const { getFieldDecorator } = this.props.form

    return (
      <section>
        <h1>Search</h1>
        <Form onSubmit={this.handleClick}>
          <Row gutter={24}>
            <Col span={16}>
              <FormItem>
                <Input
                  name="search"
                  defaultValue={''}
                  placeholder={'Search items...'}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              {this.renderLeagues()}
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              {this.renderFrameTypes()}
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={4}>
              <Row gutter={24}>

                <FormItem {...formItemLayout} label={'Sockets'}>
                  <Col span={12}>
                    <Input
                      name="socketAmountMin"
                      defaultValue={null}
                      placeholder={'Min'}
                    />
                  </Col>
                  <Col span={12}>
                    <Input
                      name="socketAmountMax"
                      defaultValue={null}
                      placeholder={'Max'}
                    />
                  </Col>
                </FormItem>
              </Row>
              <Row gutter={24}>
                <FormItem {...formItemLayout} label={'Links'}>
                  <Col span={12}>
                    <Input
                      name="linkAmountMin"
                      defaultValue={null}
                      placeholder={'Min'}
                    />
                  </Col>
                  <Col span={12}>
                    <Input
                      name="linkAmountMax"
                      defaultValue={null}
                      placeholder={'Max'}
                    />
                  </Col>
                </FormItem>
              </Row>
            </Col>

            <Col span={4}>
              <Row gutter={24}>
                <FormItem {...formItemLayout} label={'Item level'}>
                  <Col span={12}>
                    <Input
                      name="itemLvlMin"
                      defaultValue={null}
                      placeholder={'Min'}
                    />
                  </Col>
                  <Col span={12}>
                    <Input
                      name="itemLvlMax"
                      defaultValue={null}
                      placeholder={'Max'}
                    />
                  </Col>
                </FormItem>
              </Row>
              <FormItem {...formItemLayout} label="Enchanted">
                {getFieldDecorator('enchanted', {
                  initialValue: null,
                })(
                  <Select placeholder="Any">
                    <Option value={null}>Any</Option>
                    <Option value={true}>Yes</Option>
                    <Option value={false}>No</Option>
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="Corrupted">
                {getFieldDecorator('corrupted', {
                  initialValue: null,
                })(
                  <Select placeholder="Any">
                    <Option value={null}>Any</Option>
                    <Option value={true}>Yes</Option>
                    <Option value={false}>No</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem {...formItemLayout} label="Identified">
                {getFieldDecorator('identified', {
                  initialValue: null,
                })(
                  <Select placeholder="Any">
                    <Option value={null}>Any</Option>
                    <Option value={true}>Yes</Option>
                    <Option value={false}>No</Option>
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="Crafted">
                {getFieldDecorator('crafted', {
                  initialValue: null,
                })(
                  <Select placeholder="Any">
                    <Option value={null}>Any</Option>
                    <Option value={true}>Yes</Option>
                    <Option value={false}>No</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={4} />
            <Col span={20}>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                icon="search"
                style={{ width: '80%', height: '35px' }}
              >
                Search
              </Button>
            </Col>
          </Row>

        </Form>

        <br />
        <hr />
        <br />

        {hasSearched && <Result first={RESULTS_PER_PAGE} {...state} />}
      </section>
    )
  }
}

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (PostList)
export default graphql(queries.getFilters)(Search)
