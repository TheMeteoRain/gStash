import { Requirement } from '../interface'

const transformRequirement = (data: any, item_id: string): Requirement => {
  const { values, displayMode } = data

  const name = data.name !== 'Level' ? data.name.slice(0, 3) : data.name

  const requirement: Requirement = {
    item_id,
    requirement_display_mode: displayMode,
    requirement_name: name,
    requirement_value: Array.isArray(values[0]) ? values[0][0] : null,
    requirement_value_type: Array.isArray(values[0]) ? values[0][1] : null,
  }

  return requirement
}

export default transformRequirement
