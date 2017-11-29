import { Property } from '../interface'

const transformProperty = (data: any, item_id: string): Property => {
  const { values, name, displayMode } = data

  const property: Property = {
    item_id,
    property_display_mode: displayMode,
    property_name: name,
    property_progress: data.progress ? data.progress : undefined,
    property_value: Array.isArray(values[0]) ? values[0][0] : null,
    property_value_type: Array.isArray(values[0]) ? values[0][1] : null,
  }

  return property
}

export default transformProperty
