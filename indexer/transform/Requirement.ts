import { Requirement } from '../interface'

const transformRequirement = (data: any, item_id: string): Requirement => {
  const { values } = data

  const requirement: Requirement = {
    item_id,
    requirement_name: data.name,
    requirement_value: values.length > 0 ? values[0][0] : null
  }

  return requirement
}

export default transformRequirement