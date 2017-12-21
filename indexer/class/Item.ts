import { stringify } from 'querystring'
import { IItem } from '../interface'

const RE_CLEAN_NAME = /(<<set:\w+>>)+/g

export default class Item implements IItem {
  public artFilename?: string
  public corrupted: boolean
  public descrText?: string
  public duplicated?: boolean
  public flavourText: string
  public frameType: number
  public h: number
  public icon: string
  public identified: boolean
  public ilvl: number
  public inventoryId: string
  public isRelic?: boolean
  public itemId: string
  public league: string
  public lockedToCharacter?: boolean
  public maxStackSize?: number
  public name: string
  public note: string | null
  public prophecyDiffText?: string
  public prophecyText?: string
  public secDecriptionText?: string
  // socketed_items?: Array<number>
  public stackSize?: number
  public support?: boolean
  public talismanTier?: number
  public typeLine: string
  public verified: boolean
  public w: number
  public x: number
  public y: number
  // Custom properties
  public accountName: string
  public stashId: string
  public socketAmount: number
  public linkAmount: number
  public available: boolean
  public addedTs: number
  public updatedTs: number
  public enchanted: boolean
  public crafted: boolean

  constructor({ ...props }: any, stash: any, accountName: string) {
    // Item properties
    this.artFilename = props.artFilename
    this.corrupted = this.hasOwnProperty(props, 'corrupted')
    this.descrText = props.descrText
    this.duplicated = this.hasOwnProperty(props, 'duplicated')
    this.setFlavourText(props.flavourText)
    this.frameType = props.frameType
    this.h = props.h
    this.icon = props.icon
    this.identified = props.identified
    this.ilvl = props.ilvl
    this.inventoryId = props.inventoryId
    this.isRelic = this.hasOwnProperty(props, 'isRelic')
    this.itemId = props.id
    this.league = props.league
    this.lockedToCharacter = props.lockedToCharacter
    this.maxStackSize = props.maxStackSize
    this.setName(props.name)
    this.setNote(props.note, stash.stash)
    this.prophecyDiffText = props.prophecyDiffText
    this.prophecyText = props.prophecyText
    this.stackSize = props.stackSize
    this.support = props.support
    this.talismanTier = props.talismanTier
    this.setTypeLine(props.typeLine)
    this.verified = props.verified
    this.w = props.w
    this.x = props.x
    this.y = props.y
    // Custom properties
    this.accountName = accountName
    this.stashId = stash.id
    this.setSocketAmount(props.sockets)
    this.setLinkAmount(props.sockets)
    this.available = props.available
    this.addedTs = Date.now()
    this.updatedTs = 0
    this.enchanted = this.hasOwnProperty(props, 'enchantedMods')
    this.crafted = this.hasOwnProperty(props, 'craftedMods')
  }

  public toString() {
    return {
      art_filename: this.artFilename,
      corrupted: this.corrupted,
      descr_text: this.descrText,
      duplicated: this.duplicated,
      flavour_text: this.flavourText,
      frame_type: this.frameType,
      h: this.h,
      icon: this.icon,
      identified: this.identified,
      ilvl: this.ilvl,
      inventory_id: this.inventoryId,
      is_relic: this.isRelic,
      item_id: this.itemId,
      league: this.league,
      locked_to_character: this.lockedToCharacter,
      max_stack_size: this.maxStackSize,
      name: this.name,
      note: this.note,
      prophecy_diff_text: this.prophecyDiffText,
      prophecy_text: this.prophecyText,
      stack_size: this.stackSize,
      support: this.support,
      talisman_tier: this.talismanTier,
      type_line: this.typeLine,
      verified: this.verified,
      w: this.w,
      x: this.x,
      y: this.y,
      account_name: this.accountName,
      stash_id: this.stashId,
      socket_amount: this.socketAmount,
      link_amount: this.linkAmount,
      available: this.available,
      addedTs: this.addedTs,
      updatedTs: this.updatedTs,
      enchanted: this.enchanted,
      crafted: this.enchanted,
    }
  }

  private hasOwnProperty(data: any, hasProperty: string) {
    if (data.hasOwnProperty[hasProperty]) {
      return true
    } else {
      return false
    }
  }

  private setTypeLine(typeLine: string) {
    this.typeLine = this.cleanName(typeLine)
  }

  private setName(name: string) {
    this.name = this.cleanName(name)
  }

  private cleanName(name: string) {
    return name.replace(RE_CLEAN_NAME, '')
  }

  private setFlavourText(flavourText: any) {
    this.flavourText = flavourText ? JSON.stringify(flavourText) : ''
  }

  private setNote(itemNote: string, stashNote: string) {
    const findPriceNote = itemNote ? itemNote.match(/(^~price|^~b\/o|^bo) (\d+) (\w+)/g) : null
    const itemPrice = Array.isArray(findPriceNote) ? findPriceNote[0] : null
    const findStashPrice = stashNote ? stashNote.match(/(^~price|^~b\/o|^bo) (\d+) (\w+)/g) : null
    const stashPrice = Array.isArray(findStashPrice) ? findStashPrice[0] : null

    this.note = itemPrice ? itemPrice : stashPrice
  }

  private setSocketAmount(sockets: any) {
    this.socketAmount = sockets.length
  }

  /**
   * Return the biggest link number on an single item.
   *
   * @param sockets array of sockets of an item
   */
  private setLinkAmount(sockets: any) {
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

    this.linkAmount = biggest
  }

}
