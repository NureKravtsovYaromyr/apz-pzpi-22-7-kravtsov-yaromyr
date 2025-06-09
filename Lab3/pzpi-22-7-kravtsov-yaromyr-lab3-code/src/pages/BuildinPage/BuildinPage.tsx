import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import PageLayout from '../../layouts/PageLayout/PageLayout';
import DeleteItemMenu from '../../components/DeleteItemMenu/DeleteItemMenu';
import SuccessMenu from '../../components/SuccessMenu/SuccessMenu';
import { RouteNames } from '../../app/router';
import $api from '../../app/api/http';
import Container from '../../layouts/Container/Container';
import MyInput from '../../UI/MyInput/MyInput';
import MyButton from '../../UI/MyButton/MyButton';
import { useAuthStore } from '../../app/store/auth';



interface IBuilding {
    id: number;
    name: string;
    address: string;
}

const BuildingModule: FC = () => {
    const navigate = useNavigate();
    const { id: idParam } = useParams<{ id: string }>();
    const id = idParam ? Number(idParam) : null;
    const { role } = useAuthStore();
    const [action, setAction] = useState<'create' | 'edit'>('create');
    const [building, setBuilding] = useState<Partial<IBuilding>>({
        name: '',
        address: '',
    });
    const [isDeleteMenuShow, setIsDeleteMenuShow] = useState(false);
    const [isShowSuccessSave, setIsShowSuccessSave] = useState(false);

    // Завантажуємо дані при редагуванні
    useEffect(() => {
        if (action === 'edit' && id) {
            (async () => {
                try {
                    const { data } = await $api.get<IBuilding>(`/buildings/${id}`);
                    setBuilding({ name: data.name, address: data.address });
                } catch (err) {
                    console.error('Помилка завантаження будівлі:', err);
                }
            })();
        }
    }, [action, id]);
    
    useEffect(() => setAction(idParam ? 'edit' : 'create'), [idParam])

    const pageAction = async () => {
        try {
            if (action === 'edit' && id) {
                await $api.put(`/buildings/${id}`, {
                    name: building.name,
                    address: building.address,
                });
                setIsShowSuccessSave(true);
            } else {
                const { data } = await $api.post<IBuilding>('/buildings', {
                    name: building.name,
                    address: building.address,
                });
                navigate(`${RouteNames.BUILDING}/${data.id}`);
            }
        } catch (err) {
            console.error('Помилка збереження будівлі:', err);
        }
    };

    const handleRemove = async () => {
        if (!id) return;
        try {
            await $api.delete(`/buildings/${id}`);
            navigate(RouteNames.BUILDINGS);
        } catch (err) {
            console.error('Помилка видалення будівлі:', err);
        }
    };

    return (
        <PageLayout
            pageTitle={action === 'edit' ? `Редагувати будівлю` : 'Створити нову будівлю'}
            actionTitle={action === 'edit' ? 'Зберегти будівлю' : 'Створити будівлю'}
            action={pageAction}
            removeAction={action === 'edit' ? () => setIsDeleteMenuShow(true) : undefined}
            actionAccess={role === 'developer'}
        >
            <>
                <Container>
                    <MyInput
                        placeholder="Назва будівлі"
                        value={building.name || ''}
                        setValue={(val) => setBuilding(prev => ({ ...prev, name: val }))}
                    />
                    <MyInput
                        placeholder="Адреса"
                        value={building.address || ''}
                        setValue={(val) => setBuilding(prev => ({ ...prev, address: val }))}
                    />
                </Container>

                <DeleteItemMenu
                    isShow={isDeleteMenuShow}
                    setIsShow={setIsDeleteMenuShow}
                    title={`Видалити будівлю "${building.name}"?`}
                    action={handleRemove}
                />

                <SuccessMenu
                    title="Будівля успішно збережена."
                    action={() => setIsShowSuccessSave(false)}
                    setIsShow={setIsShowSuccessSave}
                    isShow={isShowSuccessSave}
                />
            </>
        </PageLayout>
    );
};

export default BuildingModule;
