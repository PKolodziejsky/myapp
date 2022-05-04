import decode from 'jwt-decode'
import {objectHashKey} from "../../utilities/hash";

export const createCacheKey = (token: string, url: string, method: string, data?: Record<string, unknown>) => {
  const { oid } = decode<{ oid: string }>(token)

  return [url, oid, ...(data ? objectHashKey(data): [])].join(':')
}
