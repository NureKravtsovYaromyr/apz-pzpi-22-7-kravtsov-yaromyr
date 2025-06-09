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
import { IDoor } from '../../models/IDoor'
import { DoorService } from '../../api/DoorService'

const DoorsPage: React.FC = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState<string>('')
  const [doors, setDoors] = useState<IDoor[]>([])
  const { role } = useAuthStore()

  const handleCreate = () => {
    navigate(RouteNames.DOOR)
  }

  const fetchDoors = async () => {
    try {
      const { data } = await DoorService.getDoors()
      setDoors(data)
    } catch (error) {
      console.error('Помилка завантаження дверей:', error)
    }
  }

  const handleSearch = () => {
    fetchDoors()
  }

  const handleRemove = async (id: number) => {
    try {
      await DoorService.deleteDoor(id)
      setDoors(prev => prev.filter(d => d.id !== id))
    } catch (error) {
      console.error('Помилка видалення дверей:', error)
    }
  }

  useEffect(() => {
    fetchDoors()
  }, [])

  return (
    <PageLayout
      pageTitle="Двері"
      actionTitle="Додати двері"
      action={handleCreate}
      actionAccess={role === 'developer'}
    >
      <Container>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <InputRow title="Device ID">
            <MyInput setValue={setSearch} value={search} />
          </InputRow>
          <MyButton onClick={handleSearch}>Шукати</MyButton>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {doors
            .filter(d => d.device_id.toLowerCase().includes(search.toLowerCase()))
            .map(door => (
              <ListIteam
                key={door.id}
                link={RouteNames.DOOR + `/${door.id}`}
              >
                <p><strong>Device:</strong> {door.device_id}</p>
                <p><strong>Position:</strong> {door.position}</p>
                <p><strong>Zone ID:</strong> {door.zone_id}</p>
                {role === 'developer' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <RemoveButton action={() => handleRemove(door.id)} />
                  </div>
                )}
              </ListIteam>
            ))}
        </div>
      </Container>
    </PageLayout>
  )
}
export default DoorsPage;
