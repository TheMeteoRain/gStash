import { Property } from '../interface'

const transformProperty = (data: any, item_id: string): Property => {
  const { values, name, displayMode } = data

  const valueTypes = [
    Array.isArray(values[0]) ? values[0][1] : null, Array.isArray(values[1]) ? values[1][1] : null,
  ]

  const property: Property = {
    item_id,
    property_display_mode: displayMode,
    property_name: name,
    property_progress: data.progress ? data.progress : undefined,
    property_value1: Array.isArray(values[0]) ? values[0][0] : null,
    property_value2: Array.isArray(values[1]) ? values[1][0] : null,
    property_value_types: JSON.stringify(valueTypes),
  }

  return property
}

export default transformProperty
