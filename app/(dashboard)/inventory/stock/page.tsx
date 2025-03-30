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
  AlertTriangleIcon,
  CheckCircleIcon
} from 'lucide-react';

// Sample stock data
const stockItems = [
  {
    id: 1,
    name: 'Classroom Desks',
    category: 'Furniture',
    currentStock: 230,
    minimumStock: 200,
    maximumStock: 300,
    reorderPoint: 220,
    stockStatus: 'Adequate',
    lastUpdated: '2023-08-10',
    location: 'Storage Room A',
  },
  {
    id: 2,
    name: 'Whiteboard Markers',
    category: 'Stationery',
    currentStock: 320,
    minimumStock: 100,
    maximumStock: 600,
    reorderPoint: 150,
    stockStatus: 'Adequate',
    lastUpdated: '2023-07-15',
    location: 'Staff Room Cabinet',
  },
  {
    id: 3,
    name: 'Science Lab Microscopes',
    category: 'Lab Equipment',
    currentStock: 28,
    minimumStock: 25,
    maximumStock: 40,
    reorderPoint: 30,
    stockStatus: 'Low',
    lastUpdated: '2023-08-05',
    location: 'Science Lab',
  },
  {
    id: 4,
    name: 'Library Books - Science',
    category: 'Books',
    currentStock: 290,
    minimumStock: 200,
    maximumStock: 500,
    reorderPoint: 250,
    stockStatus: 'Adequate',
    lastUpdated: '2023-08-12',
    location: 'Library Section B',
  },
  {
    id: 5,
    name: 'Laptops',
    category: 'Electronics',
    currentStock: 38,
    minimumStock: 40,
    maximumStock: 60,
    reorderPoint: 45,
    stockStatus: 'Low',
    lastUpdated: '2023-06-22',
    location: 'Computer Lab',
  },
  {
    id: 6,
    name: 'Sports Equipment - Football',
    category: 'Sports',
    currentStock: 22,
    minimumStock: 15,
    maximumStock: 30,
    reorderPoint: 20,
    stockStatus: 'Adequate',
    lastUpdated: '2023-07-30',
    location: 'Sports Room',
  },
  {
    id: 7,
    name: 'Classroom Chairs',
    category: 'Furniture',
    currentStock: 245,
    minimumStock: 200,
    maximumStock: 300,
    reorderPoint: 220,
    stockStatus: 'Adequate',
    lastUpdated: '2023-08-10',
    location: 'Storage Room A',
  },
  {
    id: 8,
    name: 'Projectors',
    category: 'Electronics',
    currentStock: 12,
    minimumStock: 10,
    maximumStock: 20,
    reorderPoint: 15,
    stockStatus: 'Low',
    lastUpdated: '2023-07-05',
    location: 'AV Room',
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

// Stock status options for filtering
const statuses = [
  'All Statuses',
  'Adequate',
  'Low',
  'Critical',
];

export default function InventoryStockPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Filter stock items based on search query, category, and status
  const filteredItems = stockItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All Categories' || 
      item.category === selectedCategory;
    
    const matchesStatus = 
      selectedStatus === 'All Statuses' || 
      item.stockStatus === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stock summary
  const stockSummary = {
    totalStockItems: stockItems.length,
    lowStockItems: stockItems.filter(item => item.stockStatus === 'Low').length,
    criticalStockItems: stockItems.filter(item => item.stockStatus === 'Critical').length,
    adequateStockItems: stockItems.filter(item => item.stockStatus === 'Adequate').length,
  };
  
  const getStockStatusStyles = (status: string) => {
    switch (status) {
      case 'Adequate':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Low':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  const getStockLevelPercentage = (current: number, min: number, max: number) => {
    const range = max - min;
    if (range <= 0) return 0;
    
    const adjustedCurrent = current - min;
    const percentage = (adjustedCurrent / range) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Clamp between 0-100
  };
  
  const getStockLevelColor = (status: string) => {
    switch (status) {
      case 'Adequate':
        return 'bg-green-500';
      case 'Low':
        return 'bg-yellow-500';
      case 'Critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Inventory Stock</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor current stock levels and manage inventory alerts
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/inventory/items">
            <Button variant="outline">
              View Items
            </Button>
          </Link>
          <Link href="/inventory/transactions">
            <Button variant="outline">
              View Transactions
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <CheckCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stockSummary.totalStockItems}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Adequate Stock</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stockSummary.adequateStockItems}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
              <AlertTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock Items</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stockSummary.lowStockItems}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 mr-4">
              <AlertTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Stock</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stockSummary.criticalStockItems}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-gray-800 shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search stocks..."
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
              <FilterIcon className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Stock Items */}
      <div className="grid grid-cols-1 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-white dark:bg-gray-800 shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">{item.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusStyles(item.stockStatus)}`}>
                    {item.stockStatus}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>Category: {item.category}</span>
                  <span>Location: {item.location}</span>
                  <span>Last Updated: {item.lastUpdated}</span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col md:items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.currentStock} units</span>
                  {item.currentStock <= item.reorderPoint && (
                    <span className="flex items-center text-yellow-600 dark:text-yellow-400 text-sm">
                      <ArrowDownCircleIcon className="h-4 w-4 mr-1" />
                      Reorder
                    </span>
                  )}
                </div>
                
                <div className="w-full md:w-60">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Min: {item.minimumStock}</span>
                    <span className="text-gray-500 dark:text-gray-400">Max: {item.maximumStock}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getStockLevelColor(item.stockStatus)}`} 
                      style={{ 
                        width: `${getStockLevelPercentage(item.currentStock, item.minimumStock, item.maximumStock)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ArrowUpCircleIcon className="h-4 w-4 mr-2" /> Stock In
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowDownCircleIcon className="h-4 w-4 mr-2" /> Stock Out
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 