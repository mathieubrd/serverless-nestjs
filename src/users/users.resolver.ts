import { Resolver, Query, Args, Mutation, Field, InputType } from "@nestjs/graphql"
import { getEntityManager } from "@typedorm/core"
import { User } from "./user.model"

@InputType()
export class CreateUserInput {
  @Field()
  email: string

  @Field()
  firstName: string

  @Field()
  lastName: string
}

@Resolver((of) => User)
export class UsersResolver {
  @Query((returns) => [User])
  async users() {
    const users = await getEntityManager().find(
      User,
      {},
      {
        queryIndex: "entity",
      }
    )

    return users.items
  }

  @Query((returns) => User, { nullable: true })
  async user(@Args("email") email: string) {
    const user = await getEntityManager().findOne(User, {
      email,
    })

    return user
  }

  @Mutation((returns) => User)
  async createUser(@Args("userInput") userInput: CreateUserInput) {
    const { email, firstName, lastName } = userInput
    const user = new User()
    user.email = email
    user.firstName = firstName
    user.lastName = lastName
    return getEntityManager().create(user)
  }
}
