const graphql = require('graphql')
const db = require('../db')

const GraphQLJSON = require('graphql-type-json')
const GraphQLBigInt = require('graphql-bigint')

const pagination = require('./pagination')
const defaults = require('./defaults')
const { LeagueType, FrameType, StatDataType, ItemDataType } = require('./stats')

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} = graphql

const PropertyType = new GraphQLObjectType({
  name: 'Property',
  fields: () => ({
    item_id: { type: GraphQLString },
    property_name: { type: GraphQLString },
    property_values: { type: GraphQLJSON },
    property_display_mode: { type: GraphQLInt },
    property_progress: { type: GraphQLFloat },
  }),
})

const RequirementType = new GraphQLObjectType({
  name: 'Requirement',
  fields: () => ({
    item_id: { type: GraphQLString },
    requirement_name: { type: GraphQLString },
    requirement_value: { type: GraphQLInt },
    requirement_value_type: { type: GraphQLInt },
    requirement_display_mode: { type: GraphQLInt },
  }),
})

const ModType = new GraphQLObjectType({
  name: 'Mod',
  fields: () => ({
    item_id: { type: GraphQLString },
    mod_name: { type: GraphQLString },
    mod_type: { type: GraphQLString },
    mod_value1: { type: GraphQLString },
    mod_value2: { type: GraphQLString },
    mod_value3: { type: GraphQLString },
    mod_value4: { type: GraphQLString },
  }),
})

const SocketType = new GraphQLObjectType({
  name: 'Socket',
  fields: () => ({
    item_id: { type: GraphQLString },
    socket_order: { type: GraphQLInt },
    socket_attr: { type: GraphQLString },
    socket_group: { type: GraphQLInt },
  }),
})

const ItemType = new GraphQLObjectType({
  name: 'Item',
  fields: () => ({
    account_name: { type: GraphQLString },
    added_ts: { type: GraphQLBigInt },
    corrupted: { type: GraphQLBoolean },
    crafted: { type: GraphQLBoolean },
    document: { type: GraphQLString },
    enchanted: { type: GraphQLBoolean },
    frame_type: { type: GraphQLInt },
    h: { type: GraphQLInt },
    icon: { type: GraphQLString },
    identified: { type: GraphQLBoolean },
    ilvl: { type: GraphQLInt },
    inventory_id: { type: GraphQLString },
    item_id: { type: GraphQLString },
    league: { type: GraphQLString },
    name: { type: GraphQLString },
    stash_id: { type: GraphQLString },
    type_line: { type: GraphQLString },
    updated_ts: { type: GraphQLBigInt },
    verfied: { type: GraphQLBoolean },
    w: { type: GraphQLInt },
    x: { type: GraphQLInt },
    y: { type: GraphQLInt },
    variable_data: { type: GraphQLJSON },
    requirementsByItemId: {
      type: GraphQLList(RequirementType),
      resolve(parentValue, args) {
        let query = `SELECT * FROM requirements WHERE item_id = '${
          parentValue.item_id
        }'`
        return db
          .manyOrNone(query)
          .then(data => data)
          .catch(err => {
            return 'The error is', err
          })
      },
    },
    propertiesByItemId: {
      type: GraphQLList(PropertyType),
      resolve(parentValue, args) {
        let query = `SELECT * FROM properties WHERE item_id='${
          parentValue.item_id
        }'`
        return db
          .manyOrNone(query)
          .then(data => {
            return data
          })
          .catch(err => {
            return 'The error is', err
          })
      },
    },
    modsByItemId: {
      type: GraphQLList(ModType),
      resolve(parentValue, args) {
        let query = `SELECT * FROM mods WHERE item_id='${parentValue.item_id}'`
        return db
          .manyOrNone(query)
          .then(data => {
            return data
          })
          .catch(err => {
            return 'The error is', err
          })
      },
    },
    socketsByItemId: {
      type: GraphQLList(SocketType),
      resolve(parentValue, args) {
        let query = `SELECT * FROM sockets WHERE item_id='${
          parentValue.item_id
        }'`
        return db
          .manyOrNone(query)
          .then(data => {
            return data
          })
          .catch(err => {
            return 'The error is', err
          })
      },
    },
  }),
})

const addLogicalOperatorIfNotFirst = (string, index) => {
  if (index > 0) return ` AND ${string}`

  return `${string}`
}

