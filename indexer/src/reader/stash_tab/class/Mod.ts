import { ModType } from '../enum/ModType'

const RE_SELECT_NUMBER_DOT_DASH_ROUND_BRACKETS = /[(\d.\-)]+/g
const RE_SELECT_NUMBER_DOT = /[\d.]+/g

export default class Mod {

  public item_id: string
  public mod_name: string | null
  public mod_type: string
  public mod_value1: string | null
  public mod_value2: string | null
  public mod_value3: string | null
  public mod_value4: string | null

  constructor(itemId: string, modName: string, modType: ModType) {
    this.item_id = itemId
    this.mod_name = null
    this.mod_type = ModType[modType]
    this.mod_value1 = null
    this.mod_value2 = null
    this.mod_value3 = null
    this.mod_value4 = null

    this.setValues(modName)
  }

  private setValues(modName: string) {
    const mod_name: string = encodeURI(modName.replace(RE_SELECT_NUMBER_DOT_DASH_ROUND_BRACKETS, '#'))
    const values: RegExpMatchArray | null = modName.match(RE_SELECT_NUMBER_DOT)

    this.mod_name = mod_name
    this.mod_value1 = values ? values[0] : null
    this.mod_value2 = values ? values[1] : null
    this.mod_value3 = values ? values[2] : null
    this.mod_value4 = values ? values[3] : null
  }
}
