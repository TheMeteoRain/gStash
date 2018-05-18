import gql from 'graphql-tag'

const getFilters = gql`
  query allFilters {
    allLeagues {
      nodes {
        leagueName
        active
        nodeId
      }
    }
    allFrameTypes {
      nodes {
        frameTypeValue
        id
        nodeId
      }
    }
    allStatsData {
      nodes {
        id
        text
        type
      }
    }
    allItemsData {
      nodes {
        name
        type
        disc
        text
      }
    }
  }
`

const getItems = gql`
  query allItemsQuery(
    $search: String
    $leagueName: String
    $frameType: Int
    $socketAmountMin: Int
    $socketAmountMax: Int
    $linkAmountMin: Int
    $linkAmountMax: Int
    $itemLvlMin: Int
    $itemLvlMax: Int
    $isIdentified: Boolean
    $isVerified: Boolean
    $isEnchanted: Boolean
    $isCrafted: Boolean
    $isCorrupted: Boolean
    $first: Int
    $cursor: Cursor
  ) {
    searchItems(
      search: $search
      leagueName: $leagueName
      frametype: $frameType
      socketAmountMin: $socketAmountMin
      socketAmountMax: $socketAmountMax
      linkAmountMin: $linkAmountMin
      linkAmountMax: $linkAmountMax
      itemLvlMin: $itemLvlMin
      itemLvlMax: $itemLvlMax
      isIdentified: $isIdentified
      isVerified: $isVerified
      isEnchanted: $isEnchanted
      isCrafted: $isCrafted
      isCorrupted: $isCorrupted
      first: $first
      after: $cursor
    ) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          nodeId
          icon
          name
          typeLine
          frameType
          x
          y
          inventoryId
          addedTs
          updatedTs
          enchanted
          crafted
          accountName
          w
          h
          nodeId
          ilvl
          league
          itemId
          identified
          verified
          corrupted
          variableData
          stashByStashId {
            stashName
          }
          accountByAccountName {
            lastCharacterName
          }
          requirementsByItemId {
            nodes {
              nodeId
              requirementName
              requirementValue
              requirementValueType
              requirementDisplayMode
            }
          }
          modsByItemId {
            nodes {
              modName
              modValue1
              modValue2
              modValue3
              modValue4
              modType
            }
          }
          socketsByItemId {
            nodes {
              socketOrder
              socketGroup
              socketAttr
            }
          }
          propertiesByItemId {
            nodes {
              nodeId
              propertyName
              propertyValues
              propertyDisplayMode
              propertyProgress
            }
          }
        }
      }
    }
  }
`

const items = gql`
  query {
    allItems(first: 10) {
      edges {
        node {
          addedTs
          document
          icon
          ilvl
          inventoryId
          league
          name
          stashId
          typeLine
          updatedTs
          w
          x
          y
          variableData
        }
      }
    }
  }
`

export { getFilters, getItems, items }
