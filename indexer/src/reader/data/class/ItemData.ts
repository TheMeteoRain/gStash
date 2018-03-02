export default class ItemData {
  public name: string
  public type: string
  public disc: string
  public text: string
  public flags: {} = {}

  constructor({
    name,
    type,
    disc,
    text,
    flags,
  }: {
      name: string,
      type: string,
      disc: string,
      text: string
      flags: any[],
    }) {
    this.name = name
    this.type = type
    this.disc = disc
    this.text = text
    this.flags = flags
  }
}
