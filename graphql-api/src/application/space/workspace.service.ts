import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CompanyDocument } from '../../models/company.model'
import { toDocumentId } from '../../utilities/document'
import { intersect } from '../../utilities'
import { createChildSpacesWithMeetingRoomAggregation, createSpaceRootAggregation } from './space.queries'
import { isSpaceAccessible } from './space.utilities'
import { UserDocument } from '../../models/user.model'
import { WORKSPACE_MODEL_NAME, WorkspaceDocument } from '../../models/workspace.schema'
import { MediaDocument } from '../../models/media.model'

@Injectable()
export class WorkspaceService {
  constructor(@InjectModel(WORKSPACE_MODEL_NAME) private readonly workspaceModel: Model<WorkspaceDocument>) {}

  async getById(id: string) {
    return await this.workspaceModel.findById(id).populate<{ floorPlans: MediaDocument[] }>('floorPlans').exec()
  }

  async toggleDisableSpace(user: UserDocument, id: string): Promise<WorkspaceDocument | null> {
    const space = await this.workspaceModel.findOne({ _id: id, company: toDocumentId(user.company) })

    if (space) {
      await space.updateOne({ $set: { disabled: !space.disabled } })
      return space
    }

    return null
  }

  async updateSpace(user: UserDocument, id: string, name: string): Promise<boolean> {
    await this.workspaceModel.updateOne({ _id: id, company: toDocumentId(user.company) }, { $set: { name } })
    return true
  }

  async removeDeskLabel(user: UserDocument, id: string, index: number): Promise<boolean> {
    await this.workspaceModel.updateOne({ _id: id, company: toDocumentId(user.company) }, [
      {
        $set: {
          labels: {
            $concatArrays: [{ $slice: ['$labels', index] }, { $slice: ['$labels', { $add: [1, index] }, { $size: '$labels' }] }],
          },
        },
      },
    ])
    return true
  }

  async addDeskLabel(user: UserDocument, id: string, label: string): Promise<boolean> {
    await this.workspaceModel.updateOne({ _id: id, company: toDocumentId(user.company) }, { $addToSet: { labels: label } })
    return true
  }

  async getByCompany(company: string | CompanyDocument, userGroups: string[] = []) {
    const spaces: any[] = await this.workspaceModel
      .find({ company: toDocumentId(company) })
      .populate<{ floorPlans: MediaDocument[] }>('floorPlans')
      .exec()

    spaces.forEach((space) => {
      space.isAccessible = false
    })

    const spacesMap = new Map(spaces.map((space) => [space._id, space]))
    const parentSet = new Set(spaces.map((space) => space.parent))
    const leafSpaces = spaces.filter((space) => !parentSet.has(space._id))

    const accessibleLeafSpaces = leafSpaces.filter((accessibleLeafSpace) => {
      const permissionGroups = [...(accessibleLeafSpace.permissions?.groups ?? []), ...(accessibleLeafSpace.permissions?.inheritedGroups ?? [])]

      return permissionGroups.length === 0 ? true : intersect(userGroups, permissionGroups)
    })

    accessibleLeafSpaces.forEach((space) => {
      while (space != null) {
        space.isAccessible = true
        space = spacesMap.get(space.parent)!
      }
    })

    return spaces
  }

  async getRootPathForSpace(id: string, user: UserDocument, userGroups: string[]) {
    const company = toDocumentId(user.company)
    const aggregation = createSpaceRootAggregation(id, company)
    const spaces = (await this.workspaceModel.aggregate(aggregation).exec()) as Array<WorkspaceDocument & { isAccessible: boolean }>

    if (!spaces) {
      return []
    }

    let isChildAccessible = true
    spaces.forEach((space) => {
      if (!isSpaceAccessible) {
        space.isAccessible = false
      } else {
        const isAccessible = isSpaceAccessible(space, userGroups)

        space.isAccessible = isAccessible

        if (!isAccessible) {
          isChildAccessible = false
        }
      }
    })

    return spaces
  }

  async getSpaceChildren(id: string | null, user: UserDocument, userGroups: string[], filterByMeetingRoomsAsChildren = false) {
    const spaces: any[] = filterByMeetingRoomsAsChildren
      ? await this.workspaceModel.aggregate(createChildSpacesWithMeetingRoomAggregation(toDocumentId(user.company), id))
      : await this.workspaceModel
          .find({
            parent: id,
            company: toDocumentId(user.company),
          })
          .populate<{ floorPlans: MediaDocument[] }>('floorPlans')
          .exec()

    spaces.forEach((space) => {
      space.isAccessible = isSpaceAccessible(space, userGroups)
    })
    spaces.sort((a, b) => {
      return (
        (a.sort ?? 65_535) - (b.sort ?? 65_535) ||
        Number(a.canHaveNote) - Number(b.canHaveNote) ||
        (b.capacity ?? 0) - (a.capacity ?? 0) ||
        a.name.length - b.name.length ||
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
      )
    })

    return spaces
  }
}
