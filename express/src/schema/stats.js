const graphql = require('graphql')
const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean } = graphql

const LeagueType = new GraphQLObjectType({
  name: 'League',
  fields: () => ({
    league_name: { type: GraphQLString },
    active: { type: GraphQLBoolean },
  }),
})

const ItemDataType = new GraphQLObjectType({
  name: 'ItemData',
  fields: () => ({
    label: { type: GraphQLString },
    name: { type: GraphQLString },
    type: { type: GraphQLString },
    disc: { type: GraphQLString },
    text: { type: GraphQLString },
  }),
})

const StatDataType = new GraphQLObjectType({
  name: 'StatData',
  fields: () => ({
    id: { type: GraphQLString },
    text: { type: GraphQLString },
    type: { type: GraphQLString },
  }),
})

const FrameType = new GraphQLObjectType({
  name: 'FrameType',
  fields: () => ({
    id: { type: GraphQLInt },
    frame_type_value: { type: GraphQLString },
  }),
})

module.exports = {
  LeagueType,
  StatDataType,
  ItemDataType,
  FrameType,
}
