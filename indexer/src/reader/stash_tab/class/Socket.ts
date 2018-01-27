export default class Socket {

  public item_id: string
  public socket_attr: string | null
  public socket_group: number

  constructor(itemId: string, { ...props }) {
    this.item_id = itemId
    this.setAttr(props.attr)
    this.socket_group = props.group
  }

  private setAttr = (attr: string) => {
    if (attr === 'D' || attr === 'S' || attr === 'I')
      this.socket_attr = attr

    this.socket_attr = null
  }
}
