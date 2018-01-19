export interface IRequirement {
  item_id: string
  requirement_name: string
  requirement_value: string | null
  requirement_value_type: number | null
  requirement_display_mode: number
  requirement_key?: string
}
