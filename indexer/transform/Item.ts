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
  let linkAmount: number = 0
  let socketAmount: number = 0
  if (data.hasOwnProperty('sockets')) {
    linkAmount = calculateLinks(data.sockets)
    socketAmount = data.sockets.length
  }

  const item: Item = {
    w: data.w,
    h: data.h,
    ilvl: data.ilvl,
    icon: data.icon,
    league: data.league,
    itemId: data.id,
    name: data.name,
    typeLine: data.typeLine,
    identified: data.identified,
    verified: data.verified,
    corrupted: data.corrupted,
    lockedToCharacter: data.lockedToCharacter,
    frameType: data.frameType,
    x: data.x,
    y: data.y,
    inventoryId: data.inventoryId,
    accountName: data.accountName,
    stashId: data.stashId,
    socketAmount,
    linkAmount,
    available: true,
    addedTs: Date.now(),
    updatedTs: 0,
    flavourText: data.flavourText,
    price: data.price,
    enchanted,
    crafted
  }

  return item
}

export default transformItem