'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface TransportAssignment {
  studentId: string;
  studentName: string;
  class: string;
  routeId: string;
  routeName: string;
  pickupPoint: string;
  dropPoint: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function TransportAssignments() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [assignments, setAssignments] = useState<TransportAssignment[]>([
    {
      studentId: '1',
      studentName: 'John Doe',
      class: 'Class 1 - Section A',
      routeId: '1',
      routeName: 'Route 1 - North Zone',
      pickupPoint: 'Main Street',
      dropPoint: 'School Gate',
      status: 'ACTIVE',
    },
    {
      studentId: '2',
      studentName: 'Jane Smith',
      class: 'Class 2 - Section B',
      routeId: '2',
      routeName: 'Route 2 - South Zone',
      pickupPoint: 'Park Avenue',
      dropPoint: 'School Gate',
      status: 'ACTIVE',
    },
    {
      studentId: '3',
      studentName: 'Mike Johnson',
      class: 'Class 3 - Section C',
      routeId: '3',
      routeName: 'Route 3 - East Zone',
      pickupPoint: 'Central Square',
      dropPoint: 'School Gate',
      status: 'INACTIVE',
    },
  ]);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedRoute('');
    // TODO: Fetch assignments for selected class
  };

  const handleRouteChange = (value: string) => {
    setSelectedRoute(value);
    // TODO: Filter assignments by selected route
  };

  const getStatusColor = (status: TransportAssignment['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600';
      case 'INACTIVE':
        return 'text-red-600';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Transport Assignments</h1>
        <Button variant="outline" onClick={() => router.push('/transport')}>
          Back to Transport
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
            <div className="grid grid-cols-7 gap-4 font-medium">
              <div>Student Name</div>
              <div>Class</div>
              <div>Route</div>
              <div>Pickup Point</div>
              <div>Drop Point</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            {assignments.map((assignment) => (
              <div key={assignment.studentId} className="grid grid-cols-7 gap-4 items-center">
                <div>{assignment.studentName}</div>
                <div>{assignment.class}</div>
                <div>{assignment.routeName}</div>
                <div>{assignment.pickupPoint}</div>
                <div>{assignment.dropPoint}</div>
                <div className={getStatusColor(assignment.status)}>
                  {assignment.status}
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/transport/assignments/${assignment.studentId}`)}
                  >
                    Edit
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
              onClick={() => router.push('/transport/assignments/new')}
            >
              New Assignment
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 