import Application from "./src/applications/application.model"
import { faker } from "@faker-js/faker"

const applications = (amount: number) => {
  const applications = [...Array(amount).keys()].map(() => {
    const application = new Application()
  })
}
