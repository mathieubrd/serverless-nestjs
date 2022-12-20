import { ObjectType, Field } from "@nestjs/graphql"
import { Attribute, Entity, INDEX_TYPE, TransformToDynamo } from "@typedorm/common"

@Entity({
  name: "User",
  primaryKey: {
    partitionKey: "USER#{{email}}",
    sortKey: "USER#{{email}}",
  },
  indexes: {
    entity: {
      type: INDEX_TYPE.GSI,
      partitionKey: "User",
      sortKey: "USER#{{email}}",
    },
    gsi: {
      type: INDEX_TYPE.GSI,
      partitionKey: "{{email}}",
      sortKey: "{{email}}",
    },
  },
})
@ObjectType()
export class User {
  @Field()
  @Attribute()
  firstName: string

  @Field()
  @Attribute()
  lastName: string

  @Field()
  @Attribute()
  @TransformToDynamo(({ value }: { value: string }) => value.toLowerCase())
  email: string
}
