import React, { useState } from 'react';
import { Button } from '@consta/uikit/Button';
import { TextField } from '@consta/uikit/TextField';
import { Checkbox } from '@consta/uikit/Checkbox';
import { Modal } from '@consta/uikit/Modal';
import type { GetCustomersParams } from '../services/customerservice';

interface CustomerFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterApply: (filters: Omit<GetCustomersParams, 'page' | 'size'>) => void;
  initialFilters?: Omit<GetCustomersParams, 'page' | 'size'>;
}

export const CustomerFilterModal: React.FC<CustomerFilterModalProps> = ({
  isOpen,
  onClose,
  onFilterApply,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<Omit<GetCustomersParams, 'page' | 'size'>>(
    initialFilters || {
      customerCode: '',
      name: '',
      inn: '',
      customerLegalAddress: '',
      customerPostalAddress: '',
      customerEmail: '',
      customerCodeMain: '',
      isOrganization: undefined,
      isPerson: undefined,
    }
  );

  const handleInputChange = (field: keyof typeof filters) => (value: string | null) => {
    setFilters(prev => ({ ...prev, [field]: value || '' }));
  };

  const handleCheckboxChange = (field: 'isOrganization' | 'isPerson') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ 
      ...prev, 
      [field]: e.target.checked ? true : undefined 
    }));
  };

  const handleSubmit = () => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters)
        .filter(([_, value]) => value !== '' && value !== undefined)
    ) as Omit<GetCustomersParams, 'page' | 'size'>;
    
    onFilterApply(cleanedFilters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      customerCode: '',
      name: '',
      inn: '',
      customerLegalAddress: '',
      customerPostalAddress: '',
      customerEmail: '',
      customerCodeMain: '',
      isOrganization: undefined,
      isPerson: undefined,
    });
    onFilterApply({});
    onClose();
  };

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
        <h2>Фильтр клиентов</h2>

        <TextField
          label="Код клиента"
          value={filters.customerCode || ''}
          onChange={handleInputChange('customerCode')}
          placeholder="Фильтр по коду"
          style={{ marginBottom: '16px' }}
        />

        <TextField
          label="Название клиента"
          value={filters.name || ''}
          onChange={handleInputChange('name')}
          placeholder="Фильтр по названию"
          style={{ marginBottom: '16px' }}
        />

        <TextField
          label="ИНН"
          value={filters.inn || ''}
          onChange={handleInputChange('inn')}
          placeholder="Фильтр по ИНН"
          style={{ marginBottom: '16px' }}
        />

        <TextField
          label="Юридический адрес"
          value={filters.customerLegalAddress || ''}
          onChange={handleInputChange('customerLegalAddress')}
          placeholder="Фильтр по юр. адресу"
          style={{ marginBottom: '16px' }}
        />

        <TextField
          label="Почтовый адрес"
          value={filters.customerPostalAddress || ''}
          onChange={handleInputChange('customerPostalAddress')}
          placeholder="Фильтр по почтовому адресу"
          style={{ marginBottom: '16px' }}
        />

        <TextField
          label="Email"
          value={filters.customerEmail || ''}
          onChange={handleInputChange('customerEmail')}
          placeholder="Фильтр по email"
          style={{ marginBottom: '16px' }}
        />

        <TextField
          label="Основной код клиента"
          value={filters.customerCodeMain || ''}
          onChange={handleInputChange('customerCodeMain')}
          placeholder="Фильтр по основному коду"
          style={{ marginBottom: '16px' }}
        />

        <div style={{ marginBottom: '16px' }}>
          <Checkbox
            label="Юр. лицо"
            checked={filters.isOrganization || false}
            onChange={handleCheckboxChange('isOrganization')}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Checkbox
            label="Физ. лицо"
            checked={filters.isPerson || false}
            onChange={handleCheckboxChange('isPerson')}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button
            label="Сбросить"
            view="secondary"
            onClick={handleReset}
          />
          <Button
            label="Отмена"
            view="secondary"
            onClick={onClose}
          />
          <Button
            label="Применить фильтры"
            view="primary"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};