const graphql = require('graphql')
const { GraphQLInt, GraphQLString } = graphql

const pagination = require('./pagination')

const defaultArgs = {
  first: {
    type: GraphQLInt,
    description: 'Only read the first (n) values of the set. Defaults to 10.',
    defaultValue: 10,
  },
  last: {
    type: GraphQLInt,
    description: 'Only read the last (n) values of the set.',
  },
  after: {
    type: GraphQLString,
    description: 'Read all values in the set after (below) this cursor.',
  },
  before: {
    type: GraphQLString,
    description: 'Read all values in the set before (above) this cursor.',
  },
}

const defaultReturn = ({ data, first, last, after, before, attributeName }) => {
  let afterIndex = 0

  if (typeof after === 'string' || typeof before === 'string') {
    const item_id = pagination.convertCursorToNodeId(after)
    if (typeof item_id === 'string') {
      const matchingIndex = data.findIndex(
        element => element[attributeName] === item_id
      )
      if (typeof matchingIndex === 'number') {
        afterIndex = matchingIndex
      }
    }
  }

  let edges = null
  const sliceIndex = afterIndex + 1

  if (first === null) {
    edges = data.map(node => ({
      node,
      cursor: pagination.convertNodeToCursor(node[attributeName]),
    }))
    // console.log(Object.getOwnPropertyNames(data[0]).map(e => e.replace()))
  } else {
    // Add 1 to exclude item matching after index.
    edges = data.slice(sliceIndex, sliceIndex + first).map(node => ({
      node,
      cursor: pagination.convertNodeToCursor(node[attributeName]),
    }))
    data = data.slice(sliceIndex, sliceIndex + first)
  }

  const startCursor =
    edges.length > 0
      ? pagination.convertNodeToCursor(edges[0].node[attributeName])
      : null
  const endCursor =
    edges.length > 0
      ? pagination.convertNodeToCursor(
        edges[edges.length - 1].node[attributeName]
      )
      : null
  const hasNextPage = data.length > sliceIndex + first
  const hasPreviousPage = data.length < sliceIndex + first

  return {
    totalCount: data.length,
    nodes: data,
    edges,
    pageInfo: {
      startCursor,
      endCursor,
      hasNextPage,
      hasPreviousPage,
    },
  }
}

module.exports = {
  defaultArgs,
  defaultReturn,
}
