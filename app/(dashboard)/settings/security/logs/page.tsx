'use client';

import { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  ActivitySquare,
  AlertTriangle, 
  AlertCircle,
  DownloadCloud,
  Filter,
  FolderLock,
  Info, 
  Key,
  Lock,
  MailOpen,
  Phone,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  UserCog,
  X,
  Calendar,
  Clock
} from 'lucide-react';

// Event type definitions
type EventLevel = 'info' | 'warning' | 'critical';
type EventType = 
  | 'password_change'
  | 'password_reset'
  | 'login_success'
  | 'login_failed'
  | '2fa_enabled'
  | '2fa_disabled'
  | '2fa_challenge'
  | 'account_locked'
  | 'account_unlocked'
  | 'email_changed'
  | 'phone_changed'
  | 'role_changed'
  | 'permission_changed'
  | 'settings_changed';

// Mock security logs data
const mockSecurityLogs = [
  {
    id: '1',
    timestamp: new Date(2023, 6, 15, 9, 23),
    type: 'password_change' as EventType,
    level: 'info' as EventLevel,
    description: 'Password changed successfully',
    ipAddress: '192.168.1.1',
    location: 'New York, USA',
    device: 'Chrome on Windows',
  },
  {
    id: '2',
    timestamp: new Date(2023, 6, 14, 15, 37),
    type: '2fa_enabled' as EventType,
    level: 'info' as EventLevel,
    description: 'Two-factor authentication enabled for your account',
    ipAddress: '192.168.1.1',
    location: 'New York, USA',
    device: 'Chrome on Windows',
  },
  {
    id: '3',
    timestamp: new Date(2023, 6, 12, 11, 15),
    type: 'login_failed' as EventType,
    level: 'warning' as EventLevel,
    description: 'Failed login attempt',
    ipAddress: '203.45.78.92',
    location: 'Beijing, China',
    device: 'Unknown Browser',
    additionalInfo: 'Incorrect password',
  },
  {
    id: '4',
    timestamp: new Date(2023, 6, 10, 18, 22),
    type: 'account_locked' as EventType,
    level: 'critical' as EventLevel,
    description: 'Account locked after multiple failed login attempts',
    ipAddress: '203.45.78.92',
    location: 'Beijing, China',
    device: 'Unknown Browser',
  },
  {
    id: '5',
    timestamp: new Date(2023, 6, 10, 20, 45),
    type: 'account_unlocked' as EventType,
    level: 'info' as EventLevel,
    description: 'Account unlocked via email verification',
    ipAddress: '192.168.1.1',
    location: 'New York, USA',
    device: 'Safari on iPhone',
  },
  {
    id: '6',
    timestamp: new Date(2023, 6, 8, 14, 30),
    type: 'email_changed' as EventType,
    level: 'warning' as EventLevel,
    description: 'Email address changed',
    ipAddress: '192.168.1.1',
    location: 'New York, USA',
    device: 'Chrome on Windows',
    additionalInfo: 'From: old@example.com To: new@example.com',
  },
  {
    id: '7',
    timestamp: new Date(2023, 6, 5, 9, 15),
    type: '2fa_challenge' as EventType,
    level: 'info' as EventLevel,
    description: 'Two-factor authentication challenge completed successfully',
    ipAddress: '192.168.4.57',
    location: 'Boston, USA',
    device: 'Safari on iPhone',
  },
  {
    id: '8',
    timestamp: new Date(2023, 6, 2, 16, 20),
    type: 'password_reset' as EventType,
    level: 'warning' as EventLevel,
    description: 'Password reset requested',
    ipAddress: '192.168.1.1',
    location: 'New York, USA',
    device: 'Chrome on Windows',
  },
  {
    id: '9',
    timestamp: new Date(2023, 6, 2, 16, 35),
    type: 'password_change' as EventType,
    level: 'info' as EventLevel,
    description: 'Password changed successfully via reset link',
    ipAddress: '192.168.1.1',
    location: 'New York, USA',
    device: 'Chrome on Windows',
  },
  {
    id: '10',
    timestamp: new Date(2023, 5, 28, 13, 40),
    type: 'phone_changed' as EventType,
    level: 'warning' as EventLevel,
    description: 'Phone number changed',
    ipAddress: '192.168.1.1',
    location: 'New York, USA',
    device: 'Chrome on Windows',
    additionalInfo: 'From: (555) 123-4567 To: (555) 987-6543',
  },
  {
    id: '11',
    timestamp: new Date(2023, 5, 25, 11, 30),
    type: 'login_failed' as EventType,
    level: 'warning' as EventLevel,
    description: 'Failed login attempt',
    ipAddress: '185.67.45.34',
    location: 'Moscow, Russia',
    device: 'Unknown Browser',
    additionalInfo: 'Invalid username',
  },
  {
    id: '12',
    timestamp: new Date(2023, 5, 20, 10, 15),
    type: 'settings_changed' as EventType,
    level: 'info' as EventLevel,
    description: 'Account settings updated',
    ipAddress: '192.168.1.1',
    location: 'New York, USA',
    device: 'Firefox on Windows',
  },
];

