export default class Requirement {

  public item_id: string
  public requirement_name: string
  public requirement_value: string | null
  public requirement_value_type: number | null
  public requirement_display_mode: number

  constructor(itemId: string, { ...props }) {
    this.item_id = itemId
    this.requirement_name = this.setName(props.name)
    this.requirement_value = null
    this.requirement_value_type = null
    this.requirement_display_mode = props.displayMode

    this.setValues(props.values)
  }

  private setName(name: string) {
    return name !== 'Level' ? name.slice(0, 3) : name
  }

  private setValues(values: any) {
    this.requirement_value = Array.isArray(values[0]) ? values[0][0] : null
    this.requirement_value_type = Array.isArray(values[0]) ? values[0][1] : null
  }
}
