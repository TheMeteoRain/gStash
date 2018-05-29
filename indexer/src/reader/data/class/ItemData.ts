export default class ItemData {
  public label: string
  public name: string
  public type: string
  public disc: string
  public text: string
  public flags: {} = {}

  constructor({
    label,
    name,
    type,
    disc,
    text,
    flags,
  }: {
      label: string,
      name: string,
      type: string,
      disc: string,
      text: string
      flags: any[],
    }) {
    this.label = label
    this.name = name
    this.type = type
    this.disc = disc
    this.text = text
    this.flags = flags
  }
}
