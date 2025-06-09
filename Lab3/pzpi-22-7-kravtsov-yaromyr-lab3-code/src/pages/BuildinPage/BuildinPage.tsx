// src/pages/BuildingModule/BuildingModule.tsx
import React, { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageLayout from '../../layouts/PageLayout/PageLayout'
import DeleteItemMenu from '../../components/DeleteItemMenu/DeleteItemMenu'
import SuccessMenu from '../../components/SuccessMenu/SuccessMenu'
import Container from '../../layouts/Container/Container'
import MyInput from '../../UI/MyInput/MyInput'
import MyButton from '../../UI/MyButton/MyButton'
import ListIteam from '../../UI/ListIteam/ListIteam'
import { RouteNames } from '../../app/router'
import $api from '../../app/api/http'
import { useAuthStore } from '../../app/store/auth'
import UserDropDown from '../../components/UserDropDown/UserDropDown'

interface IBuilding {
    id: number
    name: string
    address: string
}

interface IUser {
    id: number
    firstName: string
    lastName: string
    email: string
}

const BuildingModule: FC = () => {
    const navigate = useNavigate()
    const { id: idParam } = useParams<{ id: string }>()
    const id = idParam ? Number(idParam) : null
    const { role } = useAuthStore()

    const [action, setAction] = useState<'create' | 'edit'>('create')
    const [building, setBuilding] = useState<Partial<IBuilding>>({
        name: '',
        address: '',
    })
    const [users, setUsers] = useState<IUser[]>([])
    const [newUserId, setNewUserId] = useState<number | null>(null)

    const [isDeleteMenuShow, setIsDeleteMenuShow] = useState(false)
    const [isShowSuccessSave, setIsShowSuccessSave] = useState(false)
    const [isShowUserAdded, setIsShowUserAdded] = useState(false)

    // встановлюємо режим create / edit
    useEffect(() => {
        setAction(idParam ? 'edit' : 'create')
    }, [idParam])

    // завантажуємо будівлю та список користувачів
    useEffect(() => {
        if (action === 'edit' && id) {
            (async () => {
                try {
                    const [{ data: bld }, { data: ulist }] = await Promise.all([
                        $api.get<IBuilding>(`/buildings/${id}`),
                        $api.get<IUser[]>(`/buildings/${id}/users`),
                    ])
                    setBuilding({ name: bld.name, address: bld.address })
                    setUsers(ulist)
                } catch (err) {
                    console.error('Помилка завантаження будівлі чи користувачів:', err)
                }
            })()
        }
    }, [action, id])

    const pageAction = async () => {
        try {
            if (action === 'edit' && id) {
                await $api.put(`/buildings/${id}`, {
                    name: building.name,
                    address: building.address,
                })
                setIsShowSuccessSave(true)
            } else {
                const { data } = await $api.post<IBuilding>('/buildings', {
                    name: building.name,
                    address: building.address,
                })
                navigate(`${RouteNames.BUILDING}/${data.id}`)
            }
        } catch (err) {
            console.error('Помилка збереження будівлі:', err)
        }
    }

    const handleRemove = async () => {
        if (!id) return
        try {
            await $api.delete(`/buildings/${id}`)
            navigate(RouteNames.BUILDINGS)
        } catch (err) {
            console.error('Помилка видалення будівлі:', err)
        }
    }

    const handleAddUser = async () => {
        if (!id || !newUserId) return
        try {
            await $api.post(`/buildings/${id}/users`, { user_id: Number(newUserId) })
            // оновлюємо список
            const { data: refreshed } = await $api.get<IUser[]>(`/buildings/${id}/users`)
            setUsers(refreshed)
            setNewUserId(0)
            setIsShowUserAdded(true)
        } catch (err) {
            console.error('Помилка додавання користувача:', err)
        }
    }

    return (
        <PageLayout
            pageTitle={action === 'edit' ? 'Редагувати будівлю' : 'Створити нову будівлю'}
            actionTitle={action === 'edit' ? 'Зберегти будівлю' : 'Створити будівлю'}
            action={pageAction}
            removeAction={action === 'edit' ? () => setIsDeleteMenuShow(true) : undefined}
            actionAccess={role === 'developer'}
        >
            <>
                {/* Форма створення/редагування */}
                <Container>
                    <MyInput
                        placeholder="Назва будівлі"
                        value={building.name || ''}
                        setValue={val => setBuilding(prev => ({ ...prev, name: val }))}
                    />
                    <MyInput
                        placeholder="Адреса"
                        value={building.address || ''}
                        setValue={val => setBuilding(prev => ({ ...prev, address: val }))}
                    />
                </Container>

                {/* Меню видалення */}
                <DeleteItemMenu
                    isShow={isDeleteMenuShow}
                    setIsShow={setIsDeleteMenuShow}
                    title={`Видалити будівлю "${building.name}"?`}
                    action={handleRemove}
                />

                {/* Повідомлення про успішне збереження */}
                <SuccessMenu
                    title="Будівля успішно збережена."
                    action={() => setIsShowSuccessSave(false)}
                    setIsShow={setIsShowSuccessSave}
                    isShow={isShowSuccessSave}
                />
                <br /><br />
                {/* Секція доступу користувачів */}
                {action === 'edit' && role === 'developer' && (
                    <Container>
                        <h3>Користувачі з доступом</h3>
                         <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                            <UserDropDown
                                userId={newUserId}
                                setUserId={setNewUserId}
                                className="mlistItemBlock"
                            />
                            <MyButton onClick={handleAddUser}>Додати доступ</MyButton>
                        </div>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {users.map(u => (
                                <ListIteam key={u.id}>
                                    {u.firstName} {u.lastName} — {u.email}
                                </ListIteam>
                            ))}
                        </div>
                       
                        <SuccessMenu
                            title="Користувача додано до будівлі."
                            action={() => setIsShowUserAdded(false)}
                            setIsShow={setIsShowUserAdded}
                            isShow={isShowUserAdded}
                        />
                    </Container>
                )}
            </>
        </PageLayout>
    )
}

export default BuildingModule
