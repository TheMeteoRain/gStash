const setAttr = (attr: string | boolean): string => {
  if (!attr)
    return 'A'

  return String(attr)
}

export default class Socket {

  public item_id: string
  public socket_order: number
  public socket_attr: string
  public socket_group: number

  constructor(itemId: string, order_number: number = 0, { ...props }) {
    this.item_id = itemId
    this.socket_order = order_number
    this.socket_attr = setAttr(props.attr)
    this.socket_group = props.group
  }
}
