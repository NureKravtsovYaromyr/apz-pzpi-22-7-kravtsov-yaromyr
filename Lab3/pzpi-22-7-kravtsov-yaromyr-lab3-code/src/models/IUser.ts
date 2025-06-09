// src/models/IUser.ts
export interface IUser {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'developer' | 'resident'
  phone?: string
  avatarLink?: string
}


export type RoleType = 'developer' | 'resident' | ''