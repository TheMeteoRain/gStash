import { Property } from '../interface'

const transformProperty = (data: any): Property => {
  const { values } = data

  const property: Property = {
    itemId: data.itemId,
    propertyName: data.name,
    propertyValue1: values.length > 0 ? values[0][0] : '0',
    propertyValue2: values.length > 0 ? values[0][1] : '0'
  }

  return property
}

export default transformProperty