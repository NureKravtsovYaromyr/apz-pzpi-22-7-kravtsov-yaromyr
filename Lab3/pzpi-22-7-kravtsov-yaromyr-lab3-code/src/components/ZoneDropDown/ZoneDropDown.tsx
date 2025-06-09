import React, { FC, useEffect, useState } from 'react';
import MySelect from '../../UI/MySelect/MySelect';
import { SelectOption } from '../../models/SelectOption';
/* import styles from './ZoneDropDown.module.css'; */
import { ZoneService } from '../../api/ZoneService';

interface Props {
  zoneId: number | null;
  setZoneId: (val: number) => void;
  className?: string;
}

const ZoneDropDown: FC<Props> = ({ zoneId, setZoneId, className }) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const { data } = await ZoneService.getZones();
        const opts: SelectOption[] = data.map(z => ({
          value: String(z.id),
          label: z.name,
        }));
        setOptions(opts);
      } catch (err) {
        console.error('Помилка завантаження зон:', err);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchZones();
  }, []);

  const handleChange = (value: string) => {
    const num = Number(value);
    if (!isNaN(num)) setZoneId(num);
  };

  return (
    <MySelect
      className={` ${className || ''}`}
      options={[{ value: '', label: 'Виберіть зону' }, ...options]}
      value={zoneId != null ? String(zoneId) : ''}
      onChange={handleChange}
      disabled={!isLoaded}
    />
  );
};

export default ZoneDropDown;
