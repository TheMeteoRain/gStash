export interface Account {
  accountName: string
  lastCharacterName: string
  lastSeen: number
}

export interface Stash {
  stashId: string
  stashName: string
  stashType: string
  stashPublic: boolean
}

export interface Property {
  itemId: string
  propertyName: string
  propertyValue1: string
  propertyValue2: string
  propertyKey: string
}

export interface Requirement {
  itemId: string
  requirementName: string
  requirementValue: string
  requirementKey: string
}

export interface Socket {
  itemId: string
  socketGroup: number
  socketAttr: string
  socketKey: string
}

export interface Item {
  w: number
  h: number
  ilvl: number
  icon: string
  league: string
  itemId: string
  name: string
  typeLine: string
  identified: boolean
  verified: boolean
  corrupted: boolean
  lockedToCharacter: boolean
  frameType: number
  x: number
  y: number
  inventoryId: string
  accountName: string
  stashId: string
  socketAmount: number
  linkAmount: number
  available: number
  addedTs: number
  updatedTs: number
  flavourText: string
  price: string
  crafted: boolean
}