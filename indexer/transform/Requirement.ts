import { Requirement } from '../interface'

const transformRequirement = (data: any): Requirement => {
  const { values } = data

  const requirement: Requirement = {
    itemId: data.itemId,
    requirementName: data.name,
    requirementValue: values.length > 0 ? values[0][0] : '0',
    requirementKey: data.type
  }

  return requirement
}

export default transformRequirement