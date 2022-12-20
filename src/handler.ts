import "reflect-metadata"

import { NestFactory } from "@nestjs/core"
import serverlessExpress from "@vendia/serverless-express"
import { Callback, Context, Handler } from "aws-lambda"
import AppModule from "./app.module"
import { DocumentClientV3 } from "@typedorm/document-client"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import table from "./table"
import { createConnection } from "@typedorm/core"
import { User } from "./users/user.model"
import Application from "./applications/application.model"

let server: Handler
let dynamoDbClient: DocumentClientV3

async function bootstrapNest(): Promise<Handler> {
  const app = await NestFactory.create(AppModule)
  await app.init()

  const expressApp = app.getHttpAdapter().getInstance()

  return serverlessExpress({ app: expressApp })
}

const bootstrapDynamo = () => {
  if (!dynamoDbClient) {
    dynamoDbClient = new DocumentClientV3(
      new DynamoDBClient({
        endpoint: process.env.IS_OFFLINE && "http://localhost:8000",
      })
    )
    createConnection({
      table,
      entities: [User, Application],
      documentClient: dynamoDbClient,
    })
  }
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  console.log(event)
  bootstrapDynamo()
  server = server ?? (await bootstrapNest())
  return server(event, context, callback)
}
