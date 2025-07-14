import React, { useState, useEffect } from 'react';
import { Button } from '@consta/uikit/Button';
import { TextField } from '@consta/uikit/TextField';
import { Checkbox } from '@consta/uikit/Checkbox';
import { Modal } from '@consta/uikit/Modal';
import { Loader } from '@consta/uikit/Loader';
import { updateCustomer, getCustomers } from '../services/customerservice';
import type { UpdateCustomerRequest } from '../services/customerservice';

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerUpdated: () => void; 
  selectedRows: Set<string>; 
}

export const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerUpdated,
  selectedRows,
}) => {
  const [formData, setFormData] = useState<UpdateCustomerRequest>({
    customerCode: '',
    customerName: '',
    isOrganization: false,
    isPerson: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!isOpen || selectedRows.size !== 1) return;
      
      setIsFetching(true);
      setError(null);
      try {
        const code = Array.from(selectedRows)[0];
        const response = await getCustomers({ customerCode: code });
        
        if (response.content.length === 0) {
          throw new Error('Клиент не найден');
        }
        
        const customer = response.content[0];
        setFormData({
          customerCode: customer.customerCode,
          customerName: customer.customerName,
          customerInn: customer.customerInn,
          customerKpp: customer.customerKpp,
          customerLegalAddress: customer.customerLegalAddress,
          customerPostalAddress: customer.customerPostalAddress,
          customerEmail: customer.customerEmail,
          customerCodeMain: customer.customerCodeMain || undefined,
          isOrganization: customer.isOrganization,
          isPerson: customer.isPerson,
        });
      } catch (err) {
        setError('Не удалось загрузить данные клиента. Пожалуйста, попробуйте снова.');
        console.error('Ошибка при загрузке клиента:', err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchCustomerData();
  }, [isOpen, selectedRows]);

  const handleInputChange = (field: keyof UpdateCustomerRequest) => (value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value || '' }));
  };

  const handleCheckboxChange = (field: keyof UpdateCustomerRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.checked }));
  };

  const handleSubmit = async () => {
    if (!formData.customerCode || !formData.customerName) {
      setError('Код и название клиента обязательны для заполнения');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateCustomer(formData.customerCode, formData);
      onCustomerUpdated();  
      onClose();
    } catch (err) {
      setError('Не удалось обновить данные клиента. Пожалуйста, попробуйте снова.');
      console.error('Ошибка при обновлении клиента:', err);
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
        <h2>Редактировать клиента</h2>
        
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
              label="Код*"
              value={formData.customerCode}
              onChange={handleInputChange('customerCode')}
              placeholder="Введите код клиента"
              disabled 
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
              label="Почтовый адрес"
              value={formData.customerPostalAddress || ''}
              onChange={handleInputChange('customerPostalAddress')}
              placeholder="Введите почтовый адрес"
              style={{ marginBottom: '16px' }}
            />

            <TextField
              label="Email"
              value={formData.customerEmail || ''}
              onChange={handleInputChange('customerEmail')}
              placeholder="Введите email"
              style={{ marginBottom: '16px' }}
            />

            <TextField
              label="Основной код клиента"
              value={formData.customerCodeMain || ''}
              onChange={handleInputChange('customerCodeMain')}
              placeholder="Введите основной код клиента"
              style={{ marginBottom: '16px' }}
            />

            <div style={{ marginBottom: '16px' }}>
              <Checkbox
                label="Юридическое лицо"
                checked={formData.isOrganization}
                onChange={handleCheckboxChange('isOrganization')}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Checkbox
                label="Физическое лицо"
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
                label={isLoading ? "Обновление..." : "Обновить клиента"}
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