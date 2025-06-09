import $api from "../app/api/http";
import { IDoor } from "../models/IDoor";

export class DoorService {
  static getDoors() {
    return $api.get<IDoor[]>('/doors')
  }
  static getDoor(id: number) {
    return $api.get<IDoor>(`/doors/${id}`)
  }
  static createDoor(data: { position: string; device_id: string; zone_id: number }) {
    return $api.post('/doors', data)
  }
  static updateDoor(id: number, data: { position?: string; device_id?: string }) {
    return $api.put(`/doors/${id}`, data)
  }
  static deleteDoor(id: number) {
    return $api.delete(`/doors/${id}`)
  }
  static getDoorsByZone(zoneId: number) {
    return $api.get<IDoor[]>(`/doors/zone/${zoneId}`)
  }
  static getDoorByDevice(deviceId: string) {
    return $api.get<IDoor>(`/doors/device/${deviceId}`)
  }
  static openDoor(deviceId: string, user_id: number) {
    return $api.post(`/doors/${deviceId}/open`, { user_id })
  }
  static getLogs(id: number) {
    return $api.get<any[]>(`/doors/${id}/logs`)
  }
}
