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
  BookOpenIcon,
  PencilIcon,
  TrashIcon,
  DownloadIcon 
} from 'lucide-react';
import AddBookModal, { Book } from '@/components/modals/AddBookModal';

// Sample books data
const books = [
  {
    id: 1,
    title: 'Mathematics for Class 10',
    author: 'R.D. Sharma',
    isbn: '9781234567897',
    publisher: 'Pearson Education',
    category: 'Academic',
    subject: 'Mathematics',
    publicationYear: 2022,
    edition: '5th',
    totalCopies: 50,
    availableCopies: 35,
    location: 'Shelf A-10',
    status: 'Available',
    addedOn: '2023-01-15',
  },
  {
    id: 2,
    title: 'Physics: Concepts and Connections',
    author: 'H.C. Verma',
    isbn: '9787654321098',
    publisher: 'Oxford University Press',
    category: 'Academic',
    subject: 'Physics',
    publicationYear: 2021,
    edition: '3rd',
    totalCopies: 40,
    availableCopies: 22,
    location: 'Shelf B-05',
    status: 'Available',
    addedOn: '2023-02-10',
  },
  {
    id: 3,
    title: 'Organic Chemistry',
    author: 'Morrison & Boyd',
    isbn: '9789876543210',
    publisher: 'McGraw Hill',
    category: 'Academic',
    subject: 'Chemistry',
    publicationYear: 2020,
    edition: '7th',
    totalCopies: 30,
    availableCopies: 0,
    location: 'Shelf C-12',
    status: 'Unavailable',
    addedOn: '2023-01-20',
  },
  {
    id: 4,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    publisher: 'Scribner',
    category: 'Fiction',
    subject: 'Literature',
    publicationYear: 2018,
    edition: 'Reprint',
    totalCopies: 25,
    availableCopies: 10,
    location: 'Shelf D-07',
    status: 'Available',
    addedOn: '2023-02-15',
  },
  {
    id: 5,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    publisher: 'HarperCollins',
    category: 'Fiction',
    subject: 'Literature',
    publicationYear: 2019,
    edition: 'Anniversary Edition',
    totalCopies: 30,
    availableCopies: 0,
    location: 'Shelf D-08',
    status: 'Unavailable',
    addedOn: '2023-01-25',
  },
  {
    id: 6,
    title: 'Introduction to Algorithms',
    author: 'Cormen, Leiserson, Rivest & Stein',
    isbn: '9780262033848',
    publisher: 'MIT Press',
    category: 'Academic',
    subject: 'Computer Science',
    publicationYear: 2019,
    edition: '3rd',
    totalCopies: 20,
    availableCopies: 5,
    location: 'Shelf E-03',
    status: 'Low Stock',
    addedOn: '2023-02-05',
  },
  {
    id: 7,
    title: 'Indian History',
    author: 'Bipan Chandra',
    isbn: '9788176486316',
    publisher: 'Orient Blackswan',
    category: 'Academic',
    subject: 'History',
    publicationYear: 2020,
    edition: '4th',
    totalCopies: 35,
    availableCopies: 20,
    location: 'Shelf F-11',
    status: 'Available',
    addedOn: '2023-01-18',
  },
  {
    id: 8,
    title: 'The Biology of Plants',
    author: 'Dr. S.K. Verma',
    isbn: '9788176482315',
    publisher: 'S. Chand Publishing',
    category: 'Academic',
    subject: 'Biology',
    publicationYear: 2021,
    edition: '2nd',
    totalCopies: 30,
    availableCopies: 7,
    location: 'Shelf B-09',
    status: 'Low Stock',
    addedOn: '2023-02-08',
  },
];

// Category options for filtering
const categories = [
  'All Categories',
  'Academic',
  'Fiction',
  'Reference',
  'Magazine',
  'Biography',
];

// Subject options for filtering
const subjects = [
  'All Subjects',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'History',
  'Literature',
];

// Status options for filtering
const statuses = [
  'All Statuses',
  'Available',
  'Low Stock',
  'Unavailable',
];

export default function LibraryBooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [showFilters, setShowFilters] = useState(false);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  // Filter books based on search query, category, subject, and status
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All Categories' || 
      book.category === selectedCategory;
    
    const matchesSubject = 
      selectedSubject === 'All Subjects' || 
      book.subject === selectedSubject;
    
    const matchesStatus = 
      selectedStatus === 'All Statuses' || 
      book.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesSubject && matchesStatus;
  });

  // Calculate book statistics
  const bookStats = {
    totalBooks: books.length,
    totalTitles: new Set(books.map(book => book.title)).size,
    availableBooks: books.filter(book => book.status === 'Available').length,
    unavailableBooks: books.filter(book => book.status === 'Unavailable').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Unavailable':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Handle adding a new book
  const handleAddBook = (bookData: Book) => {
    console.log('New book added:', bookData);
    // Here you would typically make an API call to add the book
    // and then update the local state with the new book
    
    // Close the modal
    setIsAddBookModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Library Books</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage library books and track availability
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/library/issued">
            <Button variant="outline">
              Issued Books
            </Button>
          </Link>
          <Link href="/library/returns">
            <Button variant="outline">
              Returns
            </Button>
          </Link>
          <Button onClick={() => setIsAddBookModalOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <BookIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Books</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{bookStats.totalBooks}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
              <BookOpenIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Titles</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{bookStats.totalTitles}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <BookOpenIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{bookStats.availableBooks}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 mr-4">
              <BookOpenIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unavailable</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{bookStats.unavailableBooks}</p>
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
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'More Filters'}
              </Button>
              
              <Button variant="outline" className="flex items-center">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Books Table */}
      <Card className="bg-white dark:bg-gray-800 shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Title & Author
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ISBN
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subject/Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Copies
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
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
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{book.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{book.author}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {book.edition} Edition, {book.publicationYear}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{book.isbn}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{book.publisher}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{book.subject}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{book.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{book.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{book.availableCopies} / {book.totalCopies}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        disabled={book.availableCopies === 0}
                      >
                        <span className={book.availableCopies === 0 ? 'opacity-50 cursor-not-allowed' : ''}>Issue</span>
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </button>
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

      {/* Add Book Modal */}
      <AddBookModal 
        isOpen={isAddBookModalOpen} 
        onClose={() => setIsAddBookModalOpen(false)} 
        onSubmit={handleAddBook} 
      />
    </div>
  );
} 