import React, { useState } from 'react';
import { Button } from '@consta/uikit/Button';
import { TextField } from '@consta/uikit/TextField';
import { Select } from '@consta/uikit/Select';
import { Modal } from '@consta/uikit/Modal';
import { createLot } from '../services/lotservice';
import type { CreateLotRequest } from '../services/lotservice';

interface CreateLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLotCreated: () => void; 
}

type CurrencyItem = {
  label: string;
  id: string;
};

type NdsItem = {
  label: string;
  id: string;
};

export const CreateLotModal: React.FC<CreateLotModalProps> = ({
  isOpen,
  onClose,
  onLotCreated,
}) => {
  const [formData, setFormData] = useState<CreateLotRequest>({
    lotName: '',
    customerCode: '',
    price: 0,
    currencyCode: '',
    ndsRate: '',
    placeDelivery: '',
    dateDelivery: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currencyItems: CurrencyItem[] = [
    { label: 'Рубль (RUB)', id: 'RUB' },
    { label: 'Доллар (USD)', id: 'USD' },
    { label: 'Евро (EUR)', id: 'EUR' },
  ];

  const ndsItems: NdsItem[] = [
    { label: 'Без НДС', id: 'Без НДС' },
    { label: '18%', id: '18%' },
    { label: '20%', id: '20%' },
  ];

  const handleInputChange = (field: keyof CreateLotRequest) => (value: string | null) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'price' ? (value ? parseFloat(value) : 0) : (value || '') 
    }));
  };

  const handleSelectChange = (field: keyof CreateLotRequest) => (value: { id: string; label: string } | null) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value ? value.id : '' 
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, dateDelivery: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.lotName || !formData.customerCode) {
      setError('Необходимо указать наименование лота и код контрагента');
      return;
    }

    if (formData.price <= 0) {
      setError('Начальная стоимость должна быть больше 0');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createLot(formData);
      onLotCreated(); 
      onClose(); 
      setFormData({
        lotName: '',
        customerCode: '',
        price: 0,
        currencyCode: '',
        ndsRate: '',
        placeDelivery: '',
        dateDelivery: '',
      }); 
    } catch (err) {
      setError('Ошибка при создании лота. Пожалуйста, попробуйте снова.');
      console.error('Error creating lot:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCurrency = currencyItems.find(item => item.id === formData.currencyCode) || null;
  const selectedNds = ndsItems.find(item => item.id === formData.ndsRate) || null;

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
        <h2>Создание нового лота</h2>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '16px' }}>
            {error}
          </div>
        )}

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
          onChange={handleInputChange('price')}
          placeholder="Введите начальную стоимость"
          style={{ marginBottom: '16px' }}
          min="0"
          step="0.01"
        />

        <Select
          label="Валюта"
          items={currencyItems}
          value={selectedCurrency}
          onChange={handleSelectChange('currencyCode')}
          placeholder="Выберите валюту"
          style={{ marginBottom: '16px' }}
        />

        <Select
          label="Ставка НДС"
          items={ndsItems}
          value={selectedNds}
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

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
            Дата доставки*
          </label>
          <input
            type="datetime-local"
            value={formData.dateDelivery}
            onChange={handleDateChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>

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
      </div>
    </Modal>
  );
};