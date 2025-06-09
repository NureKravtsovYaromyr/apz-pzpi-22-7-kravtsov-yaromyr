// src/pages/UserModule/UserModule.tsx
import React, { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import DeleteItemMenu from '../../components/DeleteItemMenu/DeleteItemMenu'
import SuccessMenu from '../../components/SuccessMenu/SuccessMenu'
import Container from '../../layouts/Container/Container'
import MyInput from '../../UI/MyInput/MyInput'
import $api from '../../app/api/http'
import { RouteNames } from '../../app/router'
import { useAuthStore } from '../../app/store/auth'

interface IUserPayload {
  firstName: string
  lastName: string
  email: string
}

const UserPage: FC = () => {
  const navigate = useNavigate()
  const { id: idParam } = useParams<{ id: string }>()
  const id = idParam ? Number(idParam) : null
  const { role } = useAuthStore()

  const [action, setAction] = useState<'create' | 'edit'>('create')
  const [user, setUser] = useState<Partial<IUserPayload>>({
    firstName: '',
    lastName: '',
    email: '',
  })
  const [isDeleteMenuShow, setIsDeleteMenuShow] = useState(false)
  const [isShowSuccess, setIsShowSuccess] = useState(false)

  // Визначаємо режим: створення чи редагування
  useEffect(() => {
    setAction(id ? 'edit' : 'create')
  }, [id])

  // Підвантажуємо дані при редагуванні
  useEffect(() => {
    if (action === 'edit' && id) {
      $api.get<IUserPayload>(`/users/${id}`)
        .then(({ data }) => setUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        }))
        .catch(console.error)
    }
  }, [action, id])

  // Обробка кнопки "Зберегти/Створити"
  const pageAction = async () => {
    try {
      if (action === 'edit' && id) {
        await $api.put(`/users/${id}`, user)
        setIsShowSuccess(true)
      } else {
        const { data } = await $api.post<{ id: number }>('/users/user', user)
        navigate(`${RouteNames.USER}/${data.id}`)
      }
    } catch (err) {
      console.error('Помилка збереження користувача:', err)
    }
  }

  // Видалення користувача
  const handleRemove = async () => {
    if (!id) return
    try {
      await $api.delete(`/users/${id}`)
      navigate(RouteNames.USERS)
    } catch (err) {
      console.error('Помилка видалення користувача:', err)
    }
  }

  return (
    <PageLayout
      pageTitle={action === 'edit' ? 'Редагувати користувача' : 'Створити користувача'}
      actionTitle={action === 'edit' ? 'Зберегти користувача' : 'Створити користувача'}
      action={pageAction}
      removeAction={action === 'edit' ? () => setIsDeleteMenuShow(true) : undefined}
      actionAccess={role === 'developer'}
    >
      <>
        <Container>
          <MyInput
            placeholder="Ім'я"
            value={user.firstName || ''}
            setValue={val => setUser(prev => ({ ...prev, firstName: val }))}
          />
          <MyInput
            placeholder="Прізвище"
            value={user.lastName || ''}
            setValue={val => setUser(prev => ({ ...prev, lastName: val }))}
          />
          <MyInput
            placeholder="Email"
            type="email"
            value={user.email || ''}
            setValue={val => setUser(prev => ({ ...prev, email: val }))}
          />
        </Container>

        <DeleteItemMenu
          isShow={isDeleteMenuShow}
          setIsShow={setIsDeleteMenuShow}
          title={`Видалити користувача "${user.firstName} ${user.lastName}"?`}
          action={handleRemove}
        />

        <SuccessMenu
          title="Користувача успішно збережено."
          action={() => setIsShowSuccess(false)}
          setIsShow={setIsShowSuccess}
          isShow={isShowSuccess}
        />
      </>
    </PageLayout>
  )
}

export default UserPage
