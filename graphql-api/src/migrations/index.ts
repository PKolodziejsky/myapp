import * as mongoose from 'mongoose'
import { readdirSync } from 'fs'
import { join } from 'path'

require('dotenv').config()

const seed = async () => {
  await mongoose.connect('mongodb://root:root@seatti-mongo-db:27017/seatti?authSource=admin')

  const files = readdirSync(__dirname)
    .filter((name) => name.startsWith('2022-04-06-space-type.ts'))
    .sort()

  for (const file of files) {
    const migration = join(__dirname, file)

    const { default: migrator } = await import(migration)

    await migrator()
  }

  await mongoose.disconnect()
}

seed().then(() => console.log('Migration done'))
