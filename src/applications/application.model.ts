import { Field, ObjectType } from "@nestjs/graphql"
import { Attribute, Entity, INDEX_TYPE, TransformToDynamo } from "@typedorm/common"
import { User } from "../users/user.model"

@Entity({
  name: "Application",
  primaryKey: {
    partitionKey: "APP#{{aspireCode}}",
    sortKey: "APP#{{aspireCode}}",
  },
  indexes: {
    entity: {
      type: INDEX_TYPE.GSI,
      partitionKey: "Application",
      sortKey: "APP#{{aspireCode}}",
    },
    gsi: {
      type: INDEX_TYPE.GSI,
      partitionKey: "{{aspireCode}}",
      sortKey: "{{aspireCode}}",
    },
  },
})
@ObjectType()
class Application {
  @Field()
  @Attribute({ unique: true })
  @TransformToDynamo(({ value }: { value: string }) => value.toUpperCase())
  aspireCode: string

  @Field()
  @Attribute()
  name: string

  @Field()
  private owner: User

  @Attribute()
  @TransformToDynamo(({ value }: { value: string }) => value.toLowerCase())
  ownerEmail: string
}

export default Application
