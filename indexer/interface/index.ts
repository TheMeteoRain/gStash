export interface Account {
  account_name: string
  last_character_name: string
  last_seen: number
}

export interface Stash {
  stash_id: string
  stash_name: string
  stash_type: string
  stash_public: boolean
}

export interface Property {
  item_id: string
  property_name: string
  property_value1: string
  property_value2: string
  property_key?: string
}

export interface Requirement {
  item_id: string
  requirement_name: string
  requirement_value: string
  requirement_key?: string
}

export interface Socket {
  item_id: string
  socket_group: number
  socket_attr: string
  socket_key?: string
}

export enum ModType {
  'EXPLICIT', 'IMPLICIT', 'CRAFTED', 'ENCHANTED'
}

export interface Mod {
  item_id: string
  mod_name: string
  mod_value1: string
  mod_value2: string
  mod_value3: string
  mod_value4: string
  mod_type: string
  mod_key?: string
}

export interface Item {
  w: number
  h: number
  ilvl: number
  icon: string
  league: string
  item_id: string
  name: string
  type_line: string
  identified: boolean
  verified: boolean
  corrupted: boolean
  locked_to_character: boolean
  frame_type: number
  x: number
  y: number
  inventory_id: string
  account_name: string
  stash_id: string
  socket_amount: number
  link_amount: number
  available: boolean
  added_ts: number
  updated_ts: number
  flavour_text: string
  price: string
  enchanted: boolean
  crafted: boolean
}