import { stringify } from 'querystring'

const RE_CLEAN_NAME = /(<<set:\w+>>)+/g

const cleanName = (name: string) => {
  return name.replace(RE_CLEAN_NAME, '')
}

export default class Item {
  public art_filename: string
  public corrupted: boolean
  public descr_text: string
  public duplicated: boolean
  public flavour_text: string
  public frame_type: number
  public h: number
  public icon: string
  public identified: boolean
  public ilvl: number
  public inventory_id: string
  public is_relic: boolean
  public item_id: string
  public league: string
  public locked_to_character: boolean
  public max_stack_size: boolean
  public name: string
  public note: string | null
  public prophecy_diff_text: string
  public prophecy_text: string
  public sec_decription_text: string | null
  // socketed_items: Array<number>
  public stack_size: number
  public support: boolean
  public talisman_tier: number
  public type_line: string
  public verified: boolean
  public w: number
  public x: number
  public y: number
  // Custom properties
  public account_name: string
  public stash_id: string
  public socket_amount: number | null
  public link_amount: number | null
  public available: boolean
  public added_ts: number
  public updated_ts: number
  public enchanted: boolean
  public crafted: boolean

  constructor({ ...props }: any, stashId: string, stashNote: string, accountName: string) {
    // Item properties
    this.art_filename = props.artFilename
    this.corrupted = this.hasOwnProperty(props, 'corrupted')
    this.descr_text = props.descrText
    this.duplicated = this.hasOwnProperty(props, 'duplicated')
    this.setFlavourText(props.flavourText)
    this.frame_type = props.frameType
    this.h = props.h
    this.icon = props.icon
    this.identified = props.identified
    this.ilvl = props.ilvl
    this.inventory_id = props.inventoryId
    this.is_relic = this.hasOwnProperty(props, 'isRelic')
    this.item_id = props.id
    this.league = props.league
    this.locked_to_character = props.lockedToCharacter
    this.max_stack_size = props.maxStackSize
    this.setName(props.name)
    this.setNote(props.note, stashNote)
    this.prophecy_diff_text = props.prophecyDiffText
    this.prophecy_text = props.prophecyText
    this.sec_decription_text = props.secDescrText
    this.stack_size = props.stackSize
    this.support = props.support
    this.talisman_tier = props.talismanTier
    this.setTypeLine(props.typeLine)
    this.verified = props.verified
    this.w = props.w
    this.x = props.x
    this.y = props.y
    // Custom properties
    this.account_name = accountName
    this.stash_id = stashId
    this.socket_amount = props.sockets ? props.sockets.length : null
    this.link_amount = props.sockets ? this.setLinkAmount(props.sockets) : null
    this.available = this.hasOwnProperty(props, 'available')
    this.added_ts = Date.now()
    this.updated_ts = 0
    this.enchanted = this.hasOwnProperty(props, 'enchantedMods')
    this.crafted = this.hasOwnProperty(props, 'craftedMods')
  }

  private hasOwnProperty(data: any, hasProperty: string) {
    if (data.hasOwnProperty[hasProperty]) {
      return true
    } else {
      return false
    }
  }

  private setTypeLine(typeLine: string) {
    this.type_line = cleanName(typeLine)
  }

  private setName(name: string) {
    this.name = cleanName(name)
  }

  private setFlavourText(flavourText: any) {
    this.flavour_text = flavourText ? JSON.stringify(flavourText) : ''
  }

  private setNote(itemNote: string, stashNote: string) {
    const findPriceNote = itemNote ? itemNote.match(/(^~price|^~b\/o|^bo) (\d+) (\w+)/g) : null
    const itemPrice = Array.isArray(findPriceNote) ? findPriceNote[0] : null
    const findStashPrice = stashNote ? stashNote.match(/(^~price|^~b\/o|^bo) (\d+) (\w+)/g) : null
    const stashPrice = Array.isArray(findStashPrice) ? findStashPrice[0] : null

    this.note = itemPrice ? itemPrice : stashPrice
  }


  /**
   * Return the biggest link number on an single item.
   *
   * @param sockets array of sockets of an item
   */
  private setLinkAmount(sockets: any): number {

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
}
