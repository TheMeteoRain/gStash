export interface Property {
  item_id: string
  property_name: string
  property_value1: string | null
  property_value2: string | null
  property_value_types: string | null
  property_display_mode: number
  property_progress?: number
  property_key?: string
}

/* properties: [
  {
    name: 'X',
    values: [['value'], [0]], // value, valueType
    displayMode: 0,
    type: 0 // properties type
  }
]

additionalProperties: [
  {
    name: 'X',
    values: [['value'],[0]],
    displayMode: 0,
    progress: 0.00 // additionalProperties's Experience
  }
] */
