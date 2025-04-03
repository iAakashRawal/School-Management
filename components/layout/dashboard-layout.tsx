'use client';

import { useState, useEffect, useRef, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeSwitcher } from '@/components/providers/theme-switcher';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useTheme } from '@/components/providers/theme-provider';
import { useTranslation } from 'next-i18next';
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

// Simple ErrorBoundary component to catch and handle errors
class ErrorBoundary extends Component<
  { children: ReactNode, fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode, fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <></>;
    }

    return this.props.children;
  }
}

// Component to safely render ThemeSwitcher with error handling
function SafeThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      setMounted(true);
    } catch (e) {
      console.error('Error mounting ThemeSwitcher:', e);
      setError(true);
    }
  }, []);

  if (error || !mounted) {
    return null;
  }

  return (
    <ErrorBoundary 
      fallback={
        <div className="fixed right-4 bottom-4 hidden"></div>
      }
    >
      <span className="inline-block">
        <ThemeSwitcher />
      </span>
    </ErrorBoundary>
  );
}

export default function DashboardLayout({ 
  children, 
  locale 
}: { 
  children: React.ReactNode;
  locale?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { t } = useTranslation('common');
  
  // Get sidebar colors from the theme provider - with error handling
  let sidebarColor = '#262626'; // Default color if theme provider fails
  let sidebarTextColor = '#ffffff'; // Default text color
  
  try {
    const themeContext = useTheme();
    sidebarColor = themeContext.sidebarColor;
    sidebarTextColor = themeContext.sidebarTextColor;
  } catch (e) {
    console.error('Error accessing theme context in dashboard layout:', e);
  }

  // Handle mounting state with high priority
  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper function to calculate active item background color
  const getActiveItemBgColor = (color: string): string => {
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Calculate brightness (0-255)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // For dark sidebar, lighten the active color
    // For light sidebar, darken the active color
    if (brightness < 128) {
      // For dark backgrounds, lighten the color by 20%
      const newR = Math.min(255, Math.round(r * 1.2));
      const newG = Math.min(255, Math.round(g * 1.2));
      const newB = Math.min(255, Math.round(b * 1.2));
      return `rgb(${newR}, ${newG}, ${newB})`;
    } else {
      // For light backgrounds, darken the color by 20%
      const newR = Math.max(0, Math.round(r * 0.8));
      const newG = Math.max(0, Math.round(g * 0.8));
      const newB = Math.max(0, Math.round(b * 0.8));
      return `rgb(${newR}, ${newG}, ${newB})`;
    }
  };

  // Helper function to calculate hover item background color
  const getHoverItemBgColor = (color: string): string => {
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Calculate brightness (0-255)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // For dark sidebar, lighten for hover
    // For light sidebar, darken for hover
    if (brightness < 128) {
      // For dark backgrounds, lighten the color by 10%
      const newR = Math.min(255, Math.round(r * 1.1));
      const newG = Math.min(255, Math.round(g * 1.1));
      const newB = Math.min(255, Math.round(b * 1.1));
      return `rgba(${newR}, ${newG}, ${newB}, 0.5)`;
    } else {
      // For light backgrounds, darken the color by 10%
      const newR = Math.max(0, Math.round(r * 0.9));
      const newG = Math.max(0, Math.round(g * 0.9));
      const newB = Math.max(0, Math.round(b * 0.9));
      return `rgba(${newR}, ${newG}, ${newB}, 0.5)`;
    }
  };

  // Calculate active and hover background colors
  const activeItemBgColor = useMemo(() => getActiveItemBgColor(sidebarColor), [sidebarColor]);
  const hoverItemBgColor = useMemo(() => getHoverItemBgColor(sidebarColor), [sidebarColor]);

  // Handle outside click for user menu
  useEffect(() => {
    if (!mounted) return;

    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mounted]);

  // Toggle sidebar navigation items
  const toggleItem = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  // Only do this after the component is mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  // Updated navigation with static paths
  const navigation = [
    {
      name: t('navigation.dashboard'),
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: t('navigation.students'),
      href: '/students',
      icon: <Users className="h-5 w-5" />,
      children: [
        { name: t('students.all'), href: '/students' },
        { name: t('students.add'), href: '/students/add' },
        { name: t('students.import'), href: '/students/import' },
      ],
    },
    {
      name: t('navigation.teachers'),
      href: '/teachers',
      icon: <UserCog className="h-5 w-5" />,
      children: [
        { name: t('teachers.all'), href: '/teachers' },
        { name: t('teachers.add'), href: '/teachers/add' },
        { name: t('teachers.assign'), href: '/teachers/assign' },
      ],
    },
    {
      name: t('navigation.classes'),
      href: '/classes',
      icon: <BookOpen className="h-5 w-5" />,
      children: [
        { name: t('classes.all'), href: '/classes' },
        { name: t('classes.add'), href: '/classes/add' },
        { name: t('classes.assign'), href: '/classes/assign' },
      ],
    },
    {
      name: t('navigation.attendance'),
      href: '/attendance',
      icon: <ClipboardCheck className="h-5 w-5" />,
      children: [
        { name: t('attendance.daily'), href: '/attendance/daily' },
        { name: t('attendance.monthly'), href: '/attendance/monthly' },
        { name: t('attendance.history'), href: '/attendance/history' },
      ],
    },
    {
      name: t('navigation.exams'),
      href: '/exams',
      icon: <FileText className="h-5 w-5" />,
      children: [
        { name: t('exams.schedule'), href: '/exams/schedule' },
        { name: t('exams.results'), href: '/exams/results' },
        { name: t('exams.report_cards'), href: '/exams/report-cards' },
      ],
    },
    {
      name: t('navigation.fees'),
      href: '/fees',
      icon: <CreditCard className="h-5 w-5" />,
      children: [
        { name: t('fees.structure'), href: '/fees/structure' },
        { name: t('fees.collections'), href: '/fees/collections' },
        { name: t('fees.due'), href: '/fees/due' },
      ],
    },
    {
      name: t('navigation.transport'),
      href: '/transport',
      icon: <Bus className="h-5 w-5" />,
      children: [
        { name: t('transport.routes'), href: '/transport/routes' },
        { name: t('transport.assignments'), href: '/transport/assignments' },
        { name: t('transport.fees'), href: '/transport/fees' },
      ],
    },
    {
      name: t('navigation.hostel'),
      href: '/hostel',
      icon: <Home className="h-5 w-5" />,
      children: [
        { name: t('hostel.rooms'), href: '/hostel/rooms' },
        { name: t('hostel.assignments'), href: '/hostel/assignments' },
        { name: t('hostel.fees'), href: '/hostel/fees' },
      ],
    },
    {
      name: t('navigation.library'),
      href: '/library',
      icon: <Book className="h-5 w-5" />,
      children: [
        { name: t('library.books'), href: '/library/books' },
        { name: t('library.issued'), href: '/library/issued' },
        { name: t('library.returns'), href: '/library/returns' },
      ],
    },
    {
      name: t('navigation.inventory'),
      href: '/inventory',
      icon: <Package className="h-5 w-5" />,
      children: [
        { name: t('inventory.items'), href: '/inventory/items' },
        { name: t('inventory.stock'), href: '/inventory/stock' },
        { name: t('inventory.transactions'), href: '/inventory/transactions' },
      ],
    },
    {
      name: t('navigation.reports'),
      href: '/reports',
      icon: <BarChart className="h-5 w-5" />,
      children: [
        { name: t('reports.academic'), href: '/reports/academic' },
        { name: t('reports.financial'), href: '/reports/financial' },
        { name: t('reports.attendance'), href: '/reports/attendance' },
      ],
    },
    {
      name: t('navigation.drawing'),
      href: '/drawing',
      icon: <Pencil className="h-5 w-5" />,
    },
    {
      name: t('navigation.settings'),
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
      children: [
        { name: t('settings.general'), href: '/settings/general' },
        { name: t('settings.account'), href: '/settings/account/profile' },
        { name: t('settings.security'), href: '/settings/security/change-password' },
        { name: t('settings.users'), href: '/settings/users' },
        { name: t('settings.roles'), href: '/settings/roles' },
      ],
    },
  ];

  // User navigation items (to be implemented in profile dropdown)
  // const userNavigation = [
  //   { name: 'Your Profile', href: '/profile' },
  //   { name: 'Settings', href: '/settings' },
  //   { name: 'Sign out', href: '/auth/signout' },
  // ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out shadow-lg',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ 
          backgroundColor: sidebarColor,
          color: sidebarTextColor,
          transition: 'background-color 0.3s ease, transform 0.2s ease-in-out' 
        }}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-opacity-20" style={{ borderColor: sidebarTextColor }}>
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold" style={{ color: sidebarTextColor }}>SchoolMS</span>
          </Link>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <nav className="space-y-1 px-2 py-4">
            {navigation.map((item) => {
              // Check if item is active
              const isActive = pathname === item.href;
              const isHovered = hoveredItem === item.name;
              
              return (
                <div key={item.name}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleItem(item.name)}
                        onMouseEnter={() => setHoveredItem(item.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                          expandedItems.includes(item.name) ? 'shadow-sm' : ''
                        )}
                        style={{ 
                          color: sidebarTextColor,
                          backgroundColor: expandedItems.includes(item.name) 
                            ? activeItemBgColor 
                            : isHovered 
                              ? hoverItemBgColor 
                              : 'transparent',
                        }}
                      >
                        <div className="flex items-center">
                          <div className="mr-3 flex-shrink-0" style={{ color: sidebarTextColor }}>
                            {item.icon}
                          </div>
                          <span className="font-medium">
                            {item.name}
                          </span>
                        </div>
                        {expandedItems.includes(item.name) ? (
                          <ChevronDown className="h-4 w-4" style={{ color: sidebarTextColor }} />
                        ) : (
                          <ChevronRight className="h-4 w-4" style={{ color: sidebarTextColor }} />
                        )} 
                      </button>
                      {expandedItems.includes(item.name) && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.children.map((child) => {
                            const isChildActive = pathname === child.href;
                            const isChildHovered = hoveredItem === `${item.name}-${child.name}`;
                            
                            return (
                              <Link
                                key={child.name}
                                href={child.href}
                                onMouseEnter={() => setHoveredItem(`${item.name}-${child.name}`)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className={cn(
                                  'flex items-center rounded-md px-3 py-2 text-sm transition-all duration-200',
                                  isChildActive ? 'font-medium shadow-sm' : 'font-normal'
                                )}
                                style={{ 
                                  color: sidebarTextColor,
                                  backgroundColor: isChildActive 
                                    ? activeItemBgColor 
                                    : isChildHovered 
                                      ? hoverItemBgColor 
                                      : 'transparent'
                                }}
                              >
                                {child.name}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={cn(
                        'flex items-center rounded-md px-3 py-2 text-sm transition-all duration-200',
                        isActive ? 'font-medium shadow-sm' : 'font-normal'
                      )}
                      style={{ 
                        color: sidebarTextColor,
                        backgroundColor: isActive 
                          ? activeItemBgColor 
                          : isHovered 
                            ? hoverItemBgColor 
                            : 'transparent'
                      }}
                    >
                      <div className="mr-3 flex-shrink-0" style={{ color: sidebarTextColor }}>
                        {item.icon}
                      </div>
                      {item.name}
                    </Link>
                  )}
                </div>
              )
            })}
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
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* User Menu */}
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
                    {t('settings.account')}
                  </Link>
                  <Link 
                    href="/account-settings"
                    className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {t('settings.title')}
                  </Link>
                  <Link 
                    href="/activity-log"
                    className="flex items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {t('security.login_history')}
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
                    {t('auth.sign_out')}
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

      {/* Safely render the theme switcher */}
      <SafeThemeSwitcher />
    </div>
  );
} 