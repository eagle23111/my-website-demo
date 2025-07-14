import React, { useState, useEffect, useCallback } from 'react';
import { Pagination } from '@consta/table/Pagination';
import { Toolbar } from '@consta/table/Toolbar';
import { Button } from '@consta/uikit/Button';
import { LotTable } from '../components/lottable';
import { getLots, deleteLot, type GetLotsParams, type LotSortField, type LotSortDirection } from '../services/lotservice';
import { CreateLotModal } from '../components/createlotmodal';
import { EditLotModal } from '../components/editlotmodal';
import { LotFilterModal } from '../components/lotfiltermodal';
import type { Lot } from '../types/lot';

const LotPage: React.FC = () => {
  const [lots, setLots] = useState<Lot[]>([]);
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
  const [sortField, setSortField] = useState<LotSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<LotSortDirection | null>(null);
  const [filters, setFilters] = useState<Omit<GetLotsParams, 'page' | 'size'>>({});

  const fetchLots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: GetLotsParams = {
        page: pagination.offset / pagination.step,
        size: pagination.step,
        ...filters, 
      };
      
      if (sortField && sortDirection) {
        params.sort = `${sortField},${sortDirection}`;
      }
      
      const response = await getLots(params);
      setLots(response.content);
      setPagination(prev => ({
        ...prev,
        total: response.totalElements,
      }));
    } catch (err) {
      setError('Не удалось загрузить лоты');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.offset, pagination.step, sortField, sortDirection, filters]);

  useEffect(() => {
    fetchLots();
  }, [fetchLots]);

  const handlePageChange = (offset: number) => {
    setPagination(prev => ({ ...prev, offset }));
    setSelectedRows(new Set());
  };

  const handleStepChange = (step: number) => {
    setPagination(prev => ({ ...prev, step, offset: 0 }));
    setSelectedRows(new Set());
  };

  const handleSortChange = (field: LotSortField, direction: LotSortDirection | null) => {
    setSortField(direction ? field : null);
    setSortDirection(direction);
    setPagination(prev => ({ ...prev, offset: 0 }));
    setSelectedRows(new Set());
  };

  const handleLotCreated = () => {
    fetchLots();
    setIsCreateModalOpen(false);
  };

  const handleLotUpdated = () => {
    fetchLots();
    setIsEditModalOpen(false);
  };

  const handleSelectChange = (lotName: string, isSelected: boolean) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(lotName);
      } else {
        newSet.delete(lotName);
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
      ? 'Вы уверены, что хотите удалить выбранный лот?'
      : `Вы уверены, что хотите удалить ${selectedRows.size} выбранных лотов?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const deletePromises = Array.from(selectedRows).map(name => deleteLot(name));
      await Promise.all(deletePromises);
      
      await fetchLots();
      setSelectedRows(new Set());
    } catch (err) {
      setError('Не удалось удалить лоты');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = (newFilters: Omit<GetLotsParams, 'page' | 'size'>) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, offset: 0 })); 
    setSelectedRows(new Set());
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

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
                  label="Редактировать лот"
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
            label="Создать лот"
            view="primary"
            onClick={() => setIsCreateModalOpen(true)}
          />
        </div>
      </div>
      
      <LotTable 
        rows={lots} 
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

      <CreateLotModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onLotCreated={handleLotCreated}
      />

      <EditLotModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onLotUpdated={handleLotUpdated}
        selectedRows={selectedRows}
      />

      <LotFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilterApply={handleFilterApply}
        initialFilters={filters}
      />
    </div>
  );
};

export default LotPage;