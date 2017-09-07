import { Item } from '../interface'

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

  const biggest = groups.reduce((previous: number, current: number) => {
    return previous > current ? previous : current
  })

  return biggest
}

const transformItem = (data: any, account_name: string, stash_id: string): Item => {
  let enchanted: boolean = false
  if (data.hasOwnProperty('enchantMods')) {
    enchanted = data.enchantMods.length > 0 ? true : false
  }
  let crafted: boolean = false
  if (data.hasOwnProperty('craftedMods')) {
    crafted = data.craftedMods.length > 0 ? true : false
  }
  let link_amount: number = 0
  let socket_amount: number = 0
  if (data.hasOwnProperty('sockets')) {
    link_amount = calculateLinks(data.sockets)
    socket_amount = data.sockets.length
  }

  const item: Item = {
    account_name,
    added_ts: Date.now(),
    available: true,
    corrupted: data.corrupted,
    crafted,
    enchanted,
    flavour_text: data.flavourText,
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
    price: data.price,
    socket_amount,
    stash_id,
    type_line: data.typeLine,
    updated_ts: 0,
    verified: data.verified,
    w: data.w,
    x: data.x,
    y: data.y,
  }

  return item
}

export default transformItem
