'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadIcon, FilterIcon, TrendingUpIcon } from 'lucide-react';

export default function FinancialReportsPage() {
  const [selectedYear, setSelectedYear] = useState('2023-2024');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const financialOverview = {
    totalRevenue: '₹12,548,750',
    totalExpenses: '₹9,873,420',
    netProfit: '₹2,675,330',
    collectionRate: '87%',
    pendingFees: '₹1,845,200',
    revenueGrowth: '+8.5%',
    expenseGrowth: '+5.2%',
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Financial Reports</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate and analyze financial performance reports
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <TrendingUpIcon className="h-3 w-3 mr-1" />
              {financialOverview.revenueGrowth}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{financialOverview.totalRevenue}</p>
        </Card>
        
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              <TrendingUpIcon className="h-3 w-3 mr-1" />
              {financialOverview.expenseGrowth}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{financialOverview.totalExpenses}</p>
        </Card>
        
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Profit</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{financialOverview.netProfit}</p>
        </Card>
        
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Collection Rate</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{financialOverview.collectionRate}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending: {financialOverview.pendingFees}</p>
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
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Categories</option>
              <option value="fees">Tuition Fees</option>
              <option value="transportation">Transportation</option>
              <option value="hostel">Hostel</option>
              <option value="examinations">Examination Fees</option>
              <option value="salary">Salary</option>
              <option value="maintenance">Maintenance</option>
              <option value="utilities">Utilities</option>
            </select>
          </div>
          
          <Button>
            <FilterIcon className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Revenue vs Expenses</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monthly comparison
              </p>
            </div>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Revenue vs Expenses Chart</span>
          </div>
        </Card>
        
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Income Distribution</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                By source
              </p>
            </div>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Income Distribution Chart</span>
          </div>
        </Card>
        
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Expense Distribution</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                By category
              </p>
            </div>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Expense Distribution Chart</span>
          </div>
        </Card>
        
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Fee Collection Trend</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monthly collection rates
              </p>
            </div>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Fee Collection Trend Chart</span>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6 dark:bg-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Financial Reports</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download financial statements and reports
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Income Statement</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive revenue and expense report</p>
              </div>
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Balance Sheet</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Financial position statement</p>
              </div>
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Cash Flow Statement</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cash inflow and outflow analysis</p>
              </div>
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Fee Collection Report</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Detailed fee collection status by class</p>
              </div>
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Expense Categories Report</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Detailed breakdown of expenses by category</p>
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