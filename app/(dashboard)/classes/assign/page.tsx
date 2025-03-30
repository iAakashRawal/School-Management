'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AssignmentFormData {
  studentId: string;
  classId: string;
  academicYear: string;
  rollNumber: string;
}

interface ApiError {
  message: string;
}

export default function AssignStudent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<AssignmentFormData>({
    studentId: '',
    classId: '',
    academicYear: new Date().getFullYear().toString(),
    rollNumber: '',
  });

  const handleSelectChange = (field: keyof AssignmentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Student assigned to class successfully!');
      router.push('/classes');
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Failed to assign student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Assign Student to Class</h1>
        <Button variant="outline" onClick={() => router.push('/classes')}>
          Back to Classes
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student</Label>
              <Select value={formData.studentId} onValueChange={(value) => handleSelectChange('studentId', value)}>
                <SelectTrigger className=" border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent className=" border-gray-300 dark:border-gray-600">
                  <SelectItem value="1" className="border-b border-gray-200 dark:border-gray-700">John Doe</SelectItem>
                  <SelectItem value="2" className="border-b border-gray-200 dark:border-gray-700">Jane Smith</SelectItem>
                  <SelectItem value="3">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classId">Class</Label>
              <Select value={formData.classId} onValueChange={(value) => handleSelectChange('classId', value)}>
                <SelectTrigger className=" border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className=" border-gray-300 dark:border-gray-600">
                  <SelectItem value="1" className="border-b border-gray-200 dark:border-gray-700">Class 1 - Section A</SelectItem>
                  <SelectItem value="2" className="border-b border-gray-200 dark:border-gray-700">Class 2 - Section B</SelectItem>
                  <SelectItem value="3">Class 3 - Section C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Select value={formData.rollNumber} onValueChange={(value) => handleSelectChange('rollNumber', value)}>
                <SelectTrigger className=" border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select roll number" />
                </SelectTrigger>
                <SelectContent className=" border-gray-300 dark:border-gray-600">
                  <SelectItem value="1" className="border-b border-gray-200 dark:border-gray-700">1</SelectItem>
                  <SelectItem value="2" className="border-b border-gray-200 dark:border-gray-700">2</SelectItem>
                  <SelectItem value="3" className="border-b border-gray-200 dark:border-gray-700">3</SelectItem>
                  <SelectItem value="4" className="border-b border-gray-200 dark:border-gray-700">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Select value={formData.academicYear} onValueChange={(value) => handleSelectChange('academicYear', value)}>
                <SelectTrigger className=" border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent className=" border-gray-300 dark:border-gray-600">
                  <SelectItem value="2024" className="border-b border-gray-200 dark:border-gray-700">2024-2025</SelectItem>
                  <SelectItem value="2023">2023-2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/classes')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Assigning...' : 'Assign Student'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 