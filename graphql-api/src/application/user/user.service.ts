import { Injectable } from '@nestjs/common'
import { CompanyService } from '../company/company.service'
import { GraphQLError } from '../../error/graphql.error'
import type { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { UserDocument } from '../../models/user.model'
import { CompanyDocument } from '../../models/company.model'
import { toDocumentId } from '../../utilities/document'
import {MeetingRoomService} from "../space/meeting-room.service";

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
    private readonly companyService: CompanyService,
    private readonly meetingRoomService: MeetingRoomService,
  ) {}

  async getById(id: string): Promise<UserDocument | null> {
    if (id == null) {
      return null
    }

    return this.userModel.findById(id).exec()
  }

  getByCompany(company: string | CompanyDocument): Promise<UserDocument[]> {
    return this.userModel.find({ company: toDocumentId(company) }).exec()
  }

  getByObjectId(objectId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ objectId }).populate('company').exec()
  }

  getByObjectIds(objectIds: string[]): Promise<UserDocument[]> {
    return this.userModel.find({ objectId: { $in: objectIds } }).exec()
  }

  getAdmins(company: string | CompanyDocument): Promise<UserDocument[]> {
    return this.userModel.find({ company: toDocumentId(company), 'settings.custom.admin': true }).exec()
  }

  async customSetting(key: string, value: JSONObject, objectId: string): Promise<Boolean> {
    await this.userModel.updateOne({ objectId }, {
      $set: {
        [`settings.custom.${key}`]: value
      }
    }).exec()

    return true
  }

  async getOrCreate(tenant: string, objectId: string): Promise<{ user: UserDocument; userDidExist: boolean }> {
    const company = await this.companyService.getByTenant(tenant)

    if (company === null) {
      throw new Error('INVALID_COMPANY')
    }

    const {
      value: user,
      lastErrorObject: { updatedExisting: userDidExist },
    } = (await this.userModel.findOneAndUpdate(
      {
        objectId,
      },
      {
        $setOnInsert: {
          objectId,
          company: company.id,
          settings: {
            custom: {} as any,
          },
        },
      },
      {
        upsert: true,
        rawResult: true,
      },
    )) as any

    return { user: user!, userDidExist }
  }

  addFavoritesToUser(user: UserDocument) {
    if (!user.populated('favorites')) {
      return this.userModel.populate(user, 'favorites')
    }
  }

  async addFavorite(user: UserDocument, favorite: string) {
    const favoriteUser = await this.userModel.findOne({
      _id: favorite,
      company: toDocumentId(user.company),
    })

    if (!favoriteUser) {
      throw new GraphQLError('User cannot be added as favorite', 'USER_CANNOT_BE_ADDED_AS_FAVORITE')
    }

    return this.userModel.findOneAndUpdate(
      {
        _id: toDocumentId(user._id),
      },
      {
        $addToSet: {
          favorites: toDocumentId(favoriteUser),
        },
      },
      {
        new: true,
      },
    )
  }

  removeFavorite(user: UserDocument, favorite: string) {
    return this.userModel.findOneAndUpdate(
      {
        _id: toDocumentId(user),
      },
      {
        $pull: {
          favorites: favorite,
        },
      },
      {
        new: true,
      },
    )
  }


  async addFavoriteMeetingRoom(user: UserDocument, token: string, favorite: string) {
    const favoriteMeetingRoom = await this.meetingRoomService.getById(user, token, favorite)

    if (!favoriteMeetingRoom) {
      throw new GraphQLError('Meeting room cannot be added as favorite', 'MEETING_ROOM_CANNOT_BE_ADDED_AS_FAVORITE')
    }

    return this.userModel.findOneAndUpdate(
        {
          _id: toDocumentId(user._id),
        },
        {
          $addToSet: {
            favoriteMeetingRooms: favoriteMeetingRoom.id,
          },
        },
        {
          new: true,
        },
    )
  }

  removeFavoriteMeetingRoom(user: UserDocument, favorite: string) {
    return this.userModel.findOneAndUpdate(
        {
          _id: toDocumentId(user),
        },
        {
          $pull: {
            favoriteMeetingRooms: favorite,
          },
        },
        {
          new: true,
        },
    )
  }
}
