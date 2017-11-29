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
