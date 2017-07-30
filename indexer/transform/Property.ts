import { Property } from '../interface'

const transformProperty = (data: any, item_id: string): Property => {
  const { values } = data

  const property: Property = {
    item_id,
    property_name: data.name,
    property_value1: values.length > 0 ? values[0][0] : '0',
    property_value2: values.length > 0 ? values[0][1] : '0'
  }

  return property
}

export default transformProperty