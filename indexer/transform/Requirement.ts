import { Requirement } from '../interface'

const transformRequirement = (data: any, item_id: string): Requirement => {
  const { values } = data

  const name = data.name !== 'Level' ? data.name.slice(0, 3) : data.name

  const requirement: Requirement = {
    item_id,
    requirement_name: name,
    requirement_value: Array.isArray(values) ? values[0][0] : null,
  }

  return requirement
}

export default transformRequirement
