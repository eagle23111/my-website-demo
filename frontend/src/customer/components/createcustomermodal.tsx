import React, { useState } from 'react';
import { Button } from '@consta/uikit/Button';
import { TextField } from '@consta/uikit/TextField';
import { Checkbox } from '@consta/uikit/Checkbox';
import { Modal } from '@consta/uikit/Modal';
import { createCustomer } from '../services/customerservice';
import type { CreateCustomerRequest } from '../services/customerservice';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated: () => void;  
}

export const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerCreated,
}) => {
  const [formData, setFormData] = useState<CreateCustomerRequest>({
    customerCode: '',
    customerName: '',
    isOrganization: false,
    isPerson: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof CreateCustomerRequest) => (value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value || '' }));
  };

  const handleCheckboxChange = (field: keyof CreateCustomerRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.checked }));
  };

  const handleSubmit = async () => {
    if (!formData.customerCode || !formData.customerName) {
      setError('Необходимо указать код и название клиента');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createCustomer(formData);
      onCustomerCreated(); 
      onClose(); 
      setFormData({
        customerCode: '',
        customerName: '',
        isOrganization: false,
        isPerson: false,
      });
    } catch (err) {
      setError('Ошибка при создании клиента. Пожалуйста, попробуйте снова.');
      console.error('Error creating customer:', err);
    } finally {
      setIsLoading(false);
    }
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
        <h2>Создание нового клиента</h2>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <TextField
          label="Код клиента*"
          value={formData.customerCode}
          onChange={handleInputChange('customerCode')}
          placeholder="Введите код клиента"
          style={{ marginBottom: '16px' }}
        />

        <TextField
          label="Название клиента*"
          value={formData.customerName}
          onChange={handleInputChange('customerName')}
          placeholder="Введите название клиента"
          style={{ marginBottom: '16px' }}
        />

        <TextField
          label="ИНН"
          value={formData.customerInn || ''}
          onChange={handleInputChange('customerInn')}
          placeholder="Введите ИНН"
          style={{ marginBottom: '16px' }}
        />

        <TextField
          label="КПП"
          value={formData.customerKpp || ''}
          onChange={handleInputChange('customerKpp')}
          placeholder="Введите КПП"
          style={{ marginBottom: '16px' }}
        />

        <TextField
          label="Юридический адрес"
          value={formData.customerLegalAddress || ''}
          onChange={handleInputChange('customerLegalAddress')}
          placeholder="Введите юридический адрес"
          style={{ marginBottom: '16px' }}
        />

        <TextField
          label="Email"
          value={formData.customerEmail || ''}
          onChange={handleInputChange('customerEmail')}
          placeholder="Введите email"
          style={{ marginBottom: '16px' }}
        />

        <div style={{ marginBottom: '16px' }}>
          <Checkbox
            label="Юр. лицо"
            checked={formData.isOrganization}
            onChange={handleCheckboxChange('isOrganization')}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Checkbox
            label="Физ. лицо"
            checked={formData.isPerson}
            onChange={handleCheckboxChange('isPerson')}
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
            label={isLoading ? "Создание..." : "Создать клиента"}
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