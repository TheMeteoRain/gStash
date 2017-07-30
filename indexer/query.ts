import db from './db'
import { Stash, Account, Item, Property, Requirement, Socket, Mod } from './interface'


const queries = {
  updateCurrentNextChangeId: (next_change_id: string, processed: number = 0): Promise<any> =>
    db.result('INSERT INTO changeid(nextChangeId, processed) VALUES($<next_change_id>, $<processed>) ON CONFLICT (nextChangeId) DO UPDATE SET (processed) = (EXCLUDED.processed)', { next_change_id, processed: 1 }),
  getLatestNextChangeId: (): Promise<string> =>
    db.one('SELECT nextChangeId FROM changeId WHERE processed = 0 OR processed = 1 ORDER BY id DESC LIMIT 1').then((data: any): Promise<string> => data.nextchangeid),

  setAccount: (t: any, account: Account): any =>
    account.accountName ? t.result('INSERT INTO accounts(accountName, lastCharacterName, lastSeen) VALUES ($<accountName>, $<lastCharacterName>, $<lastSeen>) ON CONFLICT (accountName) DO UPDATE SET lastSeen = EXCLUDED.lastSeen, lastCharacterName = EXCLUDED.lastCharacterName', account) : '',

  setStash: (t: any, stash: Stash): any =>
    t.result('INSERT INTO stashes(stashId, stashName, stashType, stashPublic) VALUES ($<stashId>, $<stashName>, $<stashType>, $<stashPublic>) ON CONFLICT (stashId) DO UPDATE SET stashName = EXCLUDED.stashName, stashType = EXCLUDED.stashType, stashPublic = EXCLUDED.stashPublic', stash),

  setItem: (t: any, item: Item): any =>
    t.result('INSERT INTO items(w, h, ilvl, icon, league, itemId, name, typeLine, identified, verified, corrupted, lockedToCharacter, frameType, x, y, inventoryId, accountName, stashId, socketAmount, linkAmount, available, addedTs, updatedTs, flavourText, price, crafted) VALUES ($<w>, $<h>, $<ilvl>, $<icon>, $<league>, $<itemId>, $<name>, $<typeLine>, $<identified>, $<verified>, $<corrupted>, $<lockedToCharacter>, $<frameType>, $<x>, $<y>, $<inventoryId>, $<accountName>, $<stashId>, $<socketAmount>, $<linkAmount>, $<available>, $<addedTs>, $<updatedTs>, $<flavourText>, $<price>, $<crafted>) ON CONFLICT (itemId) DO UPDATE SET w = EXCLUDED.w, h = EXCLUDED.h, league = EXCLUDED.league, identified = EXCLUDED.identified, verified = EXCLUDED.verified, corrupted = EXCLUDED.corrupted, x = EXCLUDED.x, y = EXCLUDED.y, inventoryId = EXCLUDED.inventoryId, accountName = EXCLUDED.accountName, stashId = EXCLUDED.stashId, socketAmount = EXCLUDED.socketAmount, linkAmount = EXCLUDED.linkAmount, available = EXCLUDED.available, updatedTs = EXCLUDED.addedTs, price = EXCLUDED.price', item),

  setProperty: (t: any, property: Property): any =>
    t.result('INSERT INTO properties(itemId, propertyName, propertyValue1, propertyValue2) VALUES($<itemId>, $<propertyName>, $<propertyValue1>, $<propertyValue2>)', property),

  setRequirement: (t: any, requirement: Requirement): any =>
    t.result('INSERT INTO requirements(itemId, requirementName, requirementValue) VALUES($<itemId>, $<requirementName>, $<requirementValue>)', requirement),

  setSocket: (t: any, socket: Socket): any =>
    t.result('INSERT INTO sockets(itemId, socketGroup, socketAttr) VALUES($<itemId>, $<socketGroup>, $<socketAttr>)', socket),

  setMod: (t: any, mod: Mod): any =>
    t.result('INSERT INTO mods(itemId, modName, modValue1, modValue2, modValue3, modValue4, modType) VALUES($<itemId>, $<modName>, $<modValue1>, $<modValue2>, $<modValue3>, $<modValue4>, $<modType>)', mod)
}

export default queries