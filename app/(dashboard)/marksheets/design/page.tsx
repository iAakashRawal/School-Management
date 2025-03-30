'use client';

import { MarksheetDesigner } from '@/components/marksheet/marksheet-designer';

export default function DesignMarksheetPage() {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Design Marksheet</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a new marksheet template
          </p>
        </div>
      </div>

      <MarksheetDesigner />
    </div>
  );
} 