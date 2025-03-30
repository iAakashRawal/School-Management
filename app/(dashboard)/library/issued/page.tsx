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
  ClockIcon,
  CalendarIcon,
  UserIcon,
  ArrowLeftRightIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  BookOpenIcon
} from 'lucide-react';

// Sample issued books data
const issuedBooks = [
  {
    id: 1,
    bookTitle: 'Mathematics for Class 10',
    bookISBN: '9781234567897',
    studentName: 'Rahul Sharma',
    studentID: 'STU2023001',
    class: '10th - Section A',
    issuedDate: '2023-08-01',
    dueDate: '2023-08-15',
    returnDate: null,
    status: 'Issued',
    fine: 0,
    remarks: '',
  },
  {
    id: 2,
    bookTitle: 'Physics: Concepts and Connections',
    bookISBN: '9787654321098',
    studentName: 'Priya Patel',
    studentID: 'STU2023045',
    class: '12th - Section B',
    issuedDate: '2023-07-25',
    dueDate: '2023-08-08',
    returnDate: null,
    status: 'Overdue',
    fine: 50,
    remarks: '',
  },
  {
    id: 3,
    bookTitle: 'The Great Gatsby',
    bookISBN: '9780743273565',
    studentName: 'Arjun Singh',
    studentID: 'STU2023112',
    class: '11th - Section A',
    issuedDate: '2023-08-05',
    dueDate: '2023-08-19',
    returnDate: null,
    status: 'Issued',
    fine: 0,
    remarks: '',
  },
  {
    id: 4,
    bookTitle: 'Introduction to Algorithms',
    bookISBN: '9780262033848',
    studentName: 'Ananya Verma',
    studentID: 'STU2023078',
    class: '12th - Section A',
    issuedDate: '2023-07-20',
    dueDate: '2023-08-03',
    returnDate: null,
    status: 'Overdue',
    fine: 100,
    remarks: 'Student informed via email',
  },
  {
    id: 5,
    bookTitle: 'Indian History',
    bookISBN: '9788176486316',
    studentName: 'Ravi Kumar',
    studentID: 'STU2023056',
    class: '9th - Section C',
    issuedDate: '2023-08-02',
    dueDate: '2023-08-16',
    returnDate: null,
    status: 'Issued',
    fine: 0,
    remarks: '',
  },
  {
    id: 6,
    bookTitle: 'The Biology of Plants',
    bookISBN: '9788176482315',
    studentName: 'Sonia Gupta',
    studentID: 'STU2023098',
    class: '10th - Section B',
    issuedDate: '2023-07-28',
    dueDate: '2023-08-11',
    returnDate: null,
    status: 'Issued',
    fine: 0,
    remarks: '',
  },
  {
    id: 7,
    bookTitle: 'Mathematics for Class 10',
    bookISBN: '9781234567897',
    studentName: 'Vikram Desai',
    studentID: 'STU2023023',
    class: '10th - Section C',
    issuedDate: '2023-07-15',
    dueDate: '2023-07-29',
    returnDate: null,
    status: 'Overdue',
    fine: 150,
    remarks: 'Second reminder sent',
  },
  {
    id: 8,
    bookTitle: 'Physics: Concepts and Connections',
    bookISBN: '9787654321098',
    studentName: 'Kavita Reddy',
    studentID: 'STU2023067',
    class: '12th - Section A',
    issuedDate: '2023-08-03',
    dueDate: '2023-08-17',
    returnDate: null,
    status: 'Issued',
    fine: 0,
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
  'Issued',
  'Overdue',
];

export default function IssuedBooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Calculate today's date for determining overdue status
  const today = new Date().toISOString().split('T')[0];

  // Filter issued books based on search query, class, status, and date range
  const filteredBooks = issuedBooks.filter(book => {
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
    
    // Date range filtering for issue date
    let matchesDateRange = true;
    if (startDate && endDate) {
      const bookDate = new Date(book.issuedDate);
      const filterStartDate = new Date(startDate);
      const filterEndDate = new Date(endDate);
      matchesDateRange = bookDate >= filterStartDate && bookDate <= filterEndDate;
    } else if (startDate) {
      const bookDate = new Date(book.issuedDate);
      const filterStartDate = new Date(startDate);
      matchesDateRange = bookDate >= filterStartDate;
    } else if (endDate) {
      const bookDate = new Date(book.issuedDate);
      const filterEndDate = new Date(endDate);
      matchesDateRange = bookDate <= filterEndDate;
    }
    
    return matchesSearch && matchesClass && matchesStatus && matchesDateRange;
  });

  // Calculate issued books statistics
  const issuedStats = {
    totalIssued: issuedBooks.length,
    overdueBooks: issuedBooks.filter(book => book.status === 'Overdue').length,
    currentlyIssued: issuedBooks.filter(book => book.status === 'Issued').length,
    totalFines: issuedBooks.reduce((sum, book) => sum + book.fine, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Issued':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  const getDueDateColor = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    
    // Due date is in the past
    if (date < now) {
      return 'text-red-600 dark:text-red-400';
    }
    
    // Due date is today or tomorrow
    const diffTime = Math.abs(date.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 2) {
      return 'text-yellow-600 dark:text-yellow-400';
    }
    
    return 'text-gray-600 dark:text-gray-400';
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Issued Books</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage currently issued books and track due dates
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/library/books">
            <Button variant="outline">
              All Books
            </Button>
          </Link>
          <Link href="/library/returns">
            <Button variant="outline">
              Returns
            </Button>
          </Link>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Issue New Book
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 mr-4">
              <BookOpenIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Issued</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{issuedStats.totalIssued}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{issuedStats.currentlyIssued}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 mr-4">
              <AlertTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{issuedStats.overdueBooks}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
              <BookIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Fines</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">₹{issuedStats.totalFines}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white dark:bg-gray-800 shadow p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search books or students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Date Filter'}
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Issue Date From
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Issue Date To
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Issued Books Table */}
      <Card className="bg-white dark:bg-gray-800 shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Book Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Issue Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fine
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{book.bookTitle}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">ISBN: {book.bookISBN}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{book.studentName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">ID: {book.studentID}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{book.class}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {formatDate(book.issuedDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm ${getDueDateColor(book.dueDate)}`}>
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {formatDate(book.dueDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {book.fine > 0 ? `₹${book.fine}` : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/library/returns?id=${book.id}`}>
                        <Button size="sm" variant="outline" className="flex items-center">
                          <ArrowLeftRightIcon className="h-4 w-4 mr-2" />
                          Return
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredBooks.length}</span> of{' '}
                <span className="font-medium">{filteredBooks.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button variant="outline" size="sm" className="rounded-l-md" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="border-l-0 rounded-r-md" disabled>
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 