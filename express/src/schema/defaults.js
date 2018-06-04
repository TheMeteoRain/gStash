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
  if (data.length === 0) return

  let atIndex = 0

  if (typeof after === 'string' || typeof before === 'string') {
    const item_id = pagination.convertCursorToNodeId(after)

    if (typeof item_id === 'string') {
      const matchingIndex = data.findIndex(
        element => element[attributeName] === item_id
      )
      if (typeof matchingIndex === 'number') {
        atIndex = matchingIndex
      }
    }
  }

  let edges = null
  if (after) {
    // Add 1 to exclude item matching after index.
    atIndex += 1

    if (last) {
      edges = data
        .slice(atIndex)
        .slice(-last)
        .map(node => ({
          node,
          cursor: pagination.convertNodeToCursor(node[attributeName]),
        }))
    } else {
      edges = data.slice(atIndex, atIndex + first).map(node => ({
        node,
        cursor: pagination.convertNodeToCursor(node[attributeName]),
      }))
    }
  } else if (before) {
    if (last) {
      edges = data
        .slice(0, atIndex)
        .slice(-last)
        .map(node => ({
          node,
          cursor: pagination.convertNodeToCursor(node[attributeName]),
        }))
    } else {
      edges = data
        .slice(0, atIndex)
        .slice(0, first)
        .map(node => ({
          node,
          cursor: pagination.convertNodeToCursor(node[attributeName]),
        }))
    }
  } else {
    if (last) {
      edges = data.slice(-last).map(node => ({
        node,
        cursor: pagination.convertNodeToCursor(node[attributeName]),
      }))
    } else {
      edges = data.slice(atIndex, atIndex + first).map(node => ({
        node,
        cursor: pagination.convertNodeToCursor(node[attributeName]),
      }))
    }
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

  const hasNextPage =
    pagination.convertNodeToCursor(data[data.length - 1][attributeName]) !==
    endCursor
  const hasPreviousPage =
    pagination.convertNodeToCursor(data[0][attributeName]) !== startCursor

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
