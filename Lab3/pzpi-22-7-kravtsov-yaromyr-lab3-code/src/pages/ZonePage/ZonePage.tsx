// src/pages/ZoneModule/ZoneModule.tsx
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
import BuildingDropDown from '../../components/BuildingDropDown/BuildingDropDown'

interface IZonePayload {
  name: string
  type: string
  building_id: number
}

const ZonePage: FC = () => {
  const navigate = useNavigate()
  const { id: idParam } = useParams<{ id: string }>()
  const id = idParam ? Number(idParam) : null
  const { role } = useAuthStore()

  const [action, setAction] = useState<'create' | 'edit'>('create')
  const [zone, setZone] = useState<Partial<IZonePayload>>({
    name: '',
    type: '',
    building_id: -1,
  })
  const [isDeleteMenuShow, setIsDeleteMenuShow] = useState(false)
  const [isShowSuccess, setIsShowSuccess] = useState(false)

  useEffect(() => {
    setAction(id ? 'edit' : 'create')
  }, [id])

  useEffect(() => {
    if (action === 'edit' && id) {
      $api.get<IZonePayload>(`/zones/one/${id}`)
        .then(({ data }) => setZone({
          name: data.name,
          type: data.type,
          building_id: data.building_id,
        }))
        .catch(console.error)
    }
  }, [action, id])

  const pageAction = async () => {
    try {
      if (action === 'edit' && id) {
        await $api.put(`/zones/${id}`, zone)
        setIsShowSuccess(true)
      } else {
        const { data } = await $api.post<{ id: number }>('/zones', zone)
        navigate(`${RouteNames.ZONE}/${data.id}`)
      }
    } catch (err) {
      console.error('Помилка збереження зони:', err)
    }
  }

  const handleRemove = async () => {
    if (!id) return
    try {
      await $api.delete(`/zones/${id}`)
      navigate(RouteNames.ZONES)
    } catch (err) {
      console.error('Помилка видалення зони:', err)
    }
  }

  return (
    <PageLayout
      pageTitle={action === 'edit' ? 'Редагувати зону' : 'Створити нову зону'}
      actionTitle={action === 'edit' ? 'Зберегти зону' : 'Створити зону'}
      action={pageAction}
      removeAction={action === 'edit' ? () => setIsDeleteMenuShow(true) : undefined}
      actionAccess={role === 'developer'}
    >
      <>
        <Container>
          <MyInput
            placeholder="Назва зони"
            value={zone.name || ''}
            setValue={val => setZone(prev => ({ ...prev, name: val }))}
          />
          <MyInput
            placeholder="Тип (наприклад, gym, lounge)"
            value={zone.type || ''}
            setValue={val => setZone(prev => ({ ...prev, type: val }))}
          />
          <BuildingDropDown
            buildingId={zone.building_id || null}
            setBuildingId={val => setZone(prev => ({ ...prev, building_id: val }))}
          />
        </Container>

        <DeleteItemMenu
          isShow={isDeleteMenuShow}
          setIsShow={setIsDeleteMenuShow}
          title={`Видалити зону "${zone.name}"?`}
          action={handleRemove}
        />

        <SuccessMenu
          title="Зона успішно збережена."
          action={() => setIsShowSuccess(false)}
          setIsShow={setIsShowSuccess}
          isShow={isShowSuccess}
        />
      </>
    </PageLayout>
  )
}

export default ZonePage
