// src/api/UserService.ts
import $api from '../app/api/http'

export interface IUser {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'developer' | 'resident'
  phone?: string
  avatarLink?: string
}

export class UserService {
  static getUsers() {
    return $api.get<IUser[]>('/users')
  }
  static getUser(id: number) {
    return $api.get<IUser>(`/users/${id}`)
  }
  static createUser(data: Partial<IUser>) {
    // choose endpoint by role in form: e.g. '/users/user' or '/users/developer'
    return $api.post('/users/user', data)
  }
  static createDeveloper(data: Partial<IUser>) {
    return $api.post('/users/developer', data)
  }
  static updateUser(id: number, data: Partial<IUser>) {
    return $api.put(`/users/${id}`, data)
  }
  static deleteUser(id: number) {
    return $api.delete(`/users/${id}`)
  }
  static getProfile() {
    return $api.get<IUser>('/users/profile')
  }
  static login(data: { email: string; password: string }) {
    return $api.post('/users/login', data)
  }
  static getUserActivity(id: number) {
    return $api.get<any[]>(`/users/${id}/activity`)
  }
  static getUserZones(id: number) {
    return $api.get<any[]>(`/users/${id}/zones`)
  }
}
