'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface MonthlyAttendance {
  studentId: string;
  name: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  percentage: number;
}

export default function MonthlyAttendance() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [error, setError] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<MonthlyAttendance[]>([]);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    // TODO: Fetch monthly attendance data for selected class
    setAttendanceData([
      {
        studentId: '1',
        name: 'John Doe',
        present: 20,
        absent: 2,
        late: 1,
        total: 23,
        percentage: 87,
      },
      {
        studentId: '2',
        name: 'Jane Smith',
        present: 22,
        absent: 1,
        late: 0,
        total: 23,
        percentage: 96,
      },
      {
        studentId: '3',
        name: 'Mike Johnson',
        present: 18,
        absent: 3,
        late: 2,
        total: 23,
        percentage: 78,
      },
    ]);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Monthly Attendance</h1>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {error && (
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
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
              <Label htmlFor="month">Month</Label>
              <input
                type="month"
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          {selectedClass && (
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-4 font-medium">
                <div>Roll No.</div>
                <div>Student Name</div>
                <div>Present</div>
                <div>Absent</div>
                <div>Late</div>
                <div>Total Days</div>
                <div>Percentage</div>
              </div>
              {attendanceData.map((student) => (
                <div key={student.studentId} className="grid grid-cols-7 gap-4 items-center">
                  <div>1</div>
                  <div>{student.name}</div>
                  <div className="text-green-600">{student.present}</div>
                  <div className="text-red-600">{student.absent}</div>
                  <div className="text-yellow-600">{student.late}</div>
                  <div>{student.total}</div>
                  <div className={student.percentage >= 75 ? 'text-green-600' : 'text-red-600'}>
                    {student.percentage}%
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
              Back
            </Button>
            <Button
              type="button"
              onClick={() => router.push('/attendance/daily')}
            >
              Mark Daily Attendance
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 