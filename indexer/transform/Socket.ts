import { Socket } from '../interface'

const transformSocket = (data: any): Socket => {
  const { values } = data

  const socket: Socket = {
    itemId: data.itemId,
    socketGroup: data.group,
    socketAttr: data.attr
  }

  return socket
}

export default transformSocket