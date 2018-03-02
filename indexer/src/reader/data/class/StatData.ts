export default class StatData {
  public id: string
  public text: string
  public type: string

  constructor(id: string, text: string, type: string) {
    this.id = id
    this.text = text.replace(/'/g, '\'').replace(/[\r\n|\n]+/g, '. ')
    this.type = type
  }
}
