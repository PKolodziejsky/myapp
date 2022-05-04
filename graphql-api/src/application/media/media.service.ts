import { Injectable, NotFoundException } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { MediaDocument } from '../../models/media.model'
import { CompanyDocument } from '../../models/company.model'
import { toDocumentId } from '../../utilities/document'

@Injectable()
export class MediaService {
  private s3: S3

  constructor(
    private readonly configService: ConfigService,
    @InjectModel('Media')
    private readonly mediaModel: Model<MediaDocument>,
  ) {
    this.s3 = new S3()
  }

  async getByIds(ids: string) {
    return await this.mediaModel
      .find({
        _id: {
          $in: ids,
        },
      })
      .exec()
  }

  async getStreamByIdAndCompany(id: string, company: string | CompanyDocument) {
    const media = await this.mediaModel
      .findOne({
        _id: id,
        company: toDocumentId(company),
      })
      .exec()

    if (!media) {
      throw new NotFoundException()
    }

    const objectParameter = {
      Bucket: this.configService.get('AWS_S3_MEDIA_BUCKET'),
      Key: media.key,
    }

    try {
      const { ContentType } = await this.s3.headObject(objectParameter).promise()

      return {
        contentType: ContentType,
        readStream: this.s3.getObject(objectParameter).createReadStream(),
      }
    } catch (error) {
      throw new NotFoundException()
    }
  }
}
