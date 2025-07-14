import type { Customer } from "../types/customer";
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
import type { SortDirection, SortField } from '../services/customerservice';

const columns = (
  selectedRows: Set<string>,
  onSelectChange: (customerCode: string, isSelected: boolean) => void,
  sortField: SortField | null,
  sortDirection: SortDirection | null,
  onSortChange: (field: SortField, direction: SortDirection | null) => void
): TableColumn<Customer>[] => [
  {
    title: '',
    accessor: 'selected',
    minWidth: 40,
    renderCell: (props) => {
      const isChecked = selectedRows.has(props.row.customerCode);
      return (
        <DataCell>
          <Checkbox 
            size="s" 
            checked={isChecked} 
            onChange={() => onSelectChange(props.row.customerCode, !isChecked)} 
          />
        </DataCell>
      );
    },
  },
  { 
    title: 'Код клиента', 
    accessor: 'customerCode',
    minWidth: 120,
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='Код клиента'
        field="customerCode"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
  { 
    title: 'Название клиента', 
    accessor: 'customerName',
    minWidth: 120,
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='Название клиента'
        field="customerName"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
        
      />
    )
  },
  { 
    title: 'ИНН', 
    accessor: 'customerInn',
    minWidth: 150,
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='ИНН'
        field="customerInn"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
  { 
    title: 'КПП', 
    accessor: 'customerKpp',
    minWidth: 150,
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='КПП'
        field="customerKpp"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
{ 
    title: 'Юридический адрес', 
    accessor: 'customerLegalAddress',
    minWidth: 200,
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='Юридический адрес'
        field="customerLegalAddress"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
  { 
    title: 'Почтовый адрес', 
    accessor: 'customerPostalAddress',
    minWidth: 200,
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='Почтовый адрес'
        field="customerPostalAddress"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
  { 
    title: 'Email', 
    accessor: 'customerEmail',
    minWidth: 200,
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='Email'
        field="customerEmail"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
  { 
    title: 'Основной код клиента', 
    accessor: 'customerCodeMain',
    minWidth: 200,
    renderCell: (props) => (
      <DataCell>{props.row.customerCodeMain ?? '—'}</DataCell>
    ),
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='Основной код клиента'
        field="customerCodeMain"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
  { 
    title: 'Юр. лицо', 
    accessor: 'isOrganization',
    minWidth: 100,
    renderCell: (props) => (
      <DataCell>{props.row.isOrganization ? 'Да' : 'Нет'}</DataCell>
    ),
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='Юр. лицо'
        field="isOrganization"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
  { 
    title: 'Физ. лицо', 
    accessor: 'isPerson',
    minWidth: 100,
    renderCell: (props) => (
      <DataCell>{props.row.isPerson ? 'Да' : 'Нет'}</DataCell>
    ),
    renderHeaderCell: () => (
      <SortableHeaderCell
        title='Физ. лицо'
        field="isPerson"
        currentSortField={sortField}
        currentSortDirection={sortDirection}
        onSortChange={onSortChange}
      />
    )
  },
];

interface SortableHeaderCellProps {
  title: string;
  field: SortField;
  currentSortField: SortField | null;
  currentSortDirection: SortDirection | null;
  onSortChange: (field: SortField, direction: SortDirection | null) => void;
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

type CustomerTableProps = {
  rows: Customer[];
  selectedRows: Set<string>;
  sortField: SortField | null;
  sortDirection: SortDirection | null;
  onSelectChange: (customerCode: string, isSelected: boolean) => void;
  onSortChange: (field: SortField, direction: SortDirection | null) => void;
};

export const CustomerTable = React.forwardRef<HTMLDivElement, CustomerTableProps>(
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

CustomerTable.displayName = 'CustomerTable';