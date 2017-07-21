import * as stringDecoder from 'string_decoder';
import {Socket} from './socket'

export interface Item {
  verified: boolean
  w: number
  h: number
  ilvl: number
  icon: string
  league: string
  id: string
  sockets: string[] //change this
  name: string
  typeLine: string
  identified: boolean
  corrupted: boolean
  lockedToCharacter: boolean
  requirements: string[] //change this
  explicitMods: string[]
  implicitMods: string[]
  frameType: number
  x: number
  y: number
  inventoryId: string
  socketedItems: string[] //change this
  note?: string
  properties?: string[] //change this
  enchantMods?: string[]
  craftedMods?: string[]
  flavourText?: string[]
  additionalProperties?: string[] //change this
  secDescrText?: string
  descrText?: string
  artFilename?: string
  duplicated?: boolean
  maxStackSize?: number
  nextLevelRequirements?: string[] //change this
  stackSize?: number
  talismanTier?: number
  utilityMods?: string[]
  support?: boolean
  cosmeticMods?: string[]
  prophecyDiffText?: string
  prophecyText?: string
  isRelic?: boolean
}

/*export const transformItem = (
  {
    verified,
    w,
    h,
    ilvl,
    icon,
    league,
    id,
    sockets,
    name,
    typeLine,
    identified,
    corrupted,
    lockedToCharacter,
    requirements,
    explicitMods,
    implicitMods,
    frameType,
    x,
    y,
    inventoryId,
    socketedItems,
    note,
    properties,
    enchantMods,
    craftedMods,
    flavourText,
    additionalProperties,
    secDescrText,
    descrText,
    artFilename,
    duplicated,
    maxStackSize,
    nextLevelRequirements,
    stackSize,
    talismanTier,
    utilityMods,
    support,
    cosmeticMods,
    prophecyDiffText,
    prophecyText,
    isRelic
  } : {
    verified: boolean
    w: number
    h: number
    ilvl: number
    icon: string
    league: string
    id: string
    sockets: Socket[] //change this
    name: string
    typeLine: string
    identified: boolean
    corrupted: boolean
    lockedToCharacter: boolean
    requirements: string[] //change this
    explicitMods: string[]
    implicitMods: string[]
    frameType: number
    x: number
    y: number
    inventoryId: string
    socketedItems: string[] //change this
    note: string
    properties?: string[] //change this
    enchantMods?: string[]
    craftedMods?: string[]
    flavourText?: string[]
    additionalProperties?: string[] //change this
    secDescrText?: string
    descrText?: string
    artFilename?: string
    duplicated?: boolean
    maxStackSize?: number
    nextLevelRequirements?: string[] //change this
    stackSize?: number
    talismanTier?: number
    utilityMods?: string[]
    support?: boolean
    cosmeticMods?: string[]
    prophecyDiffText?: string
    prophecyText?: string
    isRelic?: boolean}): Item => {
  const item: any = {
    verified,
    w,
    h,
    ilvl,
    icon,
    league,
    id,
    sockets,
    name,
    typeLine,
    identified,
    corrupted,
    lockedToCharacter,
    requirements,
    explicitMods,
    implicitMods,
    frameType,
    x,
    y,
    inventoryId,
    socketedItems,
    note,
    properties,
    enchantMods,
    craftedMods,
    flavourText,
    additionalProperties,
    secDescrText,
    descrText,
    artFilename,
    duplicated,
    maxStackSize,
    nextLevelRequirements,
    stackSize,
    talismanTier,
    utilityMods,
    support,
    cosmeticMods,
    prophecyDiffText,
    prophecyText,
    isRelic
  }

  return item
}*/

/*verified, w,
  h,
  ilvl,
  icon,
  league,
  id,
  sockets,
  name,
  typeLine,
  identified,
  corrupted,
  lockedToCharacter,
  requirements,
  explicitMods,
  implicitMods,
  frameType,
  x,
  y,
  inventoryId,
  socketedItems,
  note,
  properties,
  enchantMods,
  craftedMods,
  flavourText,
  additionalProperties,
  secDescrText,
  descrText,
  artFilename,
  duplicated,
  maxStackSize,
  nextLevelRequirements,
  stackSize,
  talismanTier,
  utilityMods,
  support,
  cosmeticMods,
  prophecyDiffText,
  prophecyText,
  isRelic*/