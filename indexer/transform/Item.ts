import { Item } from '../interface'

/**
 * Return the biggest link number on an single item.
 *
 * @param sockets array of sockets of an item
 */
const calculateLinks = (sockets: any): number => {
  let groups: Array<number> = [0, 0, 0, 0, 0]
  for (const key of Object.keys(sockets)) {
    switch (sockets[key].group) {
      case 0: groups[0]++
        break
      case 1: groups[1]++
        break
      case 2: groups[2]++
        break
      case 3: groups[2]++
        break
      case 4: groups[2]++
        break
    }
  }

  const biggest = groups.reduce((previous: number, current: number) => {
    return previous > current ? previous : current
  })

  return biggest
}

const transformItem = (data: any): Item => {
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
    w: data.w,
    h: data.h,
    ilvl: data.ilvl,
    icon: data.icon,
    league: data.league,
    item_id: data.id,
    name: data.name,
    type_line: data.typeLine,
    identified: data.identified,
    verified: data.verified,
    corrupted: data.corrupted,
    locked_to_character: data.lockedToCharacter,
    frame_type: data.frameType,
    x: data.x,
    y: data.y,
    inventory_id: data.inventoryId,
    account_name: data.account_name,
    stash_id: data.stash_id,
    socket_amount,
    link_amount,
    available: true,
    added_ts: Date.now(),
    updated_ts: 0,
    flavour_text: data.flavourText,
    price: data.price,
    enchanted,
    crafted
  }

  return item
}

export default transformItem