'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadIcon, FilterIcon, CheckIcon, XIcon, AlertTriangleIcon } from 'lucide-react';

export default function AttendanceReportsPage() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2023-2024');
  
  const attendanceStats = {
    averageAttendance: '87%',
    totalStudents: 1245,
    presentToday: 1132,
    absentToday: 113,
    lateToday: 23,
    perfectAttendance: 765,
    criticalAttendance: 42,
  };
  
  const monthlyData = [
    { month: 'Jan', rate: 88 },
    { month: 'Feb', rate: 85 },
    { month: 'Mar', rate: 90 },
    { month: 'Apr', rate: 86 },
    { month: 'May', rate: 84 },
    { month: 'Jun', rate: 83 },
    { month: 'Jul', rate: 87 },
    { month: 'Aug', rate: 89 },
    { month: 'Sep', rate: 92 },
    { month: 'Oct', rate: 91 },
    { month: 'Nov', rate: 87 },
    { month: 'Dec', rate: 85 },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Attendance Reports</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor and analyze student attendance patterns
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Attendance</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceStats.averageAttendance}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: attendanceStats.averageAttendance }}></div>
          </div>
        </Card>
        
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex items-center mb-1">
            <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Present Today</h3>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceStats.presentToday}</p>
            <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">students</p>
          </div>
        </Card>
        
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex items-center mb-1">
            <XIcon className="h-4 w-4 text-red-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Absent Today</h3>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceStats.absentToday}</p>
            <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">students</p>
          </div>
        </Card>
        
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex items-center mb-1">
            <AlertTriangleIcon className="h-4 w-4 text-yellow-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Critical Attendance</h3>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceStats.criticalAttendance}</p>
            <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">students &lt;75%</p>
          </div>
        </Card>
      </div>
      
      <Card className="p-6 dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Academic Year
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="2022-2023">2022-2023</option>
              <option value="2023-2024">2023-2024</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Month
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Class
            </label>
            <select
              id="class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Classes</option>
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3">Class 3</option>
              <option value="4">Class 4</option>
              <option value="5">Class 5</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="section" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Section
            </label>
            <select
              id="section"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
          
          <Button>
            <FilterIcon className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 dark:bg-gray-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Monthly Attendance Rate</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Attendance percentage by month
                </p>
              </div>
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            
            <div className="mt-4 h-80">
              <div className="flex h-64 items-end space-x-2">
                {monthlyData.map((item) => (
                  <div key={item.month} className="relative flex-1">
                    <div 
                      className="absolute bottom-0 w-full bg-indigo-500 rounded-t-md" 
                      style={{ height: `${item.rate}%` }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {monthlyData.map((item) => (
                  <div key={item.month} className="text-xs text-gray-500 dark:text-gray-400">
                    {item.month}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Attendance by Class</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Class-wise comparison
              </p>
            </div>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="space-y-4 mt-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Class 1</span>
                <span className="font-medium text-gray-900 dark:text-white">92%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Class 2</span>
                <span className="font-medium text-gray-900 dark:text-white">88%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Class 3</span>
                <span className="font-medium text-gray-900 dark:text-white">85%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Class 4</span>
                <span className="font-medium text-gray-900 dark:text-white">90%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Class 5</span>
                <span className="font-medium text-gray-900 dark:text-white">83%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Weekly Attendance Pattern</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Day-wise attendance patterns
              </p>
            </div>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="space-y-4 mt-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Monday</span>
                <span className="font-medium text-gray-900 dark:text-white">89%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Tuesday</span>
                <span className="font-medium text-gray-900 dark:text-white">91%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '91%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Wednesday</span>
                <span className="font-medium text-gray-900 dark:text-white">92%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Thursday</span>
                <span className="font-medium text-gray-900 dark:text-white">88%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Friday</span>
                <span className="font-medium text-gray-900 dark:text-white">84%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Attendance Reports</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download detailed reports
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Monthly Attendance Report</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Complete monthly attendance details</p>
              </div>
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Class-wise Attendance Report</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Attendance statistics by class</p>
              </div>
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Critical Attendance Report</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Students with low attendance</p>
              </div>
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Perfect Attendance Report</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Students with 100% attendance</p>
              </div>
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 