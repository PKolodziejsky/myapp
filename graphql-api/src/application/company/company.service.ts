import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CompanyDocument } from '../../models/company.model'

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel('Company')
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  getByTenant(tenantId: string): Promise<CompanyDocument | null> {
    return this.companyModel.findOne({ tenant: tenantId }).exec()
  }
}
