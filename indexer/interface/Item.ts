export interface Item {
  // Official API properties
  art_filename?: string
  corrupted: boolean
  descr_text?: string
  duplicated?: boolean
  flavour_text: string
  frame_type: number
  h: number
  icon: string
  identified: boolean
  ilvl: number
  inventory_id: string
  is_relic?: boolean
  item_id: string
  league: string
  locked_to_character?: boolean
  max_stack_size?: number
  name: string
  note: string
  prophecy_diff_text?: string
  prophecy_text?: string
  sec_decription_text?: string
  // socketed_items?: Array<number>
  stack_size?: number
  support?: boolean
  talisman_tier?: number
  type_line: string
  verified: boolean
  w: number
  x: number
  y: number

  // Custom properties
  account_name: string
  stash_id: string
  socket_amount: number
  link_amount: number
  available: boolean
  added_ts: number
  updated_ts: number
  enchanted: boolean
  crafted: boolean
}

/**
 * verified is whether the player still has the item
 * verified boolean as to whether or not the item is actually
 * owned by the player at the time (irrelevant for the Stash Tab API)
 *
 * support set to true for every item except non-support gems IIRC. A weird artificat, only relevant for gems.
 *
 * The set tags are localizations and almost always should be stripped out and ignored.
 *
 * name is prefix and typeLine is suffix. Together they form the actual item name.
 *
 * lockedToCharacter - I'm 90% sure this is a BS tag, it's never actually properly set to true for items
 * that should be locked to the character that I've seen. Ignore it.
 *
 * The flavour text helps strengthen the identity of an item,
 * and makes the player feel like they have uncovered something ancient and special.
 * Finding Unique items in the world can also reveal pieces of the puzzle that is Wraeclast’s mysterious past.
 */
