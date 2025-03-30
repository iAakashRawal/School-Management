'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  AreaChart,
  DonutChart,
} from '@tremor/react';
import {
  UsersIcon,
  BookOpenIcon,
  CalendarIcon,
  TrendingUpIcon,
  PieChartIcon,
  BarChartIcon,
  LayoutGridIcon,
  ArrowUpIcon,
} from 'lucide-react';

// Dashboard data
const attendanceData = [
  { month: 'Apr', attendance: 92 },
  { month: 'May', attendance: 88 },
  { month: 'Jun', attendance: 85 },
  { month: 'Jul', attendance: 90 },
  { month: 'Aug', attendance: 94 },
  { month: 'Sep', attendance: 97 },
  { month: 'Oct', attendance: 93 },
  { month: 'Nov', attendance: 89 },
  { month: 'Dec', attendance: 87 },
  { month: 'Jan', attendance: 91 },
  { month: 'Feb', attendance: 95 },
  { month: 'Mar', attendance: 92 },
];

const performanceData = [
  { subject: 'Mathematics', avg: 78 },
  { subject: 'Science', avg: 82 },
  { subject: 'English', avg: 76 },
  { subject: 'Social Studies', avg: 84 },
  { subject: 'Languages', avg: 79 },
  { subject: 'Physical Ed', avg: 90 },
  { subject: 'Art', avg: 88 },
];

const revenueData = [
  { month: 'Apr', revenue: 45000, expenses: 32000 },
  { month: 'May', revenue: 52000, expenses: 35000 },
  { month: 'Jun', revenue: 49000, expenses: 34000 },
  { month: 'Jul', revenue: 47000, expenses: 33000 },
  { month: 'Aug', revenue: 53000, expenses: 36000 },
  { month: 'Sep', revenue: 56000, expenses: 38000 },
  { month: 'Oct', revenue: 51000, expenses: 37000 },
  { month: 'Nov', revenue: 48000, expenses: 35000 },
  { month: 'Dec', revenue: 54000, expenses: 39000 },
  { month: 'Jan', revenue: 58000, expenses: 41000 },
  { month: 'Feb', revenue: 59000, expenses: 40000 },
  { month: 'Mar', revenue: 62000, expenses: 43000 },
];

const enrollmentData = [
  { name: 'Primary', value: 320 },
  { name: 'Middle', value: 280 },
  { name: 'Secondary', value: 240 },
  { name: 'Higher Secondary', value: 160 },
];

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('yearly');
  
  // Calculate summary stats
  const totalStudents = enrollmentData.reduce((acc, curr) => acc + curr.value, 0);
  const avgAttendance = Math.round(attendanceData.reduce((acc, curr) => acc + curr.attendance, 0) / attendanceData.length);
  const avgPerformance = Math.round(performanceData.reduce((acc, curr) => acc + curr.avg, 0) / performanceData.length);
  const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalExpenses = revenueData.reduce((acc, curr) => acc + curr.expenses, 0);
  const netIncome = totalRevenue - totalExpenses;
  
  // Format enrollment data for DonutChart
  const donutData = enrollmentData.map(item => ({
    name: item.name,
    students: item.value
  }));
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">School Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Overview of school performance and metrics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={timeframe === 'monthly' ? 'default' : 'outline'}
            onClick={() => setTimeframe('monthly')}
            className={timeframe === 'monthly' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
          >
            Monthly
          </Button>
          <Button
            variant={timeframe === 'quarterly' ? 'default' : 'outline'}
            onClick={() => setTimeframe('quarterly')}
            className={timeframe === 'quarterly' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
          >
            Quarterly
          </Button>
          <Button
            variant={timeframe === 'yearly' ? 'default' : 'outline'}
            onClick={() => setTimeframe('yearly')}
            className={timeframe === 'yearly' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
          >
            Yearly
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-100 shadow-md rounded-lg border-none overflow-hidden">
          <div className="flex items-center p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <div className="p-3 bg-white/20 rounded-full mr-4">
              <UsersIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-90">Total Students</p>
              <p className="text-2xl font-bold">{totalStudents}</p>
            </div>
          </div>
          <div className="p-4 bg-slate-100">
            <div className="flex items-center text-blue-700">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">4.5% increase</span>
              <span className="text-sm text-gray-500 ml-auto">Last 30 days</span>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-100 shadow-md rounded-lg border-none overflow-hidden">
          <div className="flex items-center p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
            <div className="p-3 bg-white/20 rounded-full mr-4">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-90">Avg. Attendance</p>
              <p className="text-2xl font-bold">{avgAttendance}%</p>
            </div>
          </div>
          <div className="p-4 bg-slate-100">
            <div className="flex items-center text-green-700">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">2.1% increase</span>
              <span className="text-sm text-gray-500 ml-auto">Last 30 days</span>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-100 shadow-md rounded-lg border-none overflow-hidden">
          <div className="flex items-center p-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
            <div className="p-3 bg-white/20 rounded-full mr-4">
              <BookOpenIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-90">Avg. Performance</p>
              <p className="text-2xl font-bold">{avgPerformance}%</p>
            </div>
          </div>
          <div className="p-4 bg-slate-100">
            <div className="flex items-center text-amber-700">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">1.8% increase</span>
              <span className="text-sm text-gray-500 ml-auto">Last 30 days</span>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-100 shadow-md rounded-lg border-none overflow-hidden">
          <div className="flex items-center p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
            <div className="p-3 bg-white/20 rounded-full mr-4">
              <TrendingUpIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-90">Net Income</p>
              <p className="text-2xl font-bold">₹{(netIncome / 1000).toFixed(0)}K</p>
            </div>
          </div>
          <div className="p-4 bg-slate-100">
            <div className="flex items-center text-purple-700">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">3.2% increase</span>
              <span className="text-sm text-gray-500 ml-auto">Last 30 days</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <Card className="bg-slate-100 shadow-md p-6 border-none">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChartIcon className="h-5 w-5 mr-2 text-indigo-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-700">
                Attendance Trend
              </span>
            </h2>
          </div>
          <BarChart
            className="h-80 mt-4"
            data={attendanceData}
            index="month"
            categories={["attendance"]}
            colors={["indigo"]}
            valueFormatter={(number) => `${number}%`}
            yAxisWidth={40}
          />
        </Card>

        {/* Revenue vs Expenses */}
        <Card className="bg-slate-100 shadow-md p-6 border-none">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUpIcon className="h-5 w-5 mr-2 text-emerald-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-700">
                Revenue vs Expenses
              </span>
            </h2>
          </div>
          <AreaChart
            className="h-80 mt-4"
            data={revenueData}
            index="month"
            categories={["revenue", "expenses"]}
            colors={["emerald", "rose"]}
            valueFormatter={(number) => `₹${(number/1000).toFixed(0)}K`}
            yAxisWidth={60}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <Card className="bg-slate-100 shadow-md p-6 border-none">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <LayoutGridIcon className="h-5 w-5 mr-2 text-amber-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-700">
                Subject Performance
              </span>
            </h2>
          </div>
          <BarChart
            className="h-80 mt-4"
            data={performanceData}
            index="subject"
            categories={["avg"]}
            colors={["amber"]}
            valueFormatter={(number) => `${number}%`}
            layout="vertical"
            yAxisWidth={120}
          />
        </Card>

        {/* Enrollment Distribution */}
        <Card className="bg-slate-100 shadow-md p-6 border-none">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2 text-blue-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                Enrollment Distribution
              </span>
            </h2>
          </div>
          <DonutChart
            className="h-80 mt-4"
            data={donutData}
            category="students"
            index="name"
            colors={["blue", "cyan", "amber", "rose"]}
            valueFormatter={(number) => `${number} students`}
            label="Total Students"
          />
        </Card>
      </div>
    </div>
  );
} 