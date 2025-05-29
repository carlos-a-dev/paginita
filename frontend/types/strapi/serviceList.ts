export type Service = {
  id: number
  title: string
  description: string
  icon: string
  visible: boolean
}

export type ServiceListResponse = {
  id: number
  title: string
  services: Service[]
}
