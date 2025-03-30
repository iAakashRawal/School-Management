'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeSwitcher } from '@/components/providers/theme-switcher';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  User,
  LogOut,
  Settings,
  Clock,
  LayoutDashboard,
  Users,
  UserCog,
  BookOpen,
  ClipboardCheck,
  FileText,
  CreditCard,
  Bus,
  Home,
  Book,
  Package,
  BarChart,
  Pencil
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5 mr-3 text-indigo-500" />,
  },
  {
    name: 'Students',
    href: '/students',
    icon: <Users className="h-5 w-5 mr-3 text-emerald-500" />,
    children: [
      { name: 'All Students', href: '/students' },
      { name: 'Add Student', href: '/students/add' },
      { name: 'Bulk Import', href: '/students/import' },
    ],
  },
  {
    name: 'Teachers',
    href: '/teachers',
    icon: <UserCog className="h-5 w-5 mr-3 text-blue-500" />,
    children: [
      { name: 'All Teachers', href: '/teachers' },
      { name: 'Add Teacher', href: '/teachers/add' },
      { name: 'Assign Classes', href: '/teachers/assign' },
    ],
  },
  {
    name: 'Classes',
    href: '/classes',
    icon: <BookOpen className="h-5 w-5 mr-3 text-amber-500" />,
    children: [
      { name: 'All Classes', href: '/classes' },
      { name: 'Add Class', href: '/classes/add' },
      { name: 'Assign Teachers', href: '/classes/assign' },
    ],
  },
  {
    name: 'Attendance',
    href: '/attendance',
    icon: <ClipboardCheck className="h-5 w-5 mr-3 text-green-500" />,
    children: [
      { name: 'Daily Attendance', href: '/attendance/daily' },
      { name: 'Monthly Report', href: '/attendance/monthly' },
      { name: 'Student History', href: '/attendance/history' },
    ],
  },
  {
    name: 'Exams',
    href: '/exams',
    icon: <FileText className="h-5 w-5 mr-3 text-red-500" />,
    children: [
      { name: 'Exam Schedule', href: '/exams/schedule' },
      { name: 'Results', href: '/exams/results' },
      { name: 'Report Cards', href: '/exams/report-cards' },
    ],
  },
  {
    name: 'Fees',
    href: '/fees',
    icon: <CreditCard className="h-5 w-5 mr-3 text-purple-500" />,
    children: [
      { name: 'Fee Structure', href: '/fees/structure' },
      { name: 'Collections', href: '/fees/collections' },
      { name: 'Due Payments', href: '/fees/due' },
    ],
  },
  {
    name: 'Transport',
    href: '/transport',
    icon: <Bus className="h-5 w-5 mr-3 text-yellow-500" />,
    children: [
      { name: 'Routes', href: '/transport/routes' },
      { name: 'Assignments', href: '/transport/assignments' },
      { name: 'Fees', href: '/transport/fees' },
    ],
  },
  {
    name: 'Hostel',
    href: '/hostel',
    icon: <Home className="h-5 w-5 mr-3 text-teal-500" />,
    children: [
      { name: 'Rooms', href: '/hostel/rooms' },
      { name: 'Assignments', href: '/hostel/assignments' },
      { name: 'Fees', href: '/hostel/fees' },
    ],
  },
  {
    name: 'Library',
    href: '/library',
    icon: <Book className="h-5 w-5 mr-3 text-orange-500" />,
    children: [
      { name: 'Books', href: '/library/books' },
      { name: 'Issued Books', href: '/library/issued' },
      { name: 'Returns', href: '/library/returns' },
    ],
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: <Package className="h-5 w-5 mr-3 text-cyan-500" />,
    children: [
      { name: 'Items', href: '/inventory/items' },
      { name: 'Stock', href: '/inventory/stock' },
      { name: 'Transactions', href: '/inventory/transactions' },
    ],
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: <BarChart className="h-5 w-5 mr-3 text-pink-500" />,
    children: [
      { name: 'Academic', href: '/reports/academic' },
      { name: 'Financial', href: '/reports/financial' },
      { name: 'Attendance', href: '/reports/attendance' },
    ],
  },
  {
    name: 'Drawing Canvas',
    href: '/drawing',
    icon: <Pencil className="h-5 w-5 mr-3 text-violet-500" />,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5 mr-3 text-gray-500" />,
    children: [
      { name: 'General', href: '/settings/general' },
      { name: 'Users', href: '/settings/users' },
      { name: 'Roles', href: '/settings/roles' },
    ],
  },
];

// User navigation items (to be implemented in profile dropdown)
// const userNavigation = [
//   { name: 'Your Profile', href: '/profile' },
//   { name: 'Settings', href: '/settings' },
//   { name: 'Sign out', href: '/auth/signout' },
// ];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Handle outside click for user menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuRef]);

  const toggleItem = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'bg-neutral-800'
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-300">SchoolMS</span>
          </Link>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <nav className="space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleItem(item.name)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-neutral-700 hover:text-white',
                        expandedItems.includes(item.name) && 'bg-neutral-700 text-white'
                      )}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className='text-gray-300'>{item.name}</span>
                      </div>
                      {expandedItems.includes(item.name) ? (
                        <ChevronDown className="h-4 w-4 text-gray-300" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                      )} 
                    </button>
                    {expandedItems.includes(item.name) && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              'flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-neutral-700 hover:text-white',
                              pathname === child.href && 'bg-neutral-700 text-white'
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-neutral-700 hover:text-white',
                      pathname === item.href && 'bg-neutral-700 text-white'
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div
        className={cn(
          'flex flex-col transition-all duration-200 ease-in-out bg-background',
          sidebarOpen ? 'pl-64' : 'pl-0'
        )}
      >
        {/* Top bar */}
        <div className="header sticky top-0 z-40 flex h-16 items-center justify-between px-4 bg-background border-b">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                className="flex items-center space-x-2"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User className="h-5 w-5 mr-1" />
                <span>John Doe</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {userMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-popover py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Link 
                    href="/profile" 
                    className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Your Profile
                  </Link>
                  <Link 
                    href="/account-settings" 
                    className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Link>
                  <Link 
                    href="/activity-log" 
                    className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Activity Log
                  </Link>
                  <div className="border-t border-border"></div>
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-accent"
                    onClick={() => {
                      // Handle logout logic here
                      setUserMenuOpen(false);
                      // Example: redirect to login page
                      window.location.href = '/auth/login';
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl bg-card rounded-lg border p-5 h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Theme Switcher - safely handled with error boundary */}
      <ThemeSwitcher />
    </div>
  );
} 