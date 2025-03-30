'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  SearchIcon, 
  PlusIcon,
  DownloadIcon,
  PackageIcon,
  TagIcon,
  AlertCircleIcon,
  PencilIcon,
  Trash2Icon,
  EyeIcon
} from 'lucide-react';
import AddInventoryItemModal, { InventoryItem } from '@/components/modals/AddInventoryItemModal';

// Sample inventory data
const inventoryItems = [
  {
    id: 1,
    name: 'Classroom Desks',
    category: 'Furniture',
    quantity: 250,
    availableQuantity: 230,
    minimumQuantity: 200,
    location: 'Storage Room A',
    status: 'In Stock',
    purchaseDate: '2023-02-15',
    value: 45000,
  },
  {
    id: 2,
    name: 'Whiteboard Markers',
    category: 'Stationery',
    quantity: 500,
    availableQuantity: 320,
    minimumQuantity: 100,
    location: 'Staff Room Cabinet',
    status: 'In Stock',
    purchaseDate: '2023-05-10',
    value: 5000,
  },
  {
    id: 3,
    name: 'Science Lab Microscopes',
    category: 'Lab Equipment',
    quantity: 30,
    availableQuantity: 28,
    minimumQuantity: 25,
    location: 'Science Lab',
    status: 'In Stock',
    purchaseDate: '2023-01-05',
    value: 75000,
  },
  {
    id: 4,
    name: 'Library Books - Science',
    category: 'Books',
    quantity: 350,
    availableQuantity: 290,
    minimumQuantity: 200,
    location: 'Library Section B',
    status: 'In Stock',
    purchaseDate: '2023-03-20',
    value: 87500,
  },
  {
    id: 5,
    name: 'Laptops',
    category: 'Electronics',
    quantity: 45,
    availableQuantity: 38,
    minimumQuantity: 40,
    location: 'Computer Lab',
    status: 'Low Stock',
    purchaseDate: '2022-08-12',
    value: 675000,
  },
  {
    id: 6,
    name: 'Sports Equipment - Football',
    category: 'Sports',
    quantity: 25,
    availableQuantity: 22,
    minimumQuantity: 15,
    location: 'Sports Room',
    status: 'In Stock',
    purchaseDate: '2023-04-18',
    value: 12500,
  },
  {
    id: 7,
    name: 'Classroom Chairs',
    category: 'Furniture',
    quantity: 250,
    availableQuantity: 245,
    minimumQuantity: 200,
    location: 'Storage Room A',
    status: 'In Stock',
    purchaseDate: '2023-02-15',
    value: 37500,
  },
  {
    id: 8,
    name: 'Projectors',
    category: 'Electronics',
    quantity: 15,
    availableQuantity: 12,
    minimumQuantity: 10,
    location: 'AV Room',
    status: 'In Stock',
    purchaseDate: '2022-11-30',
    value: 225000,
  },
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

// Status options for filtering
const statuses = [
  'All Statuses',
  'In Stock',
  'Low Stock',
  'Out of Stock',
];

export default function InventoryItemsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  // Filter inventory items based on search query, category, and status
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All Categories' || 
      item.category === selectedCategory;
    
    const matchesStatus = 
      selectedStatus === 'All Statuses' || 
      item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate inventory summary
  const inventorySummary = {
    totalItems: inventoryItems.length,
    totalValue: inventoryItems.reduce((sum, item) => sum + item.value, 0),
    lowStockItems: inventoryItems.filter(item => item.status === 'Low Stock').length,
    categories: new Set(inventoryItems.map(item => item.category)).size,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Handle adding a new inventory item
  const handleAddItem = (itemData: InventoryItem) => {
    console.log('New item added:', itemData);
    // Here you would typically make an API call to add the item
    // and then update the local state with the new item
    
    // Close the modal
    setIsAddItemModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Inventory Items</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage school inventory items and supplies
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/inventory/stock">
            <Button variant="outline">
              Stock Levels
            </Button>
          </Link>
          <Link href="/inventory/transactions">
            <Button variant="outline">
              Transactions
            </Button>
          </Link>
          <Button onClick={() => setIsAddItemModalOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Item
          </Button>
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{inventorySummary.totalItems}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <TagIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(inventorySummary.totalValue)}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
              <AlertCircleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{inventorySummary.lowStockItems}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
              <PackageIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{inventorySummary.categories}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white dark:bg-gray-800 shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search inventory..."
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
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <Button variant="outline" className="flex items-center">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card className="bg-white dark:bg-gray-800 shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Item Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
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
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{item.availableQuantity} / {item.quantity}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Min: {item.minimumQuantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{formatCurrency(item.value)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2Icon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredItems.length}</span> of{' '}
                <span className="font-medium">{filteredItems.length}</span> results
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

      {/* Add Inventory Item Modal */}
      <AddInventoryItemModal 
        isOpen={isAddItemModalOpen} 
        onClose={() => setIsAddItemModalOpen(false)} 
        onSubmit={handleAddItem} 
      />
    </div>
  );
} 