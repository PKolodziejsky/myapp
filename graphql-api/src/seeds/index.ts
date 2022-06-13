import * as mongoose from 'mongoose'
import { readdirSync } from 'fs'
import { join } from 'path'

require('dotenv').config()

const seed = async () => {
  await mongoose.connect('mongodb://root:root@localhost:27017/seatti?authSource=admin')

  const files = readdirSync(__dirname)
    .filter((name) => name.startsWith('01-seatti-demo'))
    .sort()

  for (const file of files) {
    const seed = join(__dirname, file)

    const { default: seeder } = await import(seed)

    await seeder()
  }

  await mongoose.disconnect()
}

seed().then(() => console.log('Seeding done'))
