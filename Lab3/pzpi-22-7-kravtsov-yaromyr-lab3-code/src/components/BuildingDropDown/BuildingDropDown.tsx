import { FC, useEffect, useState } from 'react';
import MySelect from '../../UI/MySelect/MySelect';
import { SelectOption } from '../../models/SelectOption';
import styles from './BuildingDropDown.module.css';
import $api from '../../app/api/http';
import { IBuilding } from '../../models/IBuilding';

interface Props {
  buildingId: number | null;
  setBuildingId: (val: number) => void;
  className?: string;
}

const BuildingDropDown: FC<Props> = ({ buildingId, setBuildingId, className }) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchBuildings = async () => {
    try {
      const { data } = await $api.get<IBuilding[]>('/buildings');
      const opts: SelectOption[] = data.map(b => ({
        value: String(b.id),
        label: b.name 
      }));
      setOptions(opts);
    } catch (err) {
      console.error('Помилка завантаження будівель:', err);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const handleChange = (value: string) => {
    const num = Number(value);
    if (!isNaN(num)) setBuildingId(num);
  };

  return (
    <MySelect
      className={`${styles.select} ${className || ''}`}
      options={[{ value: '-1', label: 'Виберіть будівлю' }, ...options]}
      value={buildingId != null ? String(buildingId) : ''}
      onChange={handleChange}
      disabled={!isLoaded}
    />
  );
};

export default BuildingDropDown;
