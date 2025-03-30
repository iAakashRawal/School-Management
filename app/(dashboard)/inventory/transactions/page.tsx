'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  SearchIcon, 
  FilterIcon, 
  ArrowUpCircleIcon, 
  ArrowDownCircleIcon,
  UserIcon,
  ClockIcon,
  PackageIcon,
  DownloadIcon,
  PlusIcon
} from 'lucide-react';

// Sample transactions data
const transactions = [
  {
    id: 'TRX001',
    date: '2023-08-15',
    time: '09:30 AM',
    type: 'Stock In',
    itemName: 'Classroom Desks',
    category: 'Furniture',
    quantity: 20,
    previousStock: 210,
    newStock: 230,
    source: 'Vendor: Education Furniture Ltd',
    reference: 'PO-2023-072',
    notes: 'Regular procurement as per annual supply contract',
    handledBy: 'Admin: John Smith',
  },
  {
    id: 'TRX002',
    date: '2023-08-12',
    time: '02:15 PM',
    type: 'Stock Out',
    itemName: 'Whiteboard Markers',
    category: 'Stationery',
    quantity: 50,
    previousStock: 370,
    newStock: 320,
    source: 'Department: Mathematics',
    reference: 'REQ-2023-112',
    notes: 'Issued for new term requirements',
    handledBy: 'Staff: Emily Brown',
  },
  {
    id: 'TRX003',
    date: '2023-08-10',
    time: '11:20 AM',
    type: 'Stock In',
    itemName: 'Library Books - Science',
    category: 'Books',
    quantity: 35,
    previousStock: 255,
    newStock: 290,
    source: 'Vendor: Knowledge Books Inc.',
    reference: 'PO-2023-075',
    notes: 'New editions for science curriculum',
    handledBy: 'Admin: Sarah Johnson',
  },
  {
    id: 'TRX004',
    date: '2023-08-05',
    time: '10:00 AM',
    type: 'Stock Out',
    itemName: 'Laptops',
    category: 'Electronics',
    quantity: 2,
    previousStock: 40,
    newStock: 38,
    source: 'Department: Computer Science',
    reference: 'REQ-2023-118',
    notes: 'For new teachers',
    handledBy: 'Staff: Michael Lee',
  },
  {
    id: 'TRX005',
    date: '2023-07-30',
    time: '03:45 PM',
    type: 'Stock In',
    itemName: 'Sports Equipment - Football',
    category: 'Sports',
    quantity: 5,
    previousStock: 17,
    newStock: 22,
    source: 'Vendor: Sports Gear Co.',
    reference: 'PO-2023-070',
    notes: 'Replacement for worn out equipment',
    handledBy: 'Admin: John Smith',
  },
  {
    id: 'TRX006',
    date: '2023-07-25',
    time: '01:30 PM',
    type: 'Stock Out',
    itemName: 'Science Lab Microscopes',
    category: 'Lab Equipment',
    quantity: 2,
    previousStock: 30,
    newStock: 28,
    source: 'Department: Biology',
    reference: 'REQ-2023-105',
    notes: 'For new lab setup',
    handledBy: 'Staff: Robert Wilson',
  },
  {
    id: 'TRX007',
    date: '2023-07-20',
    time: '11:00 AM',
    type: 'Stock In',
    itemName: 'Projectors',
    category: 'Electronics',
    quantity: 2,
    previousStock: 10,
    newStock: 12,
    source: 'Vendor: Tech Solutions Inc.',
    reference: 'PO-2023-065',
    notes: 'New models with better resolution',
    handledBy: 'Admin: Sarah Johnson',
  },
  {
    id: 'TRX008',
    date: '2023-07-15',
    time: '09:15 AM',
    type: 'Stock Out',
    itemName: 'Classroom Chairs',
    category: 'Furniture',
    quantity: 5,
    previousStock: 250,
    newStock: 245,
    source: 'Department: Grade 5 Section B',
    reference: 'REQ-2023-095',
    notes: 'Replacement for damaged chairs',
    handledBy: 'Staff: Emily Brown',
  },
];

