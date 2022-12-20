import { Args, Field, InputType, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql"
import { getEntityManager } from "@typedorm/core"
import { GraphQLError } from "graphql"
import { User } from "../users/user.model"
import Application from "./application.model"

@InputType()
export class CreateApplicationInput {
  @Field()
  aspireCode: string

  @Field()
  name: string

  @Field()
  ownerEmail: string
}

@Resolver((of) => Application)
export class ApplicationsResolver {
  @Mutation((returns) => Application)
  async createApplication(@Args("applicationInput") applicationInput: CreateApplicationInput) {
    const entityManager = getEntityManager()
    const { aspireCode, name, ownerEmail } = applicationInput

    const user = await entityManager.findOne(User, {
      email: ownerEmail,
    })

    if (!user) {
      throw new GraphQLError(`User ${ownerEmail} does not exist`, {
        extensions: {
          exception: {
            code: "BAD_USER_INPUT",
          },
        },
      })
    }

    const application = new Application()
    application.aspireCode = aspireCode
    application.name = name
    application.ownerEmail = ownerEmail

    return await getEntityManager().create(application)
  }

  @Query((returns) => [Application])
  async applications() {
    const applications = await getEntityManager().find(
      Application,
      {},
      {
        queryIndex: "entity",
      }
    )

    return applications.items
  }

  @ResolveField("owner", (returns) => User)
  async owner(@Parent() application: Application) {
    const { ownerEmail } = application
    return await getEntityManager().findOne(User, {
      email: ownerEmail,
    })
  }
}
