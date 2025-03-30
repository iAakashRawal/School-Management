'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface DueFee {
  studentId: string;
  studentName: string;
  class: string;
  feeType: string;
  amount: number;
  dueDate: string;
  status: 'OVERDUE' | 'DUE_SOON' | 'PAID';
}

export default function DueFees() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dueFees, setDueFees] = useState<DueFee[]>([
    {
      studentId: '1',
      studentName: 'John Doe',
      class: 'Class 1 - Section A',
      feeType: 'Tuition Fee',
      amount: 5000,
      dueDate: '2024-03-15',
      status: 'OVERDUE',
    },
    {
      studentId: '2',
      studentName: 'Jane Smith',
      class: 'Class 2 - Section B',
      feeType: 'Transport Fee',
      amount: 2000,
      dueDate: '2024-03-20',
      status: 'DUE_SOON',
    },
    {
      studentId: '3',
      studentName: 'Mike Johnson',
      class: 'Class 3 - Section C',
      feeType: 'Hostel Fee',
      amount: 8000,
      dueDate: '2024-03-25',
      status: 'DUE_SOON',
    },
  ]);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    // TODO: Fetch due fees for selected class
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    // TODO: Filter due fees by status
  };

  const getStatusColor = (status: DueFee['status']) => {
    switch (status) {
      case 'OVERDUE':
        return 'text-red-600';
      case 'DUE_SOON':
        return 'text-yellow-600';
      case 'PAID':
        return 'text-green-600';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Due Fees</h1>
        <Button variant="outline" onClick={() => router.push('/fees')}>
          Back to Fees
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
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
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                  <SelectItem value="DUE_SOON">Due Soon</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-4 font-medium">
              <div>Student Name</div>
              <div>Class</div>
              <div>Fee Type</div>
              <div>Amount</div>
              <div>Due Date</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            {dueFees.map((fee) => (
              <div key={fee.studentId} className="grid grid-cols-7 gap-4 items-center">
                <div>{fee.studentName}</div>
                <div>{fee.class}</div>
                <div>{fee.feeType}</div>
                <div>₹{fee.amount}</div>
                <div>{new Date(fee.dueDate).toLocaleDateString()}</div>
                <div className={getStatusColor(fee.status)}>
                  {fee.status.replace('_', ' ')}
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/fees/collections?studentId=${fee.studentId}`)}
                  >
                    Collect Fee
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/fees')}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => router.push('/fees/collections')}
            >
              New Collection
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 