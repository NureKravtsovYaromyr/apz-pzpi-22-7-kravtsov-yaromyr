export interface IDoor {
  id: number
  position: 'entry' | 'exit' | 'entry_exit'
  device_id: string
  zone_id: number
}
