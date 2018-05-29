export default class Property {

  public item_id: string
  public property_name: string
  public property_values: any
  public property_display_mode: number
  public property_progress: number | null

  constructor(itemId: string, { ...props }) {
    this.item_id = itemId
    this.property_name = props.name
    this.property_values = this.setValues(props.values)
    this.property_display_mode = props.displayMode
    this.property_progress = props.progress ? props.progress : null
  }

  private setValues(values: any) {
    const valueArray = values.map(([value, valueType]) => {
      if (value.includes('-')) {
        const splitValueArray = value.split('-')

        return {
          value1: splitValueArray[0],
          value2: splitValueArray[1],
          valueType,
        }
      }

      if (value.includes('/')) {
        const splitValueArray = value.split('/')

        return {
          value1: splitValueArray[0],
          value2: splitValueArray[1],
          valueType,
        }
      }

      return {
        value1: value,
        valueType,
      }
    })

    return JSON.stringify(valueArray)
  }
}
