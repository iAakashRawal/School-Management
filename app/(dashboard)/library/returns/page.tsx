'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  SearchIcon, 
  FilterIcon, 
  BookIcon,
  PlusIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  DollarSignIcon,
  DownloadIcon,
  FilterXIcon
} from 'lucide-react';

// Sample returned books data
const returnedBooks = [
  {
    id: 1,
    bookTitle: 'Mathematics for Class 10',
    bookISBN: '9781234567897',
    studentName: 'Amit Kumar',
    studentID: 'STU2023015',
    class: '10th - Section A',
    issuedDate: '2023-07-10',
    dueDate: '2023-07-24',
    returnDate: '2023-07-22',
    status: 'Returned',
    condition: 'Good',
    fine: 0,
    finePaid: true,
    remarks: 'Returned in good condition',
  },
  {
    id: 2,
    bookTitle: 'Introduction to Algorithms',
    bookISBN: '9780262033848',
    studentName: 'Neha Sharma',
    studentID: 'STU2023032',
    class: '12th - Section B',
    issuedDate: '2023-07-05',
    dueDate: '2023-07-19',
    returnDate: '2023-07-25',
    status: 'Returned Late',
    condition: 'Good',
    fine: 60,
    finePaid: true,
    remarks: 'Delayed return, fine paid',
  },
  {
    id: 3,
    bookTitle: 'The Great Gatsby',
    bookISBN: '9780743273565',
    studentName: 'Raj Singh',
    studentID: 'STU2023048',
    class: '11th - Section A',
    issuedDate: '2023-07-12',
    dueDate: '2023-07-26',
    returnDate: '2023-07-24',
    status: 'Returned',
    condition: 'Good',
    fine: 0,
    finePaid: true,
    remarks: '',
  },
  {
    id: 4,
    bookTitle: 'Physics: Concepts and Connections',
    bookISBN: '9787654321098',
    studentName: 'Kavita Patel',
    studentID: 'STU2023067',
    class: '12th - Section A',
    issuedDate: '2023-06-28',
    dueDate: '2023-07-12',
    returnDate: '2023-07-20',
    status: 'Returned Late',
    condition: 'Damaged',
    fine: 180,
    finePaid: false,
    remarks: 'Book cover damaged, additional charges applied',
  },
  {
    id: 5,
    bookTitle: 'Indian History',
    bookISBN: '9788176486316',
    studentName: 'Vikram Desai',
    studentID: 'STU2023023',
    class: '10th - Section C',
    issuedDate: '2023-07-15',
    dueDate: '2023-07-29',
    returnDate: '2023-07-27',
    status: 'Returned',
    condition: 'Good',
    fine: 0,
    finePaid: true,
    remarks: '',
  },
  {
    id: 6,
    bookTitle: 'The Biology of Plants',
    bookISBN: '9788176482315',
    studentName: 'Priya Gupta',
    studentID: 'STU2023098',
    class: '10th - Section B',
    issuedDate: '2023-06-30',
    dueDate: '2023-07-14',
    returnDate: '2023-07-18',
    status: 'Returned Late',
    condition: 'Good',
    fine: 40,
    finePaid: true,
    remarks: 'Fine paid at return time',
  },
  {
    id: 7,
    bookTitle: 'Organic Chemistry',
    bookISBN: '9789876543210',
    studentName: 'Rahul Sharma',
    studentID: 'STU2023001',
    class: '10th - Section A',
    issuedDate: '2023-07-01',
    dueDate: '2023-07-15',
    returnDate: '2023-07-16',
    status: 'Returned Late',
    condition: 'Slight Damage',
    fine: 50,
    finePaid: true,
    remarks: 'Few pages folded, minor fine applied',
  },
  {
    id: 8,
    bookTitle: 'To Kill a Mockingbird',
    bookISBN: '9780061120084',
    studentName: 'Ananya Verma',
    studentID: 'STU2023078',
    class: '12th - Section A',
    issuedDate: '2023-07-18',
    dueDate: '2023-08-01',
    returnDate: '2023-07-31',
    status: 'Returned',
    condition: 'Good',
    fine: 0,
    finePaid: true,
    remarks: '',
  },
];

// Class options for filtering
const classes = [
  'All Classes',
  '9th - Section A',
  '9th - Section B',
  '9th - Section C',
  '10th - Section A',
  '10th - Section B',
  '10th - Section C',
  '11th - Section A',
  '11th - Section B',
  '12th - Section A',
  '12th - Section B',
];

// Status options for filtering
const statuses = [
  'All Statuses',
  'Returned',
  'Returned Late',
];

// Condition options for filtering
const conditions = [
  'All Conditions',
  'Good',
  'Slight Damage',
  'Damaged',
];

export default function ReturnedBooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedCondition, setSelectedCondition] = useState('All Conditions');
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter returned books based on search query and filters
  const filteredBooks = returnedBooks.filter(book => {
    const matchesSearch = 
      book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.studentID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.bookISBN.includes(searchQuery.toLowerCase());
    
    const matchesClass = 
      selectedClass === 'All Classes' || 
      book.class === selectedClass;
    
    const matchesStatus = 
      selectedStatus === 'All Statuses' || 
      book.status === selectedStatus;

    const matchesCondition = 
      selectedCondition === 'All Conditions' || 
      book.condition === selectedCondition;
    
    // Date range filtering for return date
    let matchesDateRange = true;
    if (startDate && endDate) {
      const bookDate = new Date(book.returnDate);
      const filterStartDate = new Date(startDate);
      const filterEndDate = new Date(endDate);
      matchesDateRange = bookDate >= filterStartDate && bookDate <= filterEndDate;
    } else if (startDate) {
      const bookDate = new Date(book.returnDate);
      const filterStartDate = new Date(startDate);
      matchesDateRange = bookDate >= filterStartDate;
    } else if (endDate) {
      const bookDate = new Date(book.returnDate);
      const filterEndDate = new Date(endDate);
      matchesDateRange = bookDate <= filterEndDate;
    }
    
    return matchesSearch && matchesClass && matchesStatus && matchesCondition && matchesDateRange;
  });

  // Calculate returns statistics
  const returnStats = {
    totalReturned: returnedBooks.length,
    returnedOnTime: returnedBooks.filter(book => book.status === 'Returned').length,
    returnedLate: returnedBooks.filter(book => book.status === 'Returned Late').length,
    totalFines: returnedBooks.reduce((sum, book) => sum + book.fine, 0),
    pendingFines: returnedBooks.filter(book => !book.finePaid && book.fine > 0).length,
    damagedBooks: returnedBooks.filter(book => book.condition !== 'Good').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Returned':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Returned Late':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Good':
        return 'text-green-600 dark:text-green-400';
      case 'Slight Damage':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Damaged':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Returned Books</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage book returns and related fines
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/library/books">
            <Button variant="outline">
              <BookIcon className="w-4 h-4 mr-2" />
              Books Catalog
            </Button>
          </Link>
          <Link href="/library/issued">
            <Button variant="outline">
              <BookIcon className="w-4 h-4 mr-2" />
              Issued Books
            </Button>
          </Link>
          <Button>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900">
              <BookIcon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Returns</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{returnStats.totalReturned}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <p className="text-green-600 dark:text-green-400">On Time: {returnStats.returnedOnTime}</p>
            </div>
            <div>
              <p className="text-yellow-600 dark:text-yellow-400">Late: {returnStats.returnedLate}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-full dark:bg-green-900">
              <DollarSignIcon className="w-5 h-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Fines</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">₹{returnStats.totalFines}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <p className="text-red-600 dark:text-red-400">Pending: {returnStats.pendingFines}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-red-100 rounded-full dark:bg-red-900">
              <AlertTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Damaged Books</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{returnStats.damagedBooks}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                {((returnStats.damagedBooks / returnStats.totalReturned) * 100).toFixed(1)}% of returns
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Search by book title, student name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              {showFilters ? <FilterXIcon className="w-4 h-4 mr-2" /> : <FilterIcon className="w-4 h-4 mr-2" />}
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedClass('All Classes');
                setSelectedStatus('All Statuses');
                setSelectedCondition('All Conditions');
                setStartDate('');
                setEndDate('');
              }}
              className="flex items-center"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label htmlFor="classFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Class
              </label>
              <select
                id="classFilter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classes.map((classOption) => (
                  <option key={classOption} value={classOption}>
                    {classOption}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                id="statusFilter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="conditionFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Condition
              </label>
              <select
                id="conditionFilter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
              >
                {conditions.map((conditionOption) => (
                  <option key={conditionOption} value={conditionOption}>
                    {conditionOption}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Return Date From
              </label>
              <input
                type="date"
                id="startDate"
                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Return Date To
              </label>
              <input
                type="date"
                id="endDate"
                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Returned Books Table */}
      <Card className="shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Book Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Issue Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Return Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Condition
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Fine
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                          <BookIcon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {book.bookTitle}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ISBN: {book.bookISBN}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {book.studentName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {book.studentID}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {book.class}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{formatDate(book.issuedDate)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Due: {formatDate(book.dueDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{formatDate(book.returnDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(book.status)}`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getConditionColor(book.condition)}`}>
                        {book.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">₹{book.fine}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {book.finePaid ? (
                          <span className="text-green-600 dark:text-green-400">Paid</span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400">Pending</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {book.remarks || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No returned books found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{filteredBooks.length}</span> of{' '}
            <span className="font-medium">{returnedBooks.length}</span> results
          </div>
          <div className="flex-1 flex justify-end">
            <div className="flex gap-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 