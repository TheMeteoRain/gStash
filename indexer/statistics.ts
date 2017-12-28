const statistics = (events: any) => {
  const calculateTotal = (property: any) => {
    let total = 0
    for (const event of events) {
      total = total + event ? event[property] : 0
    }

    return total
  }

  const getRow = (event: any) => {
    return event ? event.rowCount : 0
  }

  const statistics = {
    accounts: getRow(events[0]),
    stashes: getRow(events[1]),
    items: getRow(events[2]),
    sockets: getRow(events[3]),
    properties: getRow(events[4]),
    requirements: getRow(events[5]),
    mods: getRow(events[6]),
    removed: getRow(events[7]),
    failed: 0,
    duration: calculateTotal('duration'),
    saved: calculateTotal('rowCount'),
  }

  printStats(statistics)

  return statistics
}

const printStats = (stats: any) => {
  console.log(
    `Total downloaded: ${0}, saved: ${stats.saved} \n`,
    `Accounts: saved: ${stats.accounts} \n`,
    `Stashes: saved: ${stats.stashes} \n`,
    `Items: saved: ${stats.items} \n`,
    `Sockets: saved: ${stats.sockets} \n`,
    `Properties: saved: ${stats.properties} \n`,
    `Requirements: saved: ${stats.requirements} \n`,
    `Mods: saved: ${stats.mods} \n`,
    `Stashes: removed: ${stats.removed} \n`,
  )
}

export default statistics