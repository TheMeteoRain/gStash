import { Socket } from '../interface'

const transformSocket = (data: any, item_id: string): Socket => {
  const socket: Socket = {
    item_id,
    socket_group: data.group,
    socket_attr: data.attr,
  }

  return socket
}

export default transformSocket
