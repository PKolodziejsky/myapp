import mongoose from 'mongoose'
import { companySchema } from '../models/company.model'
import { userSchema } from '../models/user.model'
import { toDocumentId } from '../utilities/document'

export const users = [
  {
    objectId: '00000000-4000-0000-0000-300000000000',
  },
  {
    objectId: '00000000-4000-0000-0000-400000000000',
  },
]

export const companies = [
  {
    name: 'Company with groups',
    tenant: '0000-0000-0000-0000-0003',
    settings: {
      access: {
        groups: ['0', '1'],
      },
    },
  },
  {
    name: 'Company without groups',
    tenant: '0000-0000-0000-0000-0004',
  },
]

const wait = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000)
  })

export default async (connection?: mongoose.Connection) => {
  const adapter = connection ? connection : mongoose.connection

  const Company = adapter.model('Company', companySchema)
  const User = adapter.model('User', userSchema)

  const companyEntities = []
  for (let c of companies) {
    const company = new Company(c)

    await company.save()

    companyEntities.push(company)
  }

  for (let [index, u] of users.entries()) {
    const user = new User({
      company: toDocumentId(companyEntities[index].id),
      objectId: u.objectId,
    })

    await user.save()
  }

  await wait()
}
