import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose'
import { UserModule } from './user.module'
import * as mongoose from 'mongoose'
import seeds, { companies as testCompanies, users as testUsers } from '../../seeds/17-access-group-permission-test'
import { UserDocument } from '../../models/user.model'
import { UserService } from './user.service'
import { CompanyDocument } from '../../models/company.model'

describe('UserService', () => {
  // testing module
  let app: TestingModule

  let module = Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          uri: `mongodb://${configService.get('MONGO_DB_HOST')}:${configService.get('MONGO_DB_PORT')}`,
          dbName: configService.get('MONGO_DB_NAME'),
          user: configService.get('MONGO_DB_USER'),
          pass: configService.get('MONGO_DB_PASSWORD'),
          useCreateIndex: true,
          useNewUrlParser: true,
        }),
        inject: [ConfigService],
      }),
      UserModule,
    ],
  })

  let service: UserService
  let configService: ConfigService
  let connection: mongoose.Connection
  let userModel: mongoose.Model<UserDocument>
  let companyModel: mongoose.Model<CompanyDocument>

  beforeAll(async () => {
    app = await module.compile()

    configService = app.get<ConfigService>(ConfigService)

    // connection for mongo db
    connection = app.get<mongoose.Connection>(getConnectionToken())

    // find the company that is used in testing
    userModel = app.get<mongoose.Model<UserDocument>>(getModelToken('User'))
    companyModel = app.get<mongoose.Model<CompanyDocument>>(getModelToken('Company'))
    service = app.get<UserService>(UserService)
  })

  beforeEach(async () => {
    // truncate and seed everytime
    connection.dropDatabase(configService.get('MONGO_DB_NAME'))

    await seeds(connection)
  })

  afterAll(async () => {
    await app.close()
  })

  const invalidCompanyTenant = '99999999-4999-9999-9999-999999999999'
  const invalidUserObjectId = '99999999-4999-9999-9999-999999999999'

  const newUserObjectId = '00000000-4000-0000-0000-900000000000'

  const companyTenantWithGroups = testCompanies[0].tenant
  const userObjectIdInCompanyWithGroups = testUsers[0].objectId
  const companyTenantWithoutGroups = testCompanies[1].tenant
  const userObjectIdInCompanyWithoutGroups = testUsers[1].objectId

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should be an invalid company', async () => {
    try {
      await service.getOrCreate(invalidCompanyTenant, userObjectIdInCompanyWithoutGroups)
    } catch (e) {
      expect(e.extensions.code).toBe('INVALID_COMPANY')
    }
  })

  it('should be an already existing user', async () => {
    try {
      await service.getOrCreate(companyTenantWithoutGroups, userObjectIdInCompanyWithoutGroups)
    } catch (e) {
      expect(e.extensions.code).toBe('USER_EXISTS')
    }

    try {
      await service.getOrCreate(companyTenantWithoutGroups, userObjectIdInCompanyWithoutGroups)
    } catch (e) {
      expect(e.extensions.code).toBe('USER_EXISTS')
    }
  })

  it('to be an invalid company', async () => {
    try {
      await service.getOrCreate(invalidCompanyTenant, invalidUserObjectId)
    } catch (e) {
      expect(e.extensions.code).toBe('INVALID_COMPANY')
    }
  })

  it('should be allowed to create a new user without groups', async () => {
    const { user } = await service.getOrCreate(companyTenantWithoutGroups, newUserObjectId)

    expect(user.id).toBeDefined()
  })

  it('should be allow to create new user with matching access groups', async () => {
    const { user } = await service.getOrCreate(companyTenantWithGroups, newUserObjectId)

    expect(user.id).toBeDefined()
  })

  it('should not be allow to create a user without matching groups', async () => {
    try {
      await service.getOrCreate(companyTenantWithGroups, newUserObjectId)
    } catch (e) {
      expect(e.extensions.code).toBe('USER_CREATE_NOT_ALLOWED')
    }
  })

  it('should set an user to be disabled is groups are missing', async () => {
    let user = null

    try {
      await service.getOrCreate(companyTenantWithGroups, userObjectIdInCompanyWithGroups)
    } catch (e) {
      expect(e.extensions.code).toBe('USER_EXISTS')
    }

    try {
      await service.getOrCreate(companyTenantWithGroups, userObjectIdInCompanyWithGroups)
    } catch (e) {
      expect(e.extensions.code).toBe('USER_NOT_ALLOWED')
    }

    user = await userModel.findOne({
      objectId: userObjectIdInCompanyWithGroups,
    })

    expect(user.activated).toEqual(false)

    try {
      await service.getOrCreate(companyTenantWithGroups, userObjectIdInCompanyWithGroups)
    } catch (e) {
      expect(e.extensions.code).toBe('USER_EXISTS')
    }

    user = await userModel.findOne({
      objectId: userObjectIdInCompanyWithGroups,
    })

    expect(user.activated).toEqual(true)
  })

  it('should enable a disabled user if groups are missing', async () => {
    let user = null

    try {
      await service.getOrCreate(companyTenantWithGroups, userObjectIdInCompanyWithGroups)
    } catch (e) {
      expect(e.extensions.code).toBe('USER_NOT_ALLOWED')
    }

    user = await userModel.findOne({
      objectId: userObjectIdInCompanyWithGroups,
    })

    expect(user.activated).toEqual(false)

    const company = await companyModel.findOne({
      tenant: companyTenantWithGroups,
    })

    company.settings.access.groups = null
    await company.save()

    try {
      await service.getOrCreate(companyTenantWithGroups, userObjectIdInCompanyWithGroups)
    } catch (e) {
      expect(e.extensions.code).toBe('USER_EXISTS')
    }

    user = await userModel.findOne({
      objectId: userObjectIdInCompanyWithGroups,
    })

    expect(user.activated).toEqual(true)
  })
})
