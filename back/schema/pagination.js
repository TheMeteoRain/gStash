const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
} = require('graphql')

const Edge = itemType => {
  return new GraphQLObjectType({
    name: `${itemType.name}Edge`,
    description: 'Generic edge to allow cursors',
    fields: () => ({
      node: { type: itemType },
      cursor: { type: GraphQLString },
    }),
  })
}

const PageInfo = new GraphQLObjectType({
  name: 'PageInfo',
  description: 'Information about current page',
  fields: () => ({
    startCursor: { type: GraphQLString },
    endCursor: { type: GraphQLString },
    hasNextPage: { type: GraphQLBoolean },
    hasPreviousPage: { type: GraphQLBoolean },
  }),
})

const Page = itemType => {
  return new GraphQLObjectType({
    name: `${itemType.name}Page`,
    description: 'Page',
    fields: () => ({
      nodes: { type: new GraphQLList(itemType) },
      totalCount: { type: GraphQLInt },
      edges: { type: new GraphQLList(Edge(itemType)) },
      pageInfo: { type: PageInfo },
    }),
  })
}

const convertNodeToCursor = node => {
  return bota(node.toString())
}

const bota = input => {
  return new Buffer(input.toString(), 'binary').toString('base64')
}

const convertCursorToNodeId = cursor => {
  return atob(cursor)
}

const atob = input => {
  return new Buffer(input, 'base64').toString('binary')
}

module.exports = {
  Edge,
  PageInfo,
  Page,
  convertNodeToCursor,
  bota,
  convertCursorToNodeId,
  atob,
}
