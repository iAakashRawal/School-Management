'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllClasses } from '@/lib/hooks/useClasses';
import { useAttendance, useBulkAttendance } from '@/lib/hooks/useAttendance';
import { Check, X, Clock, AlertCircle, Save } from 'lucide-react';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export default function DailyAttendancePage() {
  const { t } = useTranslation('common');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<Array<{
    studentId: string;
    name: string;
    rollNo: string;
    status: AttendanceStatus;
  }>>([]);
  const [statusCounts, setStatusCounts] = useState({
    PRESENT: 0,
    ABSENT: 0,
    LATE: 0,
    EXCUSED: 0,
  });

  // Fetch classes for dropdown
  const { data: classesData } = useAllClasses();
  
  // Fetch attendance records
  const { data: attendanceRecords, isLoading, refetch } = useAttendance({
    classId: selectedClass,
    date: selectedDate,
    limit: 100,
  });
  
  // Mutation for bulk attendance update
  const bulkAttendance = useBulkAttendance();

  // Effect to transform attendance data when records or selected class changes
  useEffect(() => {
    if (selectedClass && attendanceRecords) {
      // Get student list from attendance records
      const students = attendanceRecords.data.attendanceRecords.map(record => ({
        studentId: record.student.id,
        name: record.student.user.name,
        rollNo: record.student.rollNo,
        status: record.status,
      }));
      
      setAttendanceData(students);
      
      // Update status counts
      updateStatusCounts(students);
    }
  }, [attendanceRecords, selectedClass]);

  // Update status counts
  const updateStatusCounts = (data: typeof attendanceData) => {
    const counts = {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      EXCUSED: 0,
    };
    
    data.forEach(student => {
      counts[student.status]++;
    });
    
    setStatusCounts(counts);
  };

  // Handle status change for a student
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    const updatedData = attendanceData.map(student => {
      if (student.studentId === studentId) {
        return { ...student, status };
      }
      return student;
    });
    
    setAttendanceData(updatedData);
    updateStatusCounts(updatedData);
  };

  // Handle save of all attendance records
  const handleSave = async () => {
    if (!selectedClass || !selectedDate || attendanceData.length === 0) {
      return;
    }
    
    try {
      await bulkAttendance.mutateAsync({
        date: selectedDate,
        records: attendanceData.map(student => ({
          studentId: student.studentId,
          status: student.status,
        })),
      });
      
      alert(t('attendance.save_success'));
      refetch();
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert(t('attendance.save_error'));
    }
  };

  // Helper for status button styling
  const getStatusButtonStyle = (
    currentStatus: AttendanceStatus,
    buttonStatus: AttendanceStatus
  ) => {
    if (currentStatus === buttonStatus) {
      return 'bg-primary text-primary-foreground hover:bg-primary/90';
    }
    return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('attendance.daily_attendance')}</h1>
      
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">{t('attendance.date')}</Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="class">{t('attendance.class')}</Label>
          <Select 
            value={selectedClass} 
            onValueChange={setSelectedClass}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('attendance.select_class')} />
            </SelectTrigger>
            <SelectContent>
              {classesData?.data.map((classItem) => (
                <SelectItem key={classItem.id} value={classItem.id}>
                  {classItem.name} - {classItem.section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Status summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-green-500 flex items-center">
              <Check className="mr-2 h-4 w-4" />
              {t('attendance.present')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statusCounts.PRESENT}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-red-500 flex items-center">
              <X className="mr-2 h-4 w-4" />
              {t('attendance.absent')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statusCounts.ABSENT}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-yellow-500 flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {t('attendance.late')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statusCounts.LATE}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-500 flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              {t('attendance.excused')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statusCounts.EXCUSED}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Attendance Table */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : attendanceData.length > 0 ? (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('attendance.roll_no')}</TableHead>
                  <TableHead>{t('attendance.student_name')}</TableHead>
                  <TableHead>{t('attendance.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell>{student.rollNo}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className={getStatusButtonStyle(student.status, 'PRESENT')}
                          onClick={() => handleStatusChange(student.studentId, 'PRESENT')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {t('attendance.present')}
                        </Button>
                        <Button
                          size="sm"
                          className={getStatusButtonStyle(student.status, 'ABSENT')}
                          onClick={() => handleStatusChange(student.studentId, 'ABSENT')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          {t('attendance.absent')}
                        </Button>
                        <Button
                          size="sm"
                          className={getStatusButtonStyle(student.status, 'LATE')}
                          onClick={() => handleStatusChange(student.studentId, 'LATE')}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          {t('attendance.late')}
                        </Button>
                        <Button
                          size="sm"
                          className={getStatusButtonStyle(student.status, 'EXCUSED')}
                          onClick={() => handleStatusChange(student.studentId, 'EXCUSED')}
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {t('attendance.excused')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={bulkAttendance.isPending}
              className="flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              {bulkAttendance.isPending ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </div>
      ) : selectedClass ? (
        <div className="text-center py-8 text-muted-foreground">
          {t('attendance.no_students')}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {t('attendance.select_class_prompt')}
        </div>
      )}
    </div>
  );
} 