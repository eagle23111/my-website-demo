import React, { useState, useEffect } from 'react';
import { Button } from '@consta/uikit/Button';
import { TextField } from '@consta/uikit/TextField';
import { Modal } from '@consta/uikit/Modal';
import { Loader } from '@consta/uikit/Loader';
import { Select } from '@consta/uikit/Select';
import { updateLot, getLotByName } from '../services/lotservice';
import type { UpdateLotRequest } from '../services/lotservice';

interface EditLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLotUpdated: () => void; 
  selectedRows: Set<string>; 
}

interface SelectItem {
  label: string;
  id: string;
}

export const EditLotModal: React.FC<EditLotModalProps> = ({
  isOpen,
  onClose,
  onLotUpdated,
  selectedRows,
}) => {
  const [formData, setFormData] = useState<UpdateLotRequest>({
    lotName: '',
    customerCode: '',
    price: 0,
    currencyCode: '',
    ndsRate: '',
    placeDelivery: '',
    dateDelivery: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currencyItems: SelectItem[] = [
    { label: 'Рубль (RUB)', id: 'RUB' },
    { label: 'Доллар (USD)', id: 'USD' },
    { label: 'Евро (EUR)', id: 'EUR' },
  ];

  const ndsItems: SelectItem[] = [
    { label: 'Без НДС', id: 'Без НДС' },
    { label: '18%', id: '18%' },
    { label: '20%', id: '20%' },
  ];

  useEffect(() => {
    const fetchLotData = async () => {
      if (!isOpen || selectedRows.size !== 1) return;
      
      setIsFetching(true);
      setError(null);
      try {
        const name = Array.from(selectedRows)[0];
        const lot = await getLotByName(name);
        
        setFormData({
          lotName: lot.lotName,
          customerCode: lot.customerCode,
          price: lot.price,
          currencyCode: lot.currencyCode,
          ndsRate: lot.ndsRate,
          placeDelivery: lot.placeDelivery,
          dateDelivery: lot.dateDelivery,
        });
      } catch (err) {
        setError('Не удалось загрузить данные лота. Пожалуйста, попробуйте снова.');
        console.error('Ошибка при загрузке лота:', err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchLotData();
  }, [isOpen, selectedRows]);

  const handleInputChange = (field: keyof UpdateLotRequest) => (value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value || '' }));
  };

  const handleNumberChange = (field: keyof UpdateLotRequest) => (value: string | null) => {
    const numValue = value ? parseFloat(value) : 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleSelectChange = (field: keyof UpdateLotRequest) => (value: SelectItem | null) => {
    setFormData(prev => ({ ...prev, [field]: value?.id || '' }));
  };

  const handleSubmit = async () => {
    if (!formData.lotName || !formData.customerCode || formData.price <= 0) {
      setError('Наименование лота, код контрагента и начальная стоимость обязательны для заполнения');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateLot(formData.lotName, formData);
      onLotUpdated();  
      onClose();
    } catch (err) {
      setError('Не удалось обновить данные лота. Пожалуйста, попробуйте снова.');
      console.error('Ошибка при обновлении лота:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedRows.size !== 1) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      hasOverlay
      onClickOutside={onClose}
      onEsc={onClose}
      position="center"
      style={{ zIndex: 10000 }}
    >
      <div style={{ padding: '20px', maxWidth: '500px' }}>
        <h2>Редактировать лот</h2>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {isFetching ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <Loader size="m" />
          </div>
        ) : (
          <>
            <TextField
              label="Наименование лота*"
              value={formData.lotName}
              onChange={handleInputChange('lotName')}
              placeholder="Введите наименование лота"
              style={{ marginBottom: '16px' }}
            />

            <TextField
              label="Код контрагента*"
              value={formData.customerCode}
              onChange={handleInputChange('customerCode')}
              placeholder="Введите код контрагента"
              style={{ marginBottom: '16px' }}
            />

            <TextField
              label="Начальная стоимость*"
              type="number"
              value={String(formData.price)}
              onChange={handleNumberChange('price')}
              placeholder="Введите начальную стоимость"
              min={0}
              step="0.01"
              style={{ marginBottom: '16px' }}
            />

            <Select
              label="Валюта"
              items={currencyItems}
              value={currencyItems.find(item => item.id === formData.currencyCode) || null}
              onChange={handleSelectChange('currencyCode')}
              placeholder="Выберите валюту"
              style={{ marginBottom: '16px' }}
            />

            <Select
              label="Ставка НДС"
              items={ndsItems}
              value={ndsItems.find(item => item.id === formData.ndsRate) || null}
              onChange={handleSelectChange('ndsRate')}
              placeholder="Выберите ставку НДС"
              style={{ marginBottom: '16px' }}
            />

            <TextField
              label="Грузополучатель"
              value={formData.placeDelivery}
              onChange={handleInputChange('placeDelivery')}
              placeholder="Введите грузополучателя"
              style={{ marginBottom: '16px' }}
            />

            <TextField
              label="Дата доставки*"
              type="datetime-local"
              value={formData.dateDelivery ? formData.dateDelivery.substring(0, 16) : ''}
              onChange={(value) => {
                if (value) {
                  setFormData(prev => ({ ...prev, dateDelivery: `${value}:00` }));
                } else {
                  setFormData(prev => ({ ...prev, dateDelivery: '' }));
                }
              }}
              style={{ marginBottom: '16px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button
                label="Отмена"
                view="secondary"
                onClick={onClose}
                disabled={isLoading}
              />
              <Button
                label={isLoading ? "Создание..." : "Создать лот"}
                view="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                loading={isLoading}
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};