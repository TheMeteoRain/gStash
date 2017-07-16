import fetch from 'node-fetch'

async function recursive(id: number): Promise<boolean> {
    const { next_change_id, stashes } = await stash(id)
    console.log(stashes[0])
    console.log(next_change_id)

    if (checkForNextChangeId(next_change_id)) {
        return recursive(next_change_id)
    }

    return false
}

const stash = (id: number) => {
    return fetch(`http://api.pathofexile.com/public-stash-tabs?id=${id}`).then((res: any) => {
        return res.json()
    })
}

const checkForNextChangeId = (next_change_id: number) => {
    let nextIdIsFound = false

    if (next_change_id !== undefined) {
        nextIdIsFound = true
    }

    return nextIdIsFound
}

recursive(0)
/* const recursive = (id: number) => {
    const next_change_id: number = exe(id)
    checkForNextChangeId(next_change_id)

}

const a = (id: number) => {
    return fetch(`http://api.pathofexile.com/public-stash-tabs?id=${id}`).then((res: any) => {
        return res.json()
    })
}
async function exe(id: number) {
    const data = await a(id)
    console.log(data.stashes[0])
    return data.next_change_id
}

const checkForNextChangeId = (next_change_id: number) => {
    return new Promise((resolve, reject) => {
        if (next_change_id !== undefined) {
            a()
        }
    })
}


exe() */