export default function SecurityLogsPage() {
  const [securityLogs, setSecurityLogs] = useState<typeof mockSecurityLogs>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    eventLevel: [] as EventLevel[],
    eventType: [] as EventType[],
  });

  // Fetch security logs data (simulated)
  useEffect(() => {
    const fetchSecurityLogs = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        setSecurityLogs(mockSecurityLogs);
      } catch (error) {
        console.error('Error fetching security logs:', error);
        toast.error('Failed to load security logs');
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityLogs();
  }, []);

  // Handle refresh button click
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      toast.success('Security logs refreshed');
      // In a real app, we would fetch new data here
    } catch (error) {
      console.error('Error refreshing security logs:', error);
      toast.error('Failed to refresh security logs');
    } finally {
      setRefreshing(false);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, 'PPP p');
  };

  // Calculate time ago for display
  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter toggle
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle filter changes
  const handleFilterChange = (
    field: keyof typeof filters,
    value: string | EventLevel | EventType
  ) => {
    if (field === 'startDate' || field === 'endDate') {
      setFilters(prev => ({ ...prev, [field]: value }));
    } else if (field === 'eventLevel') {
      setFilters(prev => {
        const eventLevel = prev.eventLevel || [];
        if (eventLevel.includes(value as EventLevel)) {
          return {
            ...prev,
            eventLevel: eventLevel.filter(level => level !== value),
          };
        } else {
          return {
            ...prev,
            eventLevel: [...eventLevel, value as EventLevel],
          };
        }
      });
    } else if (field === 'eventType') {
      setFilters(prev => {
        const eventType = prev.eventType || [];
        if (eventType.includes(value as EventType)) {
          return {
            ...prev,
            eventType: eventType.filter(type => type !== value),
          };
        } else {
          return {
            ...prev,
            eventType: [...eventType, value as EventType],
          };
        }
      });
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      eventLevel: [],
      eventType: [],
    });
    setSearchQuery('');
  };

  // Export logs as CSV
  const exportLogs = () => {
    toast.success('Security logs exported successfully');
    // In a real app, we would generate and download a CSV file
  };

  // Filter logs based on active tab, search query, and filters
  const filteredLogs = securityLogs.filter(log => {
    // Filter by tab
    if (activeTab === 'critical' && log.level !== 'critical') return false;
    if (activeTab === 'warnings' && log.level !== 'warning') return false;
    if (activeTab === 'info' && log.level !== 'info') return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        log.description.toLowerCase().includes(query) ||
        log.type.toLowerCase().includes(query) ||
        log.ipAddress.toLowerCase().includes(query) ||
        log.location.toLowerCase().includes(query) ||
        log.device.toLowerCase().includes(query) ||
        (log.additionalInfo && log.additionalInfo.toLowerCase().includes(query));

      if (!matchesQuery) return false;
    }

    // Filter by date range
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      if (log.timestamp < startDate) return false;
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // End of the day
      if (log.timestamp > endDate) return false;
    }

    // Filter by event level
    if (filters.eventLevel.length > 0 && !filters.eventLevel.includes(log.level)) {
      return false;
    }

    // Filter by event type
    if (filters.eventType.length > 0 && !filters.eventType.includes(log.type)) {
      return false;
    }

    return true;
  });

  // Get event icon based on event type
  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'password_change':
      case 'password_reset':
        return <Key className="h-4 w-4" />;
      case 'login_success':
        return <ShieldCheck className="h-4 w-4" />;
      case 'login_failed':
        return <ShieldAlert className="h-4 w-4" />;
      case '2fa_enabled':
      case '2fa_disabled':
      case '2fa_challenge':
        return <Lock className="h-4 w-4" />;
      case 'account_locked':
      case 'account_unlocked':
        return <FolderLock className="h-4 w-4" />;
      case 'email_changed':
        return <MailOpen className="h-4 w-4" />;
      case 'phone_changed':
        return <Phone className="h-4 w-4" />;
      case 'role_changed':
      case 'permission_changed':
        return <UserCog className="h-4 w-4" />;
      case 'settings_changed':
        return <Sliders className="h-4 w-4" />;
      default:
        return <ActivitySquare className="h-4 w-4" />;
    }
  };

  // Get event level badge
  const getEventLevelBadge = (level: EventLevel) => {
    switch (level) {
      case 'critical':
        return (
          <Badge variant="error">
            <AlertCircle className="h-3 w-3 mr-1" />
            Critical
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="warning">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        );
      case 'info':
        return (
          <Badge variant="info">
            <Info className="h-3 w-3 mr-1" />
            Info
          </Badge>
        );
      default:
        return null;
    }
  };

  // Format event type for display
  const formatEventType = (type: EventType) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Create skeleton loader for security logs
  const renderSkeleton = () => {
    return Array(5).fill(0).map((_, i) => (
      <div key={i} className="flex flex-col space-y-2 p-4 border-b last:border-b-0">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Security Logs</h1>
          <p className="text-muted-foreground">View detailed security events for your account</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={toggleFilters}
            className="self-start"
            size="sm"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant="outline"
            onClick={exportLogs}
            className="self-start"
            size="sm"
          >
            <DownloadCloud className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="self-start"
            size="sm"
          >
            {refreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Events</CardTitle>
          <CardDescription>
            Detailed log of security-related events and activities on your account.
          </CardDescription>

          <div className="mt-4 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs by keyword, IP, location..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="p-4 border rounded-md space-y-4 bg-muted/40">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 text-xs"
                  >
                    Clear All
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date Range */}
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-xs">Start Date</Label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="startDate"
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-xs">End Date</Label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="endDate"
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Event Level */}
                <div className="space-y-2">
                  <Label className="text-xs">Event Level</Label>
                  <div className="flex flex-wrap gap-2">
                    {(['info', 'warning', 'critical'] as EventLevel[]).map((level) => (
                      <Button
                        key={level}
                        variant={filters.eventLevel.includes(level) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange('eventLevel', level)}
                        className="h-7 text-xs capitalize"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Event Type */}
                <div className="space-y-2">
                  <Label className="text-xs">Event Type</Label>
                  <div className="flex flex-wrap gap-2">
                    {([
                      'password_change',
                      'password_reset',
                      'login_failed',
                      '2fa_enabled',
                      '2fa_disabled',
                      'account_locked',
                      'email_changed',
                      'settings_changed'
                    ] as EventType[]).map((type) => (
                      <Button
                        key={type}
                        variant={filters.eventType.includes(type) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFilterChange('eventType', type)}
                        className="h-7 text-xs"
                      >
                        {formatEventType(type)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-4 max-w-md">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
                <TabsTrigger value="warnings">Warnings</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="border-b border-t divide-y">
            {loading ? (
              renderSkeleton()
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-4 ${
                    log.level === 'critical'
                      ? 'bg-red-50/40 dark:bg-red-950/10'
                      : log.level === 'warning'
                      ? 'bg-amber-50/40 dark:bg-amber-950/10'
                      : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDate(log.timestamp)}</span>
                      <span className="mx-1">•</span>
                      <span>{getTimeAgo(log.timestamp)}</span>
                    </div>
                    <div>{getEventLevelBadge(log.level)}</div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {getEventIcon(log.type)}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">
                        {formatEventType(log.type)}
                        <span className="font-normal"> - {log.description}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>{log.device}</span>
                        <span className="mx-1">•</span>
                        <span>{log.location}</span>
                        <span className="mx-1">•</span>
                        <span>IP: {log.ipAddress}</span>
                      </div>
                      {log.additionalInfo && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {log.additionalInfo}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                  <Info className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No security logs found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filters.startDate || filters.endDate || filters.eventLevel.length > 0 || filters.eventType.length > 0
                    ? 'No results match your filters. Try adjusting your search criteria.'
                    : 'There are no security logs available for your account.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start border-t bg-gray-50 dark:bg-gray-800/50 p-4 space-y-3">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              Security logs help you monitor activity on your account and detect potential security threats.
              Review these logs regularly to ensure your account remains secure.
            </p>
          </div>
          <div className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              For security reasons, logs are stored for 90 days. Contact support if you need older records.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 