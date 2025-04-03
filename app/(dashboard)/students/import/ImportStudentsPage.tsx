'use client';

import { useState } from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { Upload } from 'lucide-react';
import ImportStudentsModal from '@/components/students/ImportStudentsModal';

export default function ImportStudentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentAcademicYear = '2024-2025'; // You can make this dynamic based on your needs

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Import Students</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Instructions Card */}
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="space-y-3">
              <p>Follow these steps to import students:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Download the template file (Excel/CSV)</li>
                <li>Fill in the student information</li>
                <li>Upload the file using the import button</li>
                <li>Map the columns to the correct fields</li>
                <li>Review and confirm the import</li>
              </ol>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Required Fields:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Student Name</li>
                  <li>Email</li>
                  <li>Admission Number</li>
                  <li>Class</li>
                  <li>Section</li>
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Optional Fields:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Roll Number</li>
                  <li>Date of Birth</li>
                  <li>Gender</li>
                  <li>Parent Name</li>
                  <li>Parent Phone</li>
                  <li>Parent Email</li>
                  <li>Address</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardBody>
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-6">
              {/* Download Template */}
              <div>
                <h3 className="font-semibold mb-3">1. Download Template</h3>
                <div className="flex gap-3">
                  <Button
                    color="primary"
                    variant="flat"
                    onClick={() => window.open('/templates/student-import-template.xlsx')}
                  >
                    Download Excel Template
                  </Button>
                  <Button
                    color="primary"
                    variant="flat"
                    onClick={() => window.open('/templates/student-import-template.csv')}
                  >
                    Download CSV Template
                  </Button>
                </div>
              </div>

              {/* Import Students */}
              <div>
                <h3 className="font-semibold mb-3">2. Import Students</h3>
                <Button
                  color="primary"
                  startContent={<Upload className="w-4 h-4" />}
                  onClick={() => setIsModalOpen(true)}
                >
                  Import Students
                </Button>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Notes:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Maximum file size: 5MB</li>
                  <li>Supported formats: .xlsx, .xls, .csv</li>
                  <li>Make sure all required fields are filled</li>
                  <li>Student email addresses must be unique</li>
                  <li>Admission numbers must be unique</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Import Modal */}
      <ImportStudentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        academicYear={currentAcademicYear}
      />
    </div>
  );
} 