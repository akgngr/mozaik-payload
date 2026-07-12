import { getPayload as getPayloadClient } from 'payload'
import config from '@payload-config'

let cached: ReturnType<typeof getPayloadClient> | null = null

export const getPayload = () => {
  if (!cached) {
    cached = getPayloadClient({ config })
  }
  return cached
}
