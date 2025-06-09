import axios from 'axios'
import $api from '../app/api/http'

export interface IBuilding {
  id: number
  name: string
  address: string
  usersCount?: number  // додатково, якщо бекенд повертає
}

export class BuildingService {
  static async getBuildings(search: string) {
    // якщо search пустий, просто GET /buildings
    const params = search ? { name: search, address: search } : {}
    return $api.get<IBuilding[]>('/buildings/search', { params })
  }

  static async createBuilding(data: { name: string; address: string }) {
    return $api.post('/buildings', data)
  }

  static async updateBuilding(id: number, data: { name?: string; address?: string }) {
    return $api.put(`/buildings/${id}`, data)
  }

  static async deleteBuilding(id: number) {
    return $api.delete(`/buildings/${id}`)
  }

  static async addUserToBuilding(id: number, user_id: number) {
    return $api.post(`/buildings/${id}/users`, { user_id })
  }

  static async getBuildingUsers(id: number) {
    return $api.get(`/buildings/${id}/users`)
  }
}
