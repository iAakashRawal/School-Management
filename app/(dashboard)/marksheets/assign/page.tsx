'use client';

import { MarksAssigner } from '@/components/marksheet/marks-assigner';

export default function AssignMarksPage() {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Assign Marks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Assign marks to students for examinations
          </p>
        </div>
      </div>

      <MarksAssigner />
    </div>
  );
} 