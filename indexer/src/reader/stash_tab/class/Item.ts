import { stringify } from 'querystring'

const RE_CLEAN_NAME = /(<<set:\w+>>)+/g

const cleanName = (name: string) => {
  return name.replace(RE_CLEAN_NAME, '')
}

export default class Item {
  public account_name: string
  public added_ts: number
  public corrupted: boolean
  public crafted: boolean
  public document: null
  public enchanted: boolean
  public frame_type: number
  public h: number
  public icon: string
  public identified: boolean
  public ilvl: number
  public inventory_id: string
  public item_id: string
  public league: string
  public name: string
  public stash_id: string
  public type_line: string
  public updated_ts: number
  public verified: boolean
  public w: number
  public x: number
  public y: number
  public variable_data: any
  // public locked_to_character: boolean
  // socketed_items: Array<number>

  constructor({ ...props }: any, stashId: string, stashNote: string, accountName: string) {
    // Item properties
    this.account_name = accountName
    this.added_ts = Date.now()
    this.corrupted = props.corrupted ? true : false
    this.crafted = props.craftedMods ? true : false
    this.document = null
    this.enchanted = props.enchantedMods ? true : false
    this.frame_type = props.frameType
    this.h = props.h
    this.icon = props.icon
    this.identified = props.identified
    this.ilvl = props.ilvl
    this.inventory_id = props.inventoryId
    this.item_id = props.id
    this.league = props.league
    this.name = cleanName(props.name)
    this.stash_id = stashId
    this.type_line = cleanName(props.typeLine)
    this.updated_ts = 0
    this.verified = props.verified
    this.w = props.w
    this.x = props.x
    this.y = props.y
    this.variable_data = {
      abyss_jewel: props.abyssJewel,
      art_filename: props.artFilename,
      category: props.category,
      descr_text: props.descrText,
      duplicated: props.duplicated,
      elder: props.elder,
      flavour_text: JSON.stringify(props.flavourText),
      is_relic: props.isRelic,
      link_amount: props.sockets ? this.setLinkAmount(props.sockets) : undefined,
      max_stack_size: props.maxStackSize,
      note: this.setNote(props.note, stashNote),
      prophecy_diff_text: props.prophecyDiffText,
      prophecy_text: props.prophecy_text,
      sec_decription_text: props.secDescrText,
      shaper: props.shaper,
      socket_amount: props.sockets ? props.sockets.length : undefined,
      support: props.support,
      talisman_tier: props.talismanTier,
    }

    this.variable_data = JSON.stringify(this.variable_data)
  }

  private setNote(itemNote: string, stashNote: string) {
    const findPriceNote = itemNote ? itemNote.match(/(^~price|^~b\/o|^bo) (\d+) (\w+)/g) : null
    const itemPrice = Array.isArray(findPriceNote) ? findPriceNote[0] : undefined
    const findStashPrice = stashNote ? stashNote.match(/(^~price|^~b\/o|^bo) (\d+) (\w+)/g) : null
    const stashPrice = Array.isArray(findStashPrice) ? findStashPrice[0] : undefined

    return itemPrice ? itemPrice : stashPrice
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
