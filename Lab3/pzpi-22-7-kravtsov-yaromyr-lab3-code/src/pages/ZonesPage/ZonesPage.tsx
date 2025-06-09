// src/pages/ZonesPage/ZonesPage.tsx
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
import { IZone, ZoneService } from '../../api/ZoneService'


const ZonesPage: React.FC = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState<string>('')
  const [zones, setZones] = useState<IZone[]>([])
  const { role } = useAuthStore()

  // Завантажуємо всі зони
  const fetchZones = async () => {
    try {
      const { data } = await ZoneService.getZones()
      setZones(data)
    } catch (err) {
      console.error('Error fetching zones:', err)
    }
  }

  // Фільтрація по назві
  const handleSearch = () => {
    fetchZones()
  }

  // Видалити зону
  const handleRemove = async (id: number) => {
    try {
      await ZoneService.deleteZone(id)
      setZones(prev => prev.filter(z => z.id !== id))
    } catch (err) {
      console.error('Error deleting zone:', err)
    }
  }

  // Перехід на створення
  const handleCreate = () => {
    navigate(RouteNames.ZONE)
  }

  useEffect(() => {
    fetchZones()
  }, [])

  return (
    <PageLayout
      pageTitle="Зони спільного користування"
      actionTitle="Додати зону"
      action={handleCreate}
      actionAccess={role === 'developer'}
    >
      <Container>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <InputRow title="Назва">
            <MyInput value={search} setValue={setSearch} />
          </InputRow>
          <MyButton onClick={handleSearch}>Шукати</MyButton>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {zones
            .filter(z => z.name.toLowerCase().includes(search.toLowerCase()))
            .map(zone => (
              <ListIteam
                key={zone.id}
                link={RouteNames.ZONE + `/${zone.id}`}
                className="listItem"
              >
                <p><strong>{zone.name}</strong> (тип: {zone.type})</p>
                <p>Будівля ID: {zone.building_id}</p>
                {role === 'developer' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <RemoveButton action={() => handleRemove(zone.id)} />
                  </div>
                )}
              </ListIteam>
            ))}
        </div>
      </Container>
    </PageLayout>
  )
}

export default ZonesPage
