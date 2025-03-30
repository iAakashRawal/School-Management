'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface TransportFee {
  studentId: string;
  studentName: string;
  class: string;
  routeId: string;
  routeName: string;
  amount: string;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
}

interface ApiError {
  message: string;
}

export default function TransportFees() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [transportFees, setTransportFees] = useState<TransportFee[]>([
    {
      studentId: '1',
      studentName: 'John Doe',
      class: 'Class 1 - Section A',
      routeId: '1',
      routeName: 'Route 1 - North Zone',
      amount: '2000',
      frequency: 'MONTHLY',
      dueDate: '2024-03-15',
      status: 'PAID',
    },
    {
      studentId: '2',
      studentName: 'Jane Smith',
      class: 'Class 2 - Section B',
      routeId: '2',
      routeName: 'Route 2 - South Zone',
      amount: '2000',
      frequency: 'MONTHLY',
      dueDate: '2024-03-15',
      status: 'PENDING',
    },
    {
      studentId: '3',
      studentName: 'Mike Johnson',
      class: 'Class 3 - Section C',
      routeId: '3',
      routeName: 'Route 3 - East Zone',
      amount: '2000',
      frequency: 'MONTHLY',
      dueDate: '2024-03-15',
      status: 'OVERDUE',
    },
  ]);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedRoute('');
    // TODO: Fetch transport fees for selected class
  };

  const handleRouteChange = (value: string) => {
    setSelectedRoute(value);
    // TODO: Filter transport fees by selected route
  };

  const handleStatusChange = async (studentId: string, status: TransportFee['status']) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Transport fee status updated successfully!');
      setTransportFees(prev =>
        prev.map(fee =>
          fee.studentId === studentId ? { ...fee, status } : fee
        )
      );
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Failed to update transport fee status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: TransportFee['status']) => {
    switch (status) {
      case 'PAID':
        return 'text-green-600';
      case 'PENDING':
        return 'text-yellow-600';
      case 'OVERDUE':
        return 'text-red-600';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Transport Fees</h1>
        <Button variant="outline" onClick={() => router.push('/transport')}>
          Back to Transport
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
              <Label htmlFor="routeId">Route</Label>
              <Select value={selectedRoute} onValueChange={handleRouteChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Route 1 - North Zone</SelectItem>
                  <SelectItem value="2">Route 2 - South Zone</SelectItem>
                  <SelectItem value="3">Route 3 - East Zone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-8 gap-4 font-medium">
              <div>Student Name</div>
              <div>Class</div>
              <div>Route</div>
              <div>Amount</div>
              <div>Frequency</div>
              <div>Due Date</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            {transportFees.map((fee) => (
              <div key={fee.studentId} className="grid grid-cols-8 gap-4 items-center">
                <div>{fee.studentName}</div>
                <div>{fee.class}</div>
                <div>{fee.routeName}</div>
                <div>₹{fee.amount}</div>
                <div>{fee.frequency}</div>
                <div>{new Date(fee.dueDate).toLocaleDateString()}</div>
                <div className={getStatusColor(fee.status)}>
                  {fee.status}
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={fee.status === 'PAID' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(fee.studentId, 'PAID')}
                    disabled={isSubmitting}
                  >
                    Mark as Paid
                  </Button>
                  <Button
                    type="button"
                    variant={fee.status === 'PENDING' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(fee.studentId, 'PENDING')}
                    disabled={isSubmitting}
                  >
                    Mark as Pending
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/transport')}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => router.push('/fees/collections')}
            >
              Collect Fee
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 