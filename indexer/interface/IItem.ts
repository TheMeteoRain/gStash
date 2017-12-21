export interface IItem {
  // Official API properties
  artFilename?: string
  corrupted: boolean
  descrText?: string
  duplicated?: boolean
  flavourText: string
  frameType: number
  h: number
  icon: string
  identified: boolean
  ilvl: number
  inventoryId: string
  isRelic?: boolean
  itemId: string
  league: string
  lockedToCharacter?: boolean
  maxStackSize?: number
  name: string
  note: string | null
  prophecyDiffText?: string
  prophecyText?: string
  secDecriptionText?: string
  // socketed_items?: Array<number>
  stackSize?: number
  support?: boolean
  talismanTier?: number
  typeLine: string
  verified: boolean
  w: number
  x: number
  y: number

  // Custom properties
  accountName: string
  stashId: string
  socketAmount: number
  linkAmount: number
  available: boolean
  addedTs: number
  updatedTs: number
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
