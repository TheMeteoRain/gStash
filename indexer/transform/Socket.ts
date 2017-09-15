import { Socket } from '../interface'

const transformSocket = (data: any, item_id: string): Socket => {
  const socket: Socket = {
    item_id,
    socket_attr: data.attr,
    socket_group: data.group,
  }

  return socket
}

export default transformSocket
