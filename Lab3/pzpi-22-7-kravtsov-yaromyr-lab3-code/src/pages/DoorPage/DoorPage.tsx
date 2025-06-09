// src/pages/DoorModule/DoorModule.tsx
import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../layouts/PageLayout/PageLayout';
import DeleteItemMenu from '../../components/DeleteItemMenu/DeleteItemMenu';
import SuccessMenu from '../../components/SuccessMenu/SuccessMenu';
import Container from '../../layouts/Container/Container';
import MyInput from '../../UI/MyInput/MyInput';
import MyButton from '../../UI/MyButton/MyButton';
import MySelect from '../../UI/MySelect/MySelect';
import ZoneDropDown from '../../components/ZoneDropDown/ZoneDropDown';
import $api from '../../app/api/http';
import { RouteNames } from '../../app/router';
import { useAuthStore } from '../../app/store/auth';

const positionOptions = [
  { value: 'entry', label: 'Entry' },
  { value: 'exit', label: 'Exit' },
  { value: 'entry_exit', label: 'Entry/Exit' },
];

interface IDoorPayload {
  position: 'entry' | 'exit' | 'entry_exit';
  device_id: string;
  zone_id: number;
}

const DoorPage: FC = () => {
  const navigate = useNavigate();
  const { id: idParam } = useParams<{ id: string }>();
  const id = idParam ? Number(idParam) : null;
  const { role } = useAuthStore();

  const [action, setAction] = useState<'create' | 'edit'>('create');
  const [door, setDoor] = useState<Partial<IDoorPayload>>({
    position: 'entry',
    device_id: '',
    zone_id: 0,
  });
  const [isDeleteMenuShow, setIsDeleteMenuShow] = useState(false);
  const [isShowSuccess, setIsShowSuccess] = useState(false);

  useEffect(() => {
    setAction(id ? 'edit' : 'create');
  }, [id]);

  useEffect(() => {
    if (action === 'edit' && id) {
      $api.get<IDoorPayload>(`/doors/${id}`)
        .then(({ data }) =>
          setDoor({
            position: data.position,
            device_id: data.device_id,
            zone_id: data.zone_id,
          })
        )
        .catch(console.error);
    }
  }, [action, id]);

  const pageAction = async () => {
    try {
      if (action === 'edit' && id) {
        await $api.put(`/doors/${id}`, door);
        setIsShowSuccess(true);
      } else {
        const { data } = await $api.post<{ id: number }>('/doors', door);
        navigate(`${RouteNames.DOOR}/${data.id}`);
      }
    } catch (err) {
      console.error('Помилка збереження дверей:', err);
    }
  };

  const handleRemove = async () => {
    if (!id) return;
    try {
      await $api.delete(`/doors/${id}`);
      navigate(RouteNames.DOORS);
    } catch (err) {
      console.error('Помилка видалення дверей:', err);
    }
  };

  return (
    <PageLayout
      pageTitle={action === 'edit' ? 'Редагувати двері' : 'Створити нові двері'}
      actionTitle={action === 'edit' ? 'Зберегти' : 'Створити'}
      action={pageAction}
      removeAction={action === 'edit' ? () => setIsDeleteMenuShow(true) : undefined}
      actionAccess={role === 'developer'}
    >
      <>
        <Container>
          <MySelect
            options={positionOptions}
            value={door.position || 'entry'}
            onChange={val => setDoor(prev => ({ ...prev, position: val as any }))}
          />
          <MyInput
            placeholder="Device ID"
            value={door.device_id || ''}
            setValue={val => setDoor(prev => ({ ...prev, device_id: val }))}
          />
          <ZoneDropDown
            zoneId={door.zone_id || null}
            setZoneId={val => setDoor(prev => ({ ...prev, zone_id: val }))}
          />
        </Container>

        <DeleteItemMenu
          isShow={isDeleteMenuShow}
          setIsShow={setIsDeleteMenuShow}
          title={`Видалити двері "${door.device_id}"?`}
          action={handleRemove}
        />

        <SuccessMenu
          title="Двері успішно збережені."
          action={() => setIsShowSuccess(false)}
          setIsShow={setIsShowSuccess}
          isShow={isShowSuccess}
        />
      </>
    </PageLayout>
  );
};

export default DoorPage;