const initializeFilterCategory = string => {
  if (string.endsWith(')')) return ` AND (`
  if (string.endsWith('WHERE')) return ` (`

  return ``
}

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    allItems: {
      type: pagination.Page(ItemType),
      args: {
        ...defaults.defaultArgs,
        filter: { type: GraphQLJSON, defaultValue: {} },
      },
      resolve(parentValue, args, context) {
        const { first, last, after, before, filter } = args
        const { item, mod, req, pro } = filter
        let afterIndex = 0

        let query = `SELECT * FROM items`
        if (
          typeof filter !== 'undefined' &&
          Object.entries(filter)[0][1].length > 0
        ) {
          if (mod) query += ` INNER JOIN mods ON mods.item_id=items.item_id`

          query += ` WHERE`
        }

        if (item) {
          let itemQuery = ``
          itemQuery += initializeFilterCategory(query)
          item.forEach(
            (
              { name, value = null, min = null, max = null, find = [] },
              index
            ) => {
              if (name === 'search') {
                value = value.trim()
                if (value.length > 0) {
                  value = value.replace(/\s+/g, '&')
                  return (itemQuery += addLogicalOperatorIfNotFirst(
                    `document @@ to_tsquery('${value}')`,
                    index
                  ))
                }
              }

              if (name === 'category') {
                const map = find.map(i => `"${i}"`)
                return (itemQuery += addLogicalOperatorIfNotFirst(
                  `variable_data @> '{"${name}": {"${value.toLocaleLowerCase()}": [${map}]}}'`,
                  index
                ))
              }

              if (name === 'socket_amount' || name === 'link_amount') {
                if (!min) min = 0
                if (!max) max = 6
                return (itemQuery += addLogicalOperatorIfNotFirst(
                  `(variable_data->>'${name}')::numeric BETWEEN ${min} AND ${max}`,
                  index
                ))
              }

              if (typeof value === 'number') {
                return (itemQuery += addLogicalOperatorIfNotFirst(
                  `${name} = ${value}`,
                  index
                ))
              }

              if (typeof value === 'string') {
                return (itemQuery += addLogicalOperatorIfNotFirst(
                  `${name} = '${value}'`,
                  index
                ))
              }

              if (typeof value === 'boolean') {
                return (itemQuery += addLogicalOperatorIfNotFirst(
                  `${name} IS ${value}`,
                  index
                ))
              }

              if (!value) {
                if (!min) min = 0
                if (!max) max = 100
                return (itemQuery += addLogicalOperatorIfNotFirst(
                  `${name} BETWEEN ${min} AND ${max}`,
                  index
                ))
              }
            }
          )
          itemQuery += `)`

          if (itemQuery.length > 5) query += itemQuery
        }

        if (mod) {
          query += initializeFilterCategory(query)
          mod.name.forEach((name, index) => {
            if (index < mod.name.length - 1)
              return (query += `mod_name ILIKE '%${name}%' ${mod.filter} `)

            return (query += `mod_name ILIKE '%${name}%'`)
          })
          query += ')'
        }

        if (req) {
          query += initializeFilterCategory(query)
          req.forEach(({ name, min, max }, index) => {
            if (!min) min = 0
            if (!max) max = 999
            query += addLogicalOperatorIfNotFirst(
              `EXISTS(SELECT 1 FROM requirements WHERE item_id=items.item_id AND requirement_name = '${name}' AND requirement_value BETWEEN ${min} AND ${max})`,
              index
            )
          })
          query += ')'
        }

        if (pro) {
          query += initializeFilterCategory(query)
          pro.forEach(({ name, min, max }, index) => {
            if (!min) min = 0
            if (!max) max = 999
            query += addLogicalOperatorIfNotFirst(
              `EXISTS(SELECT 1 FROM properties WHERE item_id=items.item_id AND property_name ILIKE '%${name}%' AND SUBSTRING(property_values->0->>'value1' from '[0-9]+')::numeric BETWEEN ${min} AND ${max})`,
              index
            )
          })
          query += ')'
        }

        query += ` ORDER BY added_ts DESC, item_id`
        console.log(query)

        //TODO: last, before
        return db
          .manyOrNone(query)
          .then(data =>
            defaults.defaultReturn({
              data,
              ...args,
              attributeName: 'item_id',
            })
          )
          .catch(err => {
            return 'The error is', err
          })
      },
    },
    // requirement: {
    //   type: pagination.Page(RequirementType),
    //   args: { ...defaults.defaultArgs },
    //   resolve(parentValue, args) {
    //     let query = `SELECT * FROM requirements`
    //     if (args.first) query += ` LIMIT ${args.first}`
    //     return db
    //       .manyOrNone(query)
    //       .then(data => {
    //         return data
    //       })
    //       .catch(err => {
    //         return 'The error is', err
    //       })
    //   },
    // },
    allLeagues: {
      type: pagination.Page(LeagueType),
      args: { ...defaults.defaultArgs },
      resolve(parentValue, args) {
        let query = `SELECT * FROM leagues`
        return db
          .manyOrNone(query)
          .then(data =>
            defaults.defaultReturn({
              data,
              ...args,
              attributeName: 'league_name',
            })
          )
          .catch(err => {
            return 'The error is', err
          })
      },
    },
    allItemCategories: {
      type: GraphQLList(ItemDataType),
      resolve(parentValue, args) {
        let query = `SELECT label FROM items_data GROUP BY label ORDER BY label`
        return db
          .manyOrNone(query)
          .then(data => data)
          .catch(err => {
            return 'The error is', err
          })
      },
    },
    allItemsData: {
      type: pagination.Page(ItemDataType),
      args: { ...defaults.defaultArgs },
      resolve(parentValue, args) {
        let query = `SELECT * FROM items_data`
        return db
          .manyOrNone(query)
          .then(data =>
            defaults.defaultReturn({
              data,
              ...args,
              attributeName: 'text',
            })
          )
          .catch(err => {
            return 'The error is', err
          })
      },
    },
    allStatsData: {
      type: pagination.Page(StatDataType),
      args: { ...defaults.defaultArgs },
      resolve(parentValue, args) {
        let query = `SELECT * FROM stats_data`
        return db
          .manyOrNone(query)
          .then(data =>
            defaults.defaultReturn({
              data,
              ...args,
              attributeName: 'id',
            })
          )
          .catch(err => {
            return 'The error is', err
          })
      },
    },
    allFrameTypes: {
      type: pagination.Page(FrameType),
      args: { ...defaults.defaultArgs },
      resolve(parentValue, args) {
        let query = `SELECT * FROM frame_type`
        return db
          .manyOrNone(query)
          .then(data =>
            defaults.defaultReturn({
              data,
              ...args,
              attributeName: 'frame_type_value',
            })
          )
          .catch(err => {
            return 'The error is', err
          })
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
})
