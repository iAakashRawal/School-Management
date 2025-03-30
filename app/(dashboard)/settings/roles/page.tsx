'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, PencilIcon, TrashIcon, ShieldAlertIcon, UserIcon, UsersIcon } from 'lucide-react';

const roles = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full access to all system features',
    usersCount: 3,
    permissions: {
      dashboard: true,
      students: true,
      teachers: true,
      classes: true,
      attendance: true,
      exams: true,
      marksheets: true,
      certificates: true,
      fees: true,
      transport: true,
      hostel: true,
      settings: true,
      reports: true,
    },
  },
  {
    id: 2,
    name: 'Teacher',
    description: 'Access to teaching-related features',
    usersCount: 45,
    permissions: {
      dashboard: true,
      students: true,
      teachers: false,
      classes: true,
      attendance: true,
      exams: true,
      marksheets: true,
      certificates: false,
      fees: false,
      transport: false,
      hostel: false,
      settings: false,
      reports: false,
    },
  },
  {
    id: 3,
    name: 'Staff',
    description: 'Limited access to administrative features',
    usersCount: 12,
    permissions: {
      dashboard: true,
      students: true,
      teachers: false,
      classes: false,
      attendance: true,
      exams: false,
      marksheets: false,
      certificates: true,
      fees: true,
      transport: true,
      hostel: true,
      settings: false,
      reports: false,
    },
  },
  {
    id: 4,
    name: 'Accountant',
    description: 'Access to financial features',
    usersCount: 2,
    permissions: {
      dashboard: true,
      students: true,
      teachers: false,
      classes: false,
      attendance: false,
      exams: false,
      marksheets: false,
      certificates: false,
      fees: true,
      transport: true,
      hostel: false,
      settings: false,
      reports: true,
    },
  },
];

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [showPermissions, setShowPermissions] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Define user roles and manage permissions
          </p>
        </div>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Role
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-6 dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Roles</h2>
            <div className="space-y-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                    selectedRole.id === role.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent'
                  }`}
                  onClick={() => {
                    setSelectedRole(role);
                    setShowPermissions(false);
                  }}
                >
                  <div className="flex items-center">
                    {role.name === 'Admin' ? (
                      <ShieldAlertIcon className="h-5 w-5 text-indigo-500 mr-3" />
                    ) : role.name === 'Teacher' ? (
                      <UsersIcon className="h-5 w-5 text-blue-500 mr-3" />
                    ) : (
                      <UserIcon className="h-5 w-5 text-green-500 mr-3" />
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{role.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{role.usersCount} users</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="p-6 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedRole.name} Details
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedRole.description}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowPermissions(!showPermissions)}
              >
                {showPermissions ? 'Hide Permissions' : 'Show Permissions'}
              </Button>
            </div>
            
            {!showPermissions ? (
              <div className="space-y-6">
                <div>
                  <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role Name
                  </label>
                  <input
                    type="text"
                    id="roleName"
                    name="roleName"
                    defaultValue={selectedRole.name}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="roleDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    id="roleDescription"
                    name="roleDescription"
                    rows={3}
                    defaultValue={selectedRole.description}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Module Permissions</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedRole.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        id={`permission-${key}`}
                        name={`permission-${key}`}
                        type="checkbox"
                        defaultChecked={value}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label htmlFor={`permission-${key}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-100 capitalize">
                        {key}
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Permissions</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
} 