import { Item, Stash } from '../interface'

const RE_CLEAN_NAME = /(<<set:\w+>>)+/g

/**
 * Return the biggest link number on an single item.
 *
 * @param sockets array of sockets of an item
 */
const setLinkAmount = (sockets: any): number => {
  const groups: number[] = [0, 0, 0, 0, 0]
  for (const key of Object.keys(sockets)) {
    switch (sockets[key].group) {
      case 0: {
        groups[0]++
        break
      }
      case 1: {
        groups[1]++
        break
      }
      case 2: {
        groups[2]++
        break
      }
      case 3: {
        groups[2]++
        break
      }
      case 4: {
        groups[2]++
        break
      }
    }
  }

  const biggest = groups.reduce((previous: number, current: number) => previous > current ? previous : current)

  return biggest
}

// Determine price, prioritize item's own price then stash price
const setNote = (itemNote: string, stashNote: string): string | null => {
  const findPriceNote = itemNote ? itemNote.match(/(^~price|^~b\/o|^bo) (\d+) (\w+)/g) : null
  const itemPrice = Array.isArray(findPriceNote) ? findPriceNote[0] : null
  const findStashPrice = stashNote ? stashNote.match(/(^~price|^~b\/o|^bo) (\d+) (\w+)/g) : null
  const stashPrice = Array.isArray(findStashPrice) ? findStashPrice[0] : null

  return itemPrice ? itemPrice : stashPrice
}

const cleanText = (text: string) => {
  return text.replace(RE_CLEAN_NAME, '')
}

const transformItem = (data: any, accountName: string, stash: any): Item => {
  let enchanted: boolean = false
  if (data.hasOwnProperty('enchantMods')) {
    enchanted = data.enchantMods ? true : false
  }
  let crafted: boolean = false
  if (data.hasOwnProperty('craftedMods')) {
    crafted = data.craftedMods ? true : false
  }
  let corrupted: boolean = false
  if (data.hasOwnProperty('corrupted')) {
    corrupted = data.corrupted ? true : false
  }
  let linkAmount: number = 0
  let socketAmount: number = 0
  if (data.hasOwnProperty('sockets')) {
    linkAmount = setLinkAmount(data.sockets)
    socketAmount = data.sockets.length
  }

  const flavourText = data.flavourText ? JSON.stringify(data.flavourText) : ''

  const item: Item = {
    account_name: accountName,
    added_ts: Date.now(),
    art_filename: data.art_filename,
    available: true,
    corrupted,
    crafted,
    descr_text: data.descrText,
    duplicated: data.duplicated,
    enchanted,
    flavour_text: flavourText,
    frame_type: data.frameType,
    h: data.h,
    icon: data.icon,
    identified: data.identified,
    ilvl: data.ilvl,
    inventory_id: data.inventoryId,
    is_relic: data.isRelic,
    item_id: data.id,
    league: data.league,
    link_amount: linkAmount,
    max_stack_size: data.maxStackSize,
    name: cleanText(data.name),
    note: setNote(data.note, stash.stash),
    prophecy_diff_text: data.prophecyDiffText,
    prophecy_text: data.prophecyText,
    sec_decription_text: data.secDecriptionText,
    socket_amount: socketAmount,
    stack_size: data.stackSize,
    stash_id: stash.id,
    support: data.support,
    talisman_tier: data.talismanTier,
    type_line: cleanText(data.typeLine),
    updated_ts: 0,
    verified: data.verified,
    w: data.w,
    x: data.x,
    y: data.y,
  }

  return item
}

export default transformItem
