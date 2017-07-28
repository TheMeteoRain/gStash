import { Item } from '../interface'

const calculateLinks = (sockets: any): number => {
  let groups: Array<number> = [0, 0, 0, 0, 0, 0]
  for (const key of Object.keys(sockets)) {
    switch (sockets[key].group) {
      case 0:
        groups[0]++
        break
      case 1:
        groups[1]++
        break
      case 2:
        groups[2]++
        break
      case 3:
        groups[3]++
        break
      case 4:
        groups[4]++
        break
      case 5:
        groups[5]++
        break
    }
  }

  const biggest = groups.reduce((previous: number, current: number) => {
    return previous > current ? previous : current
  })

  return biggest
}

const transformItem = (data: any): Item => {
  const { sockets } = data
  const linkAmount: number = sockets ? calculateLinks(sockets) : 0

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
    socketAmount: sockets ? sockets.length : 0,
    linkAmount,
    available: data.available ? 1 : 0,
    addedTs: Date.now(),
    updatedTs: 0,
    flavourText: data.flavourText,
    price: data.price,
    crafted: data.crafted,
  }

  return item
}

export default transformItem