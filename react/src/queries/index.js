import gql from 'graphql-tag'

const QUERY_FILTERS = gql`
  query allFilters {
    allLeagues(first: null) {
      nodes {
        league_name
      }
    }
    allItemCategories {
      category: label
    }
    allItemsData(first: null) {
      nodes {
        text
      }
    }
    allFrameTypes(first: null) {
      nodes {
        frame_type_value
      }
    }
  }
`

const QUERY_ITEMS = gql`
  query allItemsQuery($first: Int = 10, $cursor: String, $filter: JSON) {
    allItems(first: $first, after: $cursor, filter: $filter) {
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          account_name
          added_ts
          corrupted
          crafted
          document
          enchanted
          frame_type
          h
          icon
          identified
          ilvl
          inventory_id
          item_id
          league
          name
          stash_id
          type_line
          updated_ts
          verfied
          w
          x
          y
          variable_data
          requirementsByItemId {
            requirement_name
            requirement_value
            requirement_value_type
            requirement_display_mode
          }
          modsByItemId {
            mod_name
            mod_type
            mod_value1
            mod_value2
            mod_value3
            mod_value4
          }
          socketsByItemId {
            socket_order
            socket_attr
            socket_group
          }
          propertiesByItemId {
            property_name
            property_values
            property_display_mode
            property_progress
          }
        }
      }
    }
  }
`

export { QUERY_FILTERS, QUERY_ITEMS }
