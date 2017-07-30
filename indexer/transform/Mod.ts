import { Mod, ModType } from '../interface'


const re1 = /[(\d.\-)]+/g
const re2 = /[\d.]+/g

const transformMod = (data: string, item_id: string, mod_type: string = ModType[ModType.IMPLICIT]): Mod => {

  const mod_name: string = data.replace(re1, '#')
  const values: RegExpMatchArray | null = data.match(re2)

  const mod: Mod = {
    item_id,
    mod_name,
    mod_value1: values ? values[0] : '0',
    mod_value2: values ? values[1] : '0',
    mod_value3: values ? values[2] : '0',
    mod_value4: values ? values[3] : '0',
    mod_type
  }

  return mod
}

export default transformMod