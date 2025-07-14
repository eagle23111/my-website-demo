import React, { useState } from 'react';
import { Button } from '@consta/uikit/Button';
import { TextField } from '@consta/uikit/TextField';
import { Select } from '@consta/uikit/Select';
import { Modal } from '@consta/uikit/Modal';
import type { GetLotsParams } from '../services/lotservice';

interface LotFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterApply: (filters: Omit<GetLotsParams, 'page' | 'size' | 'sort'>) => void;
  initialFilters?: Omit<GetLotsParams, 'page' | 'size' | 'sort'>;
}

type NdsItem = {
  label: string;
  id: string;
};

type CurrencyItem = {
  label: string;
  id: string;
};

export const LotFilterModal: React.FC<LotFilterModalProps> = ({
  isOpen,
  onClose,
  onFilterApply,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<Omit<GetLotsParams, 'page' | 'size' | 'sort'>>(
    initialFilters || {
      lotName: '',
      customerCode: '',
      minPrice: undefined,
      maxPrice: undefined,
      currencyCode: '',
      ndsRate: '',
      placeDelivery: '',
    }
  );

  // Options for NDS rate
  const ndsItems: NdsItem[] = [
    { label: 'Без НДС', id: 'Без НДС' },
    { label: '18%', id: '18%' },
    { label: '20%', id: '20%' },
  ];

  // Options for currency
  const currencyItems: CurrencyItem[] = [
    { label: 'Рубль (RUB)', id: 'RUB' },
    { label: 'Доллар (USD)', id: 'USD' },
    { label: 'Евро (EUR)', id: 'EUR' },
  ];

  const handleInputChange = (field: keyof typeof filters) => (value: string | null) => {
    setFilters(prev => ({ ...prev, [field]: value || '' }));
  };

  const handleNumberInputChange = (field: 'minPrice' | 'maxPrice') => (value: string | null) => {
    const numValue = value ? parseFloat(value) : undefined;
    setFilters(prev => ({ ...prev, [field]: numValue }));
  };

  const handleSelectChange = (field: 'ndsRate' | 'currencyCode') => (value: { id: string } | null) => {
    setFilters(prev => ({ ...prev, [field]: value?.id || '' }));
  };

  const handleSubmit = () => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters)
        .filter(([_, value]) => value !== '' && value !== undefined)
    ) as Omit<GetLotsParams, 'page' | 'size' | 'sort'>;
    
    onFilterApply(cleanedFilters);
    onClose();
  };

  /*const handleReset = () => {
    setFilters({
      lotName: '',
      customerCode: '',
      minPrice: undefined,
      maxPrice: undefined,
      currencyCode: '',
      ndsRate: '',
      placeDelivery: '',
    });
    onFilterApply({});
    onClose();
  };*/

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
        <h2>Фильтр лотов</h2>

        <TextField
          label="Наименование лота*"
          value={filters.lotName || ''}
          onChange={handleInputChange('lotName')}
          placeholder="Введите наименование"
          style={{ marginBottom: '16px' }}
        />

        <TextField
          label="Код контрагента*"
          value={filters.customerCode || ''}
          onChange={handleInputChange('customerCode')}
          placeholder="Введите код контрагента"
          style={{ marginBottom: '16px' }}
        />

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <TextField
            label="Начальная стоимость*"
            type="number"
            value={filters.minPrice?.toString() || ''}
            onChange={handleNumberInputChange('minPrice')}
            placeholder="Введите стоимость"
            style={{ flex: 1 }}
          />
        </div>

        <Select
          label="Валюта"
          items={currencyItems}
          value={currencyItems.find(item => item.id === filters.currencyCode) || null}
          onChange={handleSelectChange('currencyCode')}
          placeholder="Выберите валюту"
          style={{ marginBottom: '16px' }}
        />

        <Select
          label="Ставка НДС"
          items={ndsItems}
          value={ndsItems.find(item => item.id === filters.ndsRate) || null}
          onChange={handleSelectChange('ndsRate')}
          placeholder="Выберите НДС"
          style={{ marginBottom: '16px' }}
        />

        <TextField
          label="Грузополучатель"
          value={filters.placeDelivery || ''}
          onChange={handleInputChange('placeDelivery')}
          placeholder="Введите грузополучателя"
          style={{ marginBottom: '16px' }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
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