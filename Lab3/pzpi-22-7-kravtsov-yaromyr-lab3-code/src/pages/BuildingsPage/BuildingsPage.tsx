import React, { useEffect, useState } from 'react'
import styles from './BuildingsPage.module.css'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import Container from '../../layouts/Container/Container'
import InputRow from '../../UI/InputRow/InputRow'
import MyInput from '../../UI/MyInput/MyInput'
import MyButton from '../../UI/MyButton/MyButton'
import ListIteam from '../../UI/ListIteam/ListIteam'
import RemoveButton from '../../UI/RemoveButton/RemoveButton'
import { useNavigate } from 'react-router-dom'
import { RouteNames } from '../../app/router'

import { BuildingService, IBuilding } from '../../api/BuildingService'
import { useAuthStore } from '../../app/store/auth'

const BuildingsPage: React.FC = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState<string>('')
  const [buildings, setBuildings] = useState<IBuilding[]>([])
  const { role } = useAuthStore()

  const handleCreate = () => {
    navigate(RouteNames.BUILDING)  
  }

  const handleSearch = async () => {
    try {
      const { data } = await BuildingService.getBuildings(search)
      setBuildings(data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleRemove = async (id: number) => {
    try {
      await BuildingService.deleteBuilding(id)
      setBuildings(prev => prev.filter(b => b.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <PageLayout
      pageTitle='Мої будівлі'
      actionTitle='Додати будівлю'
      action={handleCreate}
      actionAccess={role === 'developer'}
    >
      <Container>
        <div className={styles.searchBar}>
          <InputRow title='Назва або адреса'>
            <MyInput setValue={setSearch} value={search} />
          </InputRow>
          <MyButton onClick={handleSearch}>Шукати</MyButton>
        </div>
        <div className={styles.list}>
          {buildings.map(building =>
            <ListIteam
              key={building.id}
              className={styles.listItem}
              link={RouteNames.BUILDING + `/${building.id}`}
            >
              <p><strong>{building.name}</strong></p>
              <p>{building.address}</p>
              {/* Покажемо кількість мешканців, якщо є */}
              <p>{building.usersCount} мешканців</p>
              {role === 'developer' &&
                <div className={styles.buttonRow}>
                  <RemoveButton action={() => handleRemove(building.id)} />
                </div>}
            </ListIteam>
          )}
        </div>
      </Container>
    </PageLayout>
  )
}

export default BuildingsPage
