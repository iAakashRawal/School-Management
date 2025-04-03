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
import { toast } from 'sonner';
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Monitor, 
  MapPin, 
  Clock, 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  Shield, 
  X,
  RefreshCw
} from 'lucide-react';

// Mock login history data
const mockLoginHistory = [
  {
    id: '1',
    timestamp: new Date(2023, 6, 12, 8, 30),
    device: 'Windows PC',
    browser: 'Chrome 114',
    ip: '192.168.1.1',
    location: 'New York, USA',
    status: 'success',
    isCurrent: true,
  },
  {
    id: '2',
    timestamp: new Date(2023, 6, 10, 14, 15),
    device: 'MacBook Pro',
    browser: 'Safari 16',
    ip: '192.168.0.101',
    location: 'New York, USA',
    status: 'success',
    isCurrent: false,
  },
  {
    id: '3',
    timestamp: new Date(2023, 6, 8, 9, 45),
    device: 'iPhone 13',
    browser: 'Safari Mobile 16',
    ip: '192.168.4.57',
    location: 'Boston, USA',
    status: 'success',
    isCurrent: false,
  },
  {
    id: '4',
    timestamp: new Date(2023, 6, 5, 19, 20),
    device: 'Windows PC',
    browser: 'Firefox 115',
    ip: '192.168.2.34',
    location: 'Chicago, USA',
    status: 'success',
    isCurrent: false,
  },
  {
    id: '5',
    timestamp: new Date(2023, 6, 3, 12, 10),
    device: 'Android Tablet',
    browser: 'Chrome 113',
    ip: '192.168.5.92',
    location: 'New York, USA',
    status: 'success',
    isCurrent: false,
  },
  {
    id: '6',
    timestamp: new Date(2023, 5, 30, 23, 5),
    device: 'Unknown Device',
    browser: 'Unknown Browser',
    ip: '203.45.78.92',
    location: 'Beijing, China',
    status: 'failed',
    isCurrent: false,
    failureReason: 'Wrong password',
  },
  {
    id: '7',
    timestamp: new Date(2023, 5, 29, 15, 40),
    device: 'Windows PC',
    browser: 'Chrome 114',
    ip: '192.168.1.1',
    location: 'New York, USA', 
    status: 'success',
    isCurrent: false,
  },
  {
    id: '8',
    timestamp: new Date(2023, 5, 28, 8, 25),
    device: 'Unknown Device',
    browser: 'Unknown Browser',
    ip: '185.67.45.34',
    location: 'Moscow, Russia',
    status: 'failed',
    isCurrent: false,
    failureReason: 'Suspicious location',
  },
];

export default function LoginHistoryPage() {
  const [loginHistory, setLoginHistory] = useState<typeof mockLoginHistory>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch login history data (simulated)
  useEffect(() => {
    const fetchLoginHistory = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        setLoginHistory(mockLoginHistory);
      } catch (error) {
        console.error('Error fetching login history:', error);
        toast.error('Failed to load login history');
      } finally {
        setLoading(false);
      }
    };

    fetchLoginHistory();
  }, []);

  // Handle refresh button click
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      toast.success('Login history refreshed');
      // In a real app, we would fetch new data here
    } catch (error) {
      console.error('Error refreshing login history:', error);
      toast.error('Failed to refresh login history');
    } finally {
      setRefreshing(false);
    }
  };

  // Filter login history based on active tab
  const filteredHistory = loginHistory.filter(login => {
    if (activeTab === 'all') return true;
    if (activeTab === 'successful') return login.status === 'success';
    if (activeTab === 'failed') return login.status === 'failed';
    return true;
  });

  // Function to get device icon based on device name
  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
      return <Smartphone className="h-4 w-4" />;
    }
    if (device.toLowerCase().includes('macbook') || device.toLowerCase().includes('windows pc')) {
      return <Laptop className="h-4 w-4" />;
    }
    if (device.toLowerCase().includes('tablet')) {
      return <Tablet className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  // Function to get status badge based on login status
  const getStatusBadge = (status: string, isCurrent: boolean) => {
    if (status === 'success') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
          {isCurrent ? 'Current Session' : 'Successful'}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900">
        Failed
      </Badge>
    );
  };

  // Create skeleton loader for login history
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

  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, 'PPP p');
  };

  // Calculate time ago for display
  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Terminate session (simulated)
  const handleTerminateSession = (id: string) => {
    toast.success('Session terminated successfully');
    // In a real app, we would call an API to terminate the session
  };

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Login History</h1>
          <p className="text-muted-foreground">View and manage your account login activity</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={refreshing || loading}
          className="self-start"
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
      
      <Card>
        <CardHeader>
          <CardTitle>Session Activity</CardTitle>
          <CardDescription>
            Review recent login activity on your account. If you see any suspicious activity, change your password immediately.
          </CardDescription>
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mt-4"
          >
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="successful">Successful</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b border-t divide-y">
            {loading ? (
              renderSkeleton()
            ) : filteredHistory.length > 0 ? (
              filteredHistory.map((login) => (
                <div key={login.id} className={`p-4 ${login.status === 'failed' ? 'bg-red-50/50 dark:bg-red-950/20' : login.isCurrent ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDate(login.timestamp)}</span>
                      <span className="mx-1">•</span>
                      <span>{getTimeAgo(login.timestamp)}</span>
                    </div>
                    <div>{getStatusBadge(login.status, login.isCurrent)}</div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {getDeviceIcon(login.device)}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{login.device} • {login.browser}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{login.location}</span>
                        <span className="mx-1">•</span>
                        <span>IP: {login.ip}</span>
                      </div>
                      {login.status === 'failed' && login.failureReason && (
                        <div className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 mt-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>Reason: {login.failureReason}</span>
                        </div>
                      )}
                    </div>
                    
                    {login.status === 'success' && !login.isCurrent && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20"
                        onClick={() => handleTerminateSession(login.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Terminate
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                  <Info className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No login activity found</h3>
                <p className="text-muted-foreground">There is no login history available for your account.</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start border-t bg-gray-50 dark:bg-gray-800/50 p-4 space-y-3">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              We keep track of your login history to help protect your account. If you notice any suspicious activity, 
              please change your password immediately and contact support.
            </p>
          </div>
          <div className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              For security reasons, login history is stored for 30 days.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 