/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ui/DataTable.tsx
import React, { useState, useMemo } from 'react';
import { 
  ArrowUp2, 
  ArrowDown2, 
  SearchNormal1, 
  DocumentDownload,
  Refresh
} from 'iconsax-react';
import Button from './Button';
import Input from './Input';

export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  className?: string;
}

export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
    onChange?: (page: number, pageSize: number) => void;
  };
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  showRefresh?: boolean;
  onRefresh?: () => void;
  showExport?: boolean;
  onExport?: () => void;
  rowKey?: keyof T | ((record: T) => string | number);
  onRow?: (record: T, index: number) => {
    onClick?: () => void;
    onDoubleClick?: () => void;
    className?: string;
  };
  emptyText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

type SortOrder = 'asc' | 'desc' | null;

interface SortState {
  key: string | null;
  order: SortOrder;
}

const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination,
  searchable = false,
  searchPlaceholder = 'Rechercher...',
  onSearch,
  showRefresh = false,
  onRefresh,
  showExport = false,
  onExport,
  rowKey = 'id',
  onRow,
  emptyText = 'Aucune donnée disponible',
  className = '',
  size = 'md',
}: DataTableProps<T>) => {
  const [searchValue, setSearchValue] = useState('');
  const [sortState, setSortState] = useState<SortState>({
    key: null,
    order: null,
  });

  // Size classes
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base',
  };

  const cellPadding = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  // Get row key
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index;
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  // Handle sort
  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    let newOrder: SortOrder = 'asc';
    if (sortState.key === columnKey) {
      newOrder = sortState.order === 'asc' ? 'desc' : sortState.order === 'desc' ? null : 'asc';
    }

    setSortState({
      key: newOrder ? columnKey : null,
      order: newOrder,
    });
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortState.key || !sortState.order) return data;

    const column = columns.find(col => col.key === sortState.key);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aVal = column.dataIndex ? a[column.dataIndex] : a[sortState.key!];
      const bVal = column.dataIndex ? b[column.dataIndex] : b[sortState.key!];

      if (aVal === bVal) return 0;
      
      const comparison = aVal > bVal ? 1 : -1;
      return sortState.order === 'asc' ? comparison : -comparison;
    });
  }, [data, sortState, columns]);

  // Render cell content
  const renderCell = (column: Column<T>, record: T, index: number) => {
    if (column.render) {
      return column.render(
        column.dataIndex ? record[column.dataIndex] : record[column.key],
        record,
        index
      );
    }
    return column.dataIndex ? record[column.dataIndex] : record[column.key];
  };

  // Render sort icon
  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const isActive = sortState.key === column.key;
    const iconColor = isActive ? '#3B82F6' : '#9CA3AF';
    const iconSize = size === 'sm' ? 14 : 16;

    if (isActive && sortState.order === 'desc') {
      return <ArrowDown2 size={iconSize} color={iconColor} />;
    }
    return <ArrowUp2 size={iconSize} color={iconColor} />;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Table Header Actions */}
      {(searchable || showRefresh || showExport) && (
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <div className="flex-1">
            {searchable && (
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                leftIcon={<SearchNormal1 size={16} color="#9CA3AF" />}
                className="max-w-xs"
              />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {showRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
                leftIcon={<Refresh size={16} color="#6B7280" />}
              >
                Actualiser
              </Button>
            )}
            
            {showExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                leftIcon={<DocumentDownload size={16} color="#6B7280" />}
              >
                Exporter
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={`w-full ${sizeClasses[size]}`}>
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    ${cellPadding[size]} font-medium text-gray-900 text-left
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                    ${column.align === 'center' ? 'text-center' : ''}
                    ${column.align === 'right' ? 'text-right' : ''}
                    ${column.className || ''}
                  `}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.title}</span>
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className={`${cellPadding[size]} text-center`}>
                  <div className="flex items-center justify-center gap-2 py-8">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-500">Chargement...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={`${cellPadding[size]} text-center text-gray-500 py-8`}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              sortedData.map((record, index) => {
                const rowProps = onRow?.(record, index) || {};
                return (
                  <tr
                    key={getRowKey(record, index)}
                    className={`hover:bg-gray-50 transition-colors ${rowProps.className || ''}`}
                    onClick={rowProps.onClick}
                    onDoubleClick={rowProps.onDoubleClick}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`
                          ${cellPadding[size]} text-gray-900
                          ${column.align === 'center' ? 'text-center' : ''}
                          ${column.align === 'right' ? 'text-right' : ''}
                          ${column.className || ''}
                        `}
                        style={{ width: column.width }}
                      >
                        {renderCell(column, record, index)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de {((pagination.current - 1) * pagination.pageSize) + 1} à{' '}
            {Math.min(pagination.current * pagination.pageSize, pagination.total)} sur{' '}
            {pagination.total} éléments
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current <= 1}
              onClick={() => pagination.onChange?.(pagination.current - 1, pagination.pageSize)}
            >
              Précédent
            </Button>
            
            <span className="px-3 py-1 text-sm">
              Page {pagination.current} sur {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => pagination.onChange?.(pagination.current + 1, pagination.pageSize)}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { DataTable };
export default DataTable;