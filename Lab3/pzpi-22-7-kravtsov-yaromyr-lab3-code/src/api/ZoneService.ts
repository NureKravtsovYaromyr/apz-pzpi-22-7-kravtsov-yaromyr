
import $api from '../app/api/http'

export interface IZone {
  id: number
  name: string
  type: string
  building_id: number
}

export class ZoneService {
  static getZones() {
    return $api.get<IZone[]>('/zones')
  }
  static getZone(id: number) {
    return $api.get<IZone>(`/zones/one/${id}`)
  }
  static createZone(data: { name: string; type: string; building_id: number }) {
    return $api.post('/zones', data)
  }
  static updateZone(id: number, data: { name?: string; type?: string }) {
    return $api.put(`/zones/${id}`, data)
  }
  static deleteZone(id: number) {
    return $api.delete(`/zones/${id}`)
  }
  static getZonesByBuilding(buildingId: number) {
    return $api.get<IZone[]>(`/zones/building/${buildingId}`)
  }
  static getZoneUsage(id: number) {
    return $api.get<number>(`/zones/${id}/usage`)
  }
  static getZoneActivity(id: number) {
    return $api.get<any[]>(`/zones/${id}/activity`)
  }
  static getZoneUsers(id: number) {
    return $api.get<any[]>(`/zones/${id}/users`)
  }
  static getInactive() {
    return $api.get<IZone[]>('/zones/inactive')
  }
}
