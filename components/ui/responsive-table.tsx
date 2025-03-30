'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  onRowClick?: (item: T) => void;
  showDeleteButton?: boolean;
  onDelete?: (item: T) => void;
}

export function ResponsiveTable<T>({ 
  data, 
  columns, 
  title, 
  onRowClick,
  showDeleteButton = false,
  onDelete
}: ResponsiveTableProps<T>) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleDeleteClick = (e: React.MouseEvent, item: T) => {
    e.stopPropagation(); // Prevent row click from being triggered
    onDelete?.(item);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {title && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        </div>
      )}
      
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {showDeleteButton && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(item)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.cell ? column.cell(item) : String(item[column.accessor])}
                  </td>
                ))}
                {showDeleteButton && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => handleDeleteClick(e, item)}
                      className="flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {data.map((item, index) => (
          <div
            key={index}
            className="border-b border-gray-200"
          >
            <button
              onClick={() => toggleRow(index)}
              className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50"
            >
              <div className="flex items-center">
                <div className="text-sm font-medium text-gray-900">
                  {String(item[columns[0].accessor])}
                </div>
              </div>
              <svg
                className={`h-5 w-5 text-gray-500 transform transition-transform ${
                  expandedRow === index ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {expandedRow === index && (
              <div className="px-4 py-3 bg-gray-50">
                {columns.slice(1).map((column, colIndex) => (
                  <div
                    key={colIndex}
                    className="flex justify-between py-2 text-sm"
                  >
                    <span className="text-gray-500">{column.header}</span>
                    <span className="text-gray-900">
                      {column.cell ? column.cell(item) : String(item[column.accessor])}
                    </span>
                  </div>
                ))}
                {showDeleteButton && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => handleDeleteClick(e, item)}
                      className="flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 