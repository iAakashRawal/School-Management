'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadIcon, FilterIcon } from 'lucide-react';

export default function AcademicReportsPage() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2023-2024');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Academic Reports</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate and analyze academic performance reports
          </p>
        </div>
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
          
          <div>
            <label htmlFor="exam" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Examination
            </label>
            <select
              id="exam"
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Exams</option>
              <option value="1">First Term</option>
              <option value="2">Mid Term</option>
              <option value="3">Final Term</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All Subjects</option>
              <option value="1">Mathematics</option>
              <option value="2">Science</option>
              <option value="3">English</option>
              <option value="4">Social Studies</option>
            </select>
          </div>
          
          <Button>
            <FilterIcon className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 dark:bg-gray-800 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Class Performance Report</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Overall performance analysis by class
              </p>
            </div>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Class Performance Chart</span>
          </div>
          
          <Button variant="link" className="w-full justify-center">
            View Detailed Report
          </Button>
        </Card>
        
        <Card className="p-6 dark:bg-gray-800 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Subject Analysis Report</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Performance analysis by subject
              </p>
            </div>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Subject Analysis Chart</span>
          </div>
          
          <Button variant="link" className="w-full justify-center">
            View Detailed Report
          </Button>
        </Card>
        
        <Card className="p-6 dark:bg-gray-800 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Student Progress Report</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Individual student performance tracking
              </p>
            </div>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Student Progress Chart</span>
          </div>
          
          <Button variant="link" className="w-full justify-center">
            View Detailed Report
          </Button>
        </Card>
        
        <Card className="p-6 dark:bg-gray-800 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Grade Distribution Report</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Analysis of grade distribution
              </p>
            </div>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Grade Distribution Chart</span>
          </div>
          
          <Button variant="link" className="w-full justify-center">
            View Detailed Report
          </Button>
        </Card>
        
        <Card className="p-6 dark:bg-gray-800 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Comparative Analysis</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Compare performance across exams
              </p>
            </div>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Comparative Analysis Chart</span>
          </div>
          
          <Button variant="link" className="w-full justify-center">
            View Detailed Report
          </Button>
        </Card>
        
        <Card className="p-6 dark:bg-gray-800 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Top Performers Report</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                List of top-performing students
              </p>
            </div>
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Top Performers List</span>
          </div>
          
          <Button variant="link" className="w-full justify-center">
            View Detailed Report
          </Button>
        </Card>
      </div>
    </div>
  );
} 