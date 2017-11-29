import { Item } from '../interface'

const RE_CLEAN_NAME = /(<<set:\w+>>)+/g

/**
 * Return the biggest link number on an single item.
 *
 * @param sockets array of sockets of an item
 */
const calculateLinks = (sockets: any): number => {
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

const transformItem = (data: any, account_name: string, stash_id: string): Item => {
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
  let link_amount: number = 0
  let socket_amount: number = 0
  if (data.hasOwnProperty('sockets')) {
    link_amount = calculateLinks(data.sockets)
    socket_amount = data.sockets.length
  }
  const typeLine = data.typeLine.replace(RE_CLEAN_NAME, '')
  const flavourText = data.flavourText ? JSON.stringify(data.flavourText) : ''

  const item: Item = {
    account_name,
    added_ts: Date.now(),
    available: true,
    corrupted,
    crafted,
    enchanted,
    flavour_text: flavourText,
    frame_type: data.frameType,
    h: data.h,
    icon: data.icon,
    identified: data.identified,
    ilvl: data.ilvl,
    inventory_id: data.inventoryId,
    item_id: data.id,
    league: data.league,
    link_amount,
    locked_to_character: data.lockedToCharacter,
    name: data.name,
    price: data.note,
    socket_amount,
    stash_id,
    type_line: typeLine,
    updated_ts: 0,
    verified: data.verified,
    w: data.w,
    x: data.x,
    y: data.y,
  }

  return item
}

export default transformItem
