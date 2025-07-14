import type { Lot } from "../types/lot";
import type { TableColumn } from "@consta/table/Table"
import { Checkbox } from '@consta/uikit/Checkbox';
import { DataCell } from '@consta/table/DataCell';
import { Table } from '@consta/table/Table';
import { Button } from '@consta/uikit/Button';
import { IconUnsort } from '@consta/icons/IconUnsort';
import { IconSortDown } from '@consta/icons/IconSortDown';
import { IconSortUp } from '@consta/icons/IconSortUp';
import React from 'react';
import { HeaderDataCell } from '@consta/table/HeaderDataCell';
import type { LotSortDirection, LotSortField } from '../services/lotservice';

const columns = (
  selectedRows: Set<string>,
  onSelectChange: (lotName: string, isSelected: boolean) => void,
  sortField: LotSortField | null,
  sortDirection: LotSortDirection | null,
  onSortChange: (field: LotSortField, direction: LotSortDirection | null) => void
): TableColumn<Lot>[] => [
  {
    title: '',
    accessor: 'selected',
    minWidth: 40,
    renderCell: (props) => {
      const isChecked = selectedRows.has(props.row.lotName);
      return (
        <DataCell>
          <Checkbox 
            size="s" 
            checked={isChecked} 
            onChange={() => onSelectChange(props.row.lotName, !isChecked)} 
          />
        </DataCell>
      );
    },
  },
  { 
    title: 'Наименование лота', 
    accessor: 'lotName',
    minWidth: 200,
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='Наименование лота'
        field="lotName"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
  { 
    title: 'Код контрагента', 
    accessor: 'customerCode',
    minWidth: 150,
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='Код контрагента'
        field="customerCode"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
  { 
    title: 'Начальная стоимость', 
    accessor: 'price',
    minWidth: 150,
    renderCell: (props) => (
      <DataCell>{props.row.price.toLocaleString()}</DataCell>
    ),
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='Начальная стоимость'
        field="price"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
  { 
    title: 'Валюта', 
    accessor: 'currencyCode',
    minWidth: 100,
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='Валюта'
        field="currencyCode"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
  { 
    title: 'Код НДС', 
    accessor: 'ndsRate',
    minWidth: 100,
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='Код НДС'
        field="ndsRate"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
  { 
    title: 'Грузополучатель', 
    accessor: 'placeDelivery',
    minWidth: 200,
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='Грузополучатель'
        field="placeDelivery"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
  { 
    title: 'Дата доставки', 
    accessor: 'dateDelivery',
    minWidth: 150,
    renderCell: (props) => (
      <DataCell>{new Date(props.row.dateDelivery).toLocaleDateString()}</DataCell>
    ),
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='Дата доставки'
        field="dateDelivery"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
];

interface SortableHeaderCellProps {
  title: string;
  field: LotSortField;
  currentSortField: LotSortField | null;
  currentSortDirection: LotSortDirection | null;
  onSortChange: (field: LotSortField, direction: LotSortDirection | null) => void;
}

const SortableHeaderCell: React.FC<SortableHeaderCellProps> = ({
  title,
  field,
  currentSortField,
  currentSortDirection,
  onSortChange,
}) => {
  const isActive = currentSortField === field;
  const icon = isActive
    ? currentSortDirection === 'asc'
      ? IconSortUp
      : IconSortDown
    : IconUnsort;

  const handleClick = () => {
    if (!isActive) {
      onSortChange(field, 'asc');
    } else if (currentSortDirection === 'asc') {
      onSortChange(field, 'desc');
    } else {
      onSortChange(field, null);
    }
  };

  return (
    <HeaderDataCell
      controlRight={[
        <Button
          size="s"
          view="clear"
          iconLeft={icon}
          onlyIcon
          onClick={handleClick}
        />,
      ]}
    >
      {title}
    </HeaderDataCell>
  );
};

type LotTableProps = {
  rows: Lot[];
  selectedRows: Set<string>;
  sortField: LotSortField | null;
  sortDirection: LotSortDirection | null;
  onSelectChange: (lotName: string, isSelected: boolean) => void;
  onSortChange: (field: LotSortField, direction: LotSortDirection | null) => void;
};

export const LotTable = React.forwardRef<HTMLDivElement, LotTableProps>(
  ({ 
    rows, 
    selectedRows, 
    sortField, 
    sortDirection,
    onSelectChange, 
    onSortChange 
  }, ref) => {
    return (
      <Table 
        rows={rows} 
        columns={columns(selectedRows, onSelectChange, sortField, sortDirection, onSortChange)} 
        rowHoverEffect
        ref={ref}
      />
    );
  }
);

LotTable.displayName = 'LotTable';