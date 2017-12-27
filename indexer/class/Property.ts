import { IProperty } from '../interface'

export default class Property implements IProperty {

  public item_id: string
  public property_name: string
  public property_value1: string | null
  public property_value2: string | null
  public property_value_type: string | null
  public property_display_mode: number
  public property_progress: number | null

  constructor(itemId: string, { ...props }) {
    this.item_id = itemId
    this.property_name = props.name
    this.property_value1 = null
    this.property_value2 = null
    this.property_value_type = null
    this.property_display_mode = props.displayMode
    this.property_progress = props.progress ? props.progress : null

    this.setValues(props.values)
  }

  private setValues(values: any) {
    // displayMode = 3, occurances of %1, %2, etc replaced with the values
    if (this.property_display_mode === 3) {
      this.property_value1 = Array.isArray(values[0]) ? values[0][0] : null
      this.property_value2 = Array.isArray(values[1]) ? values[1][0] : null
      this.property_value_type = Array.isArray(values[0]) ? values[0][1] : null
    }

    if (values.length > 0) {
      // might contain many values e.g. "x" or "x-y"
      this.property_value1 = Array.isArray(values[0]) ? values[0][0] : null
      if (this.property_value1 && this.property_value1.includes('-')) {
        const valueArray = this.property_value1.split('-')
        this.property_value1 = valueArray[0]
        this.property_value2 = valueArray[1]
      }
      this.property_value_type = Array.isArray(values[0]) ? values[0][1] : null
    }
  }
}
