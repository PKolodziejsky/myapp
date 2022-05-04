import { intersect } from '../../utilities'
import { WorkspaceDocument } from '../../models/workspace.schema'

export const isSpaceAccessible = (space: WorkspaceDocument, userGroups: string[]) => {
  const permissionGroups = [...(space.permissions?.groups ?? []), ...(space.permissions?.inheritedGroups ?? [])]
  return permissionGroups.length === 0 ? true : intersect(userGroups, permissionGroups)
}
