import { ApolloDriverConfig, ApolloDriver } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core"
import { ApplicationsModule } from "./applications/applications.module"
import { UsersModule } from "./users/users.module"

@Module({
  imports: [
    UsersModule,
    ApplicationsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: true,
      plugins: process.env.IS_OFFLINE ? [ApolloServerPluginLandingPageLocalDefault()] : undefined,
    }),
  ],
})
class AppModule {}

export default AppModule
