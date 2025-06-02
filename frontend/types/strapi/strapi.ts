export type CollectionType = {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale?: string
}

export type SingleType = {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  locale?: string
}

export type Component = {
  id: number
  __component: string
  [key: string]: unknown
}