// Transaction type options for filtering
const transactionTypes = [
  'All Types',
  'Stock In',
  'Stock Out'
];

// Category options for filtering
const categories = [
  'All Categories',
  'Furniture',
  'Stationery',
  'Lab Equipment',
  'Books',
  'Electronics',
  'Sports',
];

export default function InventoryTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter transactions based on search query, type, category, and date range
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.itemName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = 
      selectedType === 'All Types' || 
      transaction.type === selectedType;
    
    const matchesCategory = 
      selectedCategory === 'All Categories' || 
      transaction.category === selectedCategory;
    
    // Date range filtering
    let matchesDateRange = true;
    if (startDate && endDate) {
      const transactionDate = new Date(transaction.date);
      const filterStartDate = new Date(startDate);
      const filterEndDate = new Date(endDate);
      matchesDateRange = transactionDate >= filterStartDate && transactionDate <= filterEndDate;
    } else if (startDate) {
      const transactionDate = new Date(transaction.date);
      const filterStartDate = new Date(startDate);
      matchesDateRange = transactionDate >= filterStartDate;
    } else if (endDate) {
      const transactionDate = new Date(transaction.date);
      const filterEndDate = new Date(endDate);
      matchesDateRange = transactionDate <= filterEndDate;
    }
    
    return matchesSearch && matchesType && matchesCategory && matchesDateRange;
  });

  // Calculate transactions summary
  const transactionsSummary = {
    totalTransactions: transactions.length,
    stockInTransactions: transactions.filter(t => t.type === 'Stock In').length,
    stockOutTransactions: transactions.filter(t => t.type === 'Stock Out').length,
    uniqueItems: new Set(transactions.map(t => t.itemName)).size,
  };
  
  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'Stock In':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Stock Out':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'Stock In':
        return <ArrowUpCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'Stock Out':
        return <ArrowDownCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Inventory Transactions</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track and manage inventory movements and history
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/inventory/items">
            <Button variant="outline">
              View Items
            </Button>
          </Link>
          <Link href="/inventory/stock">
            <Button variant="outline">
              View Stock
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <PackageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{transactionsSummary.totalTransactions}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <ArrowUpCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock In</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{transactionsSummary.stockInTransactions}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <ArrowDownCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock Out</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{transactionsSummary.stockOutTransactions}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
              <PackageIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Items</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{transactionsSummary.uniqueItems}</p>
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
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {transactionTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
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
              
              <Button className="flex items-center">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
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
                  End Date
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

      {/* Actions Bar */}
      <div className="flex justify-end">
        <Button variant="outline" className="flex items-center">
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export Transactions
        </Button>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="bg-white dark:bg-gray-800 shadow">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    {getTransactionTypeIcon(transaction.type)}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-2">{transaction.itemName}</h3>
                    <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      <span>{transaction.date} at {transaction.time}</span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <UserIcon className="h-4 w-4 mr-2" />
                      <span>{transaction.handledBy}</span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Reference:</span> {transaction.reference}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Source:</span> {transaction.source}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-start md:items-end space-y-2">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {transaction.type === 'Stock In' ? '+' : '-'}{transaction.quantity}
                    </span>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">units</span>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span>Previous: {transaction.previousStock}</span>
                    <span className="mx-2">→</span>
                    <span>New: {transaction.newStock}</span>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
              
              {transaction.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Notes:</span> {transaction.notes}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {/* Pagination */}
      {filteredTransactions.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="outline" disabled>
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTransactions.length}</span> of{' '}
                <span className="font-medium">{filteredTransactions.length}</span> transactions
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
      )}
      
      {/* No results */}
      {filteredTransactions.length === 0 && (
        <Card className="bg-white dark:bg-gray-800 shadow p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No transactions found matching your filters.</p>
        </Card>
      )}
    </div>
  );
} 