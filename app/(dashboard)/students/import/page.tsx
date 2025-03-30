'use client';

import { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UploadError extends Error {
  message: string;
}

export default function ImportStudents() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a valid CSV or Excel file');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Implement actual file upload and processing
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('File uploaded successfully! Processing students data...');
      
      // Mock processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Students imported successfully!');
    } catch (error) {
      const uploadError = error as UploadError;
      setError(uploadError.message || 'Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Import Students</h1>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <Upload className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">Upload Student Data</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upload your student data using CSV or Excel file
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <label className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                  />
                  <Button variant="outline" className="cursor-pointer">
                    Choose File
                  </Button>
                </label>
                {file && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <FileText className="h-4 w-4" />
                    <span>{file.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm">{success}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setFile(null)}>
              Clear
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              className="min-w-[100px]"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
            <h4 className="font-medium mb-4">Instructions</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Upload a CSV or Excel file containing student data</li>
              <li>The file should have the following columns:
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>First Name (required)</li>
                  <li>Last Name (required)</li>
                  <li>Email (required)</li>
                  <li>Phone Number</li>
                  <li>Date of Birth (YYYY-MM-DD format)</li>
                  <li>Address</li>
                  <li>Parent/Guardian Name</li>
                  <li>Parent/Guardian Phone</li>
                  <li>Parent/Guardian Email</li>
                </ul>
              </li>
              <li>Maximum file size: 10MB</li>
              <li>Supported formats: .csv, .xlsx, .xls</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
} 