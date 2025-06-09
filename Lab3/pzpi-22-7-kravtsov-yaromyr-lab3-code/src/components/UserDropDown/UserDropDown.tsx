import React, { FC, useEffect, useState } from 'react'
import MySelect from '../../UI/MySelect/MySelect'
import { SelectOption } from '../../models/SelectOption'
import $api from '../../app/api/http'
import { IUser } from '../../models/IUser'

interface Props {
  userId: number | null
  setUserId: (val: number) => void
  className?: string
}

const UserDropDown: FC<Props> = ({ userId, setUserId, className }) => {
  const [options, setOptions] = useState<SelectOption[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await $api.get<IUser[]>('/users')
        const opts = data.map(u => ({
          value: String(u.id),
          label: `${u.firstName} ${u.lastName} (${u.email})`,
        }))
        setOptions([{ value: '', label: 'Виберіть користувача' }, ...opts])
      } catch (err) {
        console.error('Помилка завантаження користувачів:', err)
      } finally {
        setIsLoaded(true)
      }
    })()
  }, [])

  const handleChange = (val: string) => {
    const num = Number(val)
    if (!isNaN(num)) setUserId(num)
  }

  return (
    <MySelect
      className={`${className || ''}`}
      options={options}
      value={userId != null ? String(userId) : ''}
      onChange={handleChange}
      disabled={!isLoaded}
      placeholder="Пошук користувача..."
    />
  )
}

export default UserDropDown


 