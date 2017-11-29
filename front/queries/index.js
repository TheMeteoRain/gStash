import { gql } from 'react-apollo'

const queries = {
  getLeagues: gql`query allLeaguesQuery {
    allLeagues {
      edges {
        node {
          nodeId
          active
          leagueName
        }
      }
    }
  }`,
  getItems: gql`query allItemsQuery ($leagueName: String, $search: String, $socketAmountMin: Int, $socketAmountMax: Int, $linkAmountMin: Int, $linkAmountMax: Int, $itemLvlMin: Int, $itemLvlMax: Int, $isIdentified: Boolean, $isVerified: Boolean, $isEnchanted: Boolean, $isCrafted: Boolean, $isCorrupted: Boolean, $first: Int, $cursor: Cursor){
    searchItems(leagueName: $leagueName, search: $search, socketAmountMin: $socketAmountMin, socketAmountMax: $socketAmountMax, linkAmountMin: $linkAmountMin, linkAmountMax: $linkAmountMax, itemLvlMin: $itemLvlMin, itemLvlMax: $itemLvlMax, isIdentified: $isIdentified, isVerified: $isVerified, isEnchanted: $isEnchanted, isCrafted: $isCrafted, isCorrupted: $isCorrupted, first: $first, after: $cursor ) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          icon
          name
          typeLine
          lockedToCharacter
          frameType
          x
          y
          inventoryId
          addedTs
          updatedTs
          flavourText
          price
          enchanted
          crafted
          accountName
          available
          w
          h
          nodeId
          ilvl
          league
          itemId
          identified
          verified
          corrupted
          linkAmount
          socketAmount
          requirementsByItemId {
            nodes {
              itemId
                requirementName
                requirementValue
                requirementKey
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
              modKey
            }
          }
          socketsByItemId {
            nodes {
              socketGroup
              socketAttr
            }
          }
          propertiesByItemId {
            nodes {
              propertyKey
              propertyName
              propertyValue1
              propertyValue2
            }
          }
        }
      }
    }
  }`,
}

export default queries