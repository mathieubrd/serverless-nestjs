import { Table, INDEX_TYPE } from "@typedorm/common"

const table = new Table({
  name: "graphql-serverless",
  partitionKey: "pk",
  sortKey: "sk",
  indexes: {
    entity: {
      type: INDEX_TYPE.GSI,
      partitionKey: "entity",
      sortKey: "pk",
    },
    gsi: {
      type: INDEX_TYPE.GSI,
      partitionKey: "gsipk",
      sortKey: "gsisk",
    },
  },
})

export default table
