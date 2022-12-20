import { NestFactory } from "@nestjs/core"
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from "@nestjs/graphql"
import { printSchema } from "graphql"
import { UsersResolver } from "./users/users.resolver"
import fs from "fs/promises"
import { ApplicationsResolver } from "./applications/applications.resolver"

const generateSchema = async (path: string) => {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule)
  await app.init()

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory)
  const schema = await gqlSchemaFactory.create([UsersResolver, ApplicationsResolver])

  await fs.writeFile(path, printSchema(schema))
}

if (process.argv.length < 2) {
  console.error("usage: generateSchema.ts [output file]")
}

generateSchema(process.argv[2] as string)
