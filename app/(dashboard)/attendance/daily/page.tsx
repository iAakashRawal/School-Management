'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AttendanceData {
  studentId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  date: string;
  classId: string;
}

interface ApiError {
  message: string;
}

export default function DailyAttendance() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    // TODO: Fetch students for selected class
    setAttendanceData([
      { studentId: '1', status: 'PRESENT', date: selectedDate, classId: value },
      { studentId: '2', status: 'ABSENT', date: selectedDate, classId: value },
      { studentId: '3', status: 'LATE', date: selectedDate, classId: value },
    ]);
  };

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceData(prev =>
      prev.map(student =>
        student.studentId === studentId ? { ...student, status } : student
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Attendance marked successfully!');
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Failed to mark attendance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Daily Attendance</h1>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
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
              <Label htmlFor="classId">Class</Label>
              <Select value={selectedClass} onValueChange={handleClassChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Class 1 - Section A</SelectItem>
                  <SelectItem value="2">Class 2 - Section B</SelectItem>
                  <SelectItem value="3">Class 3 - Section C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          {selectedClass && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 font-medium">
                <div>Roll No.</div>
                <div>Student Name</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              {attendanceData.map((student) => (
                <div key={student.studentId} className="grid grid-cols-4 gap-4 items-center">
                  <div>1</div>
                  <div>John Doe</div>
                  <div>{student.status}</div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={student.status === 'PRESENT' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(student.studentId, 'PRESENT')}
                    >
                      Present
                    </Button>
                    <Button
                      type="button"
                      variant={student.status === 'ABSENT' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(student.studentId, 'ABSENT')}
                    >
                      Absent
                    </Button>
                    <Button
                      type="button"
                      variant={student.status === 'LATE' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(student.studentId, 'LATE')}
                    >
                      Late
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Attendance'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 