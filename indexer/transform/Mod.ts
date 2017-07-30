import { Mod, ModType } from '../interface'


const re1 = /[(\d.\-)]+/g
const re2 = /[\d.]+/g

const transformMod = (data: string, itemId: string, modType: string = ModType[ModType.IMPLICIT]): Mod => {

  const modName: string = data.replace(re1, '#')
  const values: RegExpMatchArray | null = data.match(re2)

  const mod: Mod = {
    itemId,
    modName,
    modValue1: values ? values[0] : '0',
    modValue2: values ? values[1] : '0',
    modValue3: values ? values[2] : '0',
    modValue4: values ? values[3] : '0',
    modType
  }

  return mod
}

export default transformMod