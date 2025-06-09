// src/pages/UsersPage/UsersPage.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import Container from '../../layouts/Container/Container'
import InputRow from '../../UI/InputRow/InputRow'
import MyInput from '../../UI/MyInput/MyInput'
import MyButton from '../../UI/MyButton/MyButton'
import ListIteam from '../../UI/ListIteam/ListIteam'
import RemoveButton from '../../UI/RemoveButton/RemoveButton'
import { RouteNames } from '../../app/router'
import { useAuthStore } from '../../app/store/auth'
import { IUser } from '../../models/IUser'
import { UserService } from '../../api/UserService'

const UsersPage: React.FC = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState<string>('')
  const [users, setUsers] = useState<IUser[]>([])
  const { role, userId: currentUserId } = useAuthStore()

  const fetchUsers = async () => {
    try {
      const { data } = await UserService.getUsers()
      setUsers(data)
    } catch (err) {
      console.error('Помилка завантаження користувачів:', err)
    }
  }

  const handleSearch = () => {
    fetchUsers()
  }

  const handleRemove = async (id: number) => {
    try {
      await UserService.deleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (err) {
      console.error('Помилка видалення користувача:', err)
    }
  }

  const handleCreate = () => {
    navigate(RouteNames.USER)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <PageLayout
      pageTitle="Користувачі"
      actionTitle="Створити користувача"
      action={handleCreate}
      actionAccess={role === 'developer'}
    >
      <Container>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <InputRow title="Ім'я або email">
            <MyInput setValue={setSearch} value={search} />
          </InputRow>
          <MyButton onClick={handleSearch}>Шукати</MyButton>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {users
            .filter(u =>
              [u.firstName, u.lastName, u.email]
                .join(' ')
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map(user => (
              <ListIteam
                key={user.id}
                link={RouteNames.USER + `/${user.id}`}
              >
                <p><strong>{user.firstName} {user.lastName}</strong></p>
                <p>{user.email}</p>
                <p>Role: {user.role}</p>
                {role === 'developer' && user.id !== currentUserId && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <RemoveButton action={() => handleRemove(user.id)} />
                  </div>
                )}
              </ListIteam>
            ))}
        </div>
      </Container>
    </PageLayout>
  )
}

export default UsersPage
