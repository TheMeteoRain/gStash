import App from '../components/App'
import Header from '../components/Header'
import Submit from '../components/Submit'
import Search from '../components/Search'
import withData from '../lib/withData'
import { Form, Icon, Input, Button, Checkbox } from 'antd'

const SearchForm = Form.create()(Search)

export default withData(props => (
  <App pathname={props.url.pathname}>
    <SearchForm />
  </App>
))
