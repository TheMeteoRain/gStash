import { ModType } from '../enum'
import { Mod } from '../interface'

const RE_SELECT_NUMBERS_DOT_DASH_ROUND_BRACKETS = /[(\d.\-)]+/g
const RE_SELECT_NUMBERS_DOT = /[\d.]+/g

const transformMod = (data: string, item_id: string, mod_type: string = ModType[ModType.IMPLICIT]): Mod => {

  const mod_name: string = data.replace(RE_SELECT_NUMBERS_DOT_DASH_ROUND_BRACKETS, '#')
  const values: RegExpMatchArray | null = data.match(RE_SELECT_NUMBERS_DOT)

  const mod: Mod = {
    item_id,
    mod_name,
    mod_value1: values ? values[0] : null,
    mod_value2: values ? values[1] : null,
    mod_value3: values ? values[2] : null,
    mod_value4: values ? values[3] : null,
    mod_type,
  }

  return mod
}

export default transformMod
