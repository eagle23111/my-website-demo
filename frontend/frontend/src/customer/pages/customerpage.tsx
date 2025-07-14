import React, { useState, useEffect, useCallback } from 'react';
import { Pagination } from '@consta/table/Pagination';
import { Toolbar } from '@consta/table/Toolbar';
import { Button } from '@consta/uikit/Button';
import { CustomerTable } from '../components/customertable';
import { getCustomers, deleteCustomer, type GetCustomersParams, type SortField, type SortDirection } from '../services/customerservice';
import { CreateCustomerModal } from '../components/createcustomermodal';
import { EditCustomerModal } from '../components/editcustomermodal';
import { CustomerFilterModal } from '../components/customerfiltermodal';
import type { Customer } from '../types/customer';

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [pagination, setPagination] = useState({
    offset: 0,
    step: 10,
    total: 0,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);
  const [filters, setFilters] = useState<Omit<GetCustomersParams, 'page' | 'size'>>({});

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: GetCustomersParams = {
        page: pagination.offset / pagination.step,
        size: pagination.step,
        ...filters, 
      };
      
      if (sortField && sortDirection) {
        params.sort = `${sortField},${sortDirection}`;
      }
      
      const response = await getCustomers(params);
      setCustomers(response.content);
      setPagination(prev => ({
        ...prev,
        total: response.totalElements,
      }));
    } catch (err) {
      setError('Failed to fetch customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.offset, pagination.step, sortField, sortDirection, filters]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handlePageChange = (offset: number) => {
    setPagination(prev => ({ ...prev, offset }));
    setSelectedRows(new Set());
  };

  const handleStepChange = (step: number) => {
    setPagination(prev => ({ ...prev, step, offset: 0 }));
    setSelectedRows(new Set());
  };

  const handleSortChange = (field: SortField, direction: SortDirection | null) => {
    setSortField(direction ? field : null);
    setSortDirection(direction);
    setPagination(prev => ({ ...prev, offset: 0 }));
    setSelectedRows(new Set());
  };

  const handleCustomerCreated = () => {
    fetchCustomers();
    setIsCreateModalOpen(false);
  };

  const handleCustomerUpdated = () => {
    fetchCustomers();
    setIsEditModalOpen(false);
  };

  const handleSelectChange = (customerCode: string, isSelected: boolean) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(customerCode);
      } else {
        newSet.delete(customerCode);
      }
      return newSet;
    });
  };

  const handleEditClick = () => {
    if (selectedRows.size === 1) {
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteClick = async () => {
    if (selectedRows.size === 0) return;

    const confirmMessage = selectedRows.size === 1
      ? 'Вы уверены, что хотите удалить выбранного клиента?'
      : `Вы уверены, что хотите удалить ${selectedRows.size} выбранных клиентов?`;


    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const deletePromises = Array.from(selectedRows).map(code => deleteCustomer(code));
      await Promise.all(deletePromises);
      
      await fetchCustomers();
      setSelectedRows(new Set());
    } catch (err) {
      setError('Failed to delete customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = (newFilters: Omit<GetCustomersParams, 'page' | 'size'>) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, offset: 0 })); 
    setSelectedRows(new Set());
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          {selectedRows.size > 0 && (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span>
                Выбрано: {selectedRows.size} 
              </span>
              <Button
                label="Удалить"             
                view="secondary"
                onClick={handleDeleteClick}
                disabled={selectedRows.size === 0}
              />
              {selectedRows.size === 1 && (
                <Button
                  label="Редактировать клиента"
                  view="secondary"
                  onClick={handleEditClick}
                />
              )}

            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button
            label="Фильтр"
            view="secondary"
            onClick={() => setIsFilterModalOpen(true)}
          />
          <Button
            label="Создать клиента"
            view="primary"
            onClick={() => setIsCreateModalOpen(true)}
          />
        </div>
      </div>
      
      <CustomerTable 
        rows={customers} 
        selectedRows={selectedRows}
        sortField={sortField}
        sortDirection={sortDirection}
        onSelectChange={handleSelectChange}
        onSortChange={handleSortChange}
      />
      
      <Toolbar
        form="defaultBrick"
        rightSide={
          <Pagination
            offset={pagination.offset}
            step={pagination.step}
            total={pagination.total}
            onChange={handlePageChange}
            onStepChange={handleStepChange}
          />
        }
      />

      <CreateCustomerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCustomerCreated={handleCustomerCreated}
      />

      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onCustomerUpdated={handleCustomerUpdated}
        selectedRows={selectedRows}
      />

      <CustomerFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilterApply={handleFilterApply}
        initialFilters={filters}
      />
    </div>
  );
};

export default CustomerPage;