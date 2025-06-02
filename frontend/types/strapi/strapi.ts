export type CollectionType = {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  locale?: string
}

export type SingleType = {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  locale?: string
}

export type Component = {
  id: number
  __component: string
  [key: string]: unknown
}

// Media types
export type MediaImageFormat = {
  name: string
  hash: string
  ext: string
  mime: string
  path: string | null
  width: number
  height: number
  size: number
  sizeInBytes: number
  url: string
}

export type MediaImageFormats = {
  thumbnail?: MediaImageFormat
  small?: MediaImageFormat
  medium?: MediaImageFormat
  large?: MediaImageFormat
}

export type MediaImage = {
  id: number
  documentId: string
  name: string
  alternativeText: string | null
  caption: string | null
  width: number
  height: number
  formats: MediaImageFormats
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  provider_metadata: unknown | null
  createdAt: string
  updatedAt: string
  publishedAt: string
}
