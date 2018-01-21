import { ISocket } from '../interface'

export default class Socket implements ISocket {

  public item_id: string
  public socket_attr: string
  public socket_group: number

  constructor(itemId: string, { ...props }) {
    this.item_id = itemId
    this.socket_attr = props.attr
    this.socket_group = props.group
  }
}
