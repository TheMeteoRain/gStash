import { Property } from '../interface'

const transformProperty = (data: any, item_id: string, valueIndex: number = 0): Property => {
  const { values, name, displayMode } = data

  /**
   * Default values.
   * Used when there is no values
   */
  let value1 = null
  let value2 = null
  let value_type = null
  // displayMode = 3, occurances of %1, %2, etc replaced with the values
  if (displayMode === 3) {
    value1 = Array.isArray(values[0]) ? values[0][0] : null
    value2 = Array.isArray(values[1]) ? values[1][0] : null
    value_type = Array.isArray(values[0]) ? values[0][1] : null
  }

  if (values.length > 0) {
    // might contain many values e.g. "x" or "x-y"
    value1 = Array.isArray(values[valueIndex]) ? values[valueIndex][0] : null
    if (value1 && value1.includes('-')) {
      const valueArray = value1.split('-')
      value1 = valueArray[0]
      value2 = valueArray[1]
    }
    value_type = Array.isArray(values[valueIndex]) ? values[valueIndex][1] : null
  }

  const property: Property = {
    item_id,
    property_display_mode: displayMode,
    property_name: name,
    property_progress: data.progress ? data.progress : undefined,
    property_value1: value1,
    property_value2: value2,
    property_value_type: value_type,
  }

  return property
}

export default transformProperty
