'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck,
  AlertTriangle,
  Smartphone,
  Mail,
  Info,
  Key,
  Copy,
  RefreshCw,
  Download,
  ChevronRight
} from 'lucide-react';

export default function TwoFactorAuthPage() {
  // State for 2FA status
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  
  // State for setup steps
  const [currentSetupStep, setCurrentSetupStep] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  
  // State for recovery codes
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);
  
  // State for methods
  const [preferredMethod, setPreferredMethod] = useState<'app' | 'sms' | 'email'>('app');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');
  const [email, setEmail] = useState('john.doe@example.com');
  
  // Mock QR code data
  const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/SchoolMS:john.doe@example.com?secret=JBSWY3DPEHPK3PXP&issuer=SchoolMS';
  
  // Mock recovery codes
  const recoveryCodes = [
    'ABCD-EFGH-IJKL-MNOP',
    'QRST-UVWX-YZAB-CDEF',
    'GHIJ-KLMN-OPQR-STUV',
    'WXYZ-1234-5678-9012',
    '3456-7890-ABCD-EFGH',
    'IJKL-MNOP-QRST-UVWX',
    'YZAB-CDEF-GHIJ-KLMN',
    'OPQR-STUV-WXYZ-1234'
  ];
  
  // Handle 2FA toggle
  const handleTwoFactorToggle = (checked: boolean) => {
    if (checked) {
      // Start 2FA setup process
      setIsEnabling(true);
      setCurrentSetupStep(1);
    } else {
      // Start 2FA disable process
      setIsDisabling(true);
    }
  };
  
  // Handle verification code input
  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and limit to 6 characters
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setVerificationCode(value);
  };
  
  // Handle verification code submission
  const handleVerifyCode = async () => {
    setIsVerifying(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (verificationCode === '123456') {
        // Success flow
        setTwoFactorEnabled(true);
        setIsEnabling(false);
        setCurrentSetupStep(0);
        setVerificationCode('');
        toast.success('Two-factor authentication enabled successfully!');
      } else {
        // Error flow
        toast.error('Invalid verification code. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to verify code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Handle disable 2FA
  const handleDisable2FA = async () => {
    setIsDisabling(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success flow
      setTwoFactorEnabled(false);
      setIsDisabling(false);
      toast.success('Two-factor authentication disabled successfully.');
    } catch (error) {
      toast.error('Failed to disable two-factor authentication.');
    } finally {
      setIsDisabling(false);
    }
  };
  
  // Handle preferred method change
  const handlePreferredMethodChange = (value: string) => {
    setPreferredMethod(value as 'app' | 'sms' | 'email');
  };
  
  // Handle phone number change
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };
  
  // Handle generate new recovery codes
  const handleGenerateRecoveryCodes = async () => {
    setIsGeneratingCodes(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success flow
      toast.success('New recovery codes generated successfully.');
      setShowRecoveryCodes(true);
    } catch (error) {
      toast.error('Failed to generate new recovery codes.');
    } finally {
      setIsGeneratingCodes(false);
    }
  };
  
  // Handle cancel setup
  const handleCancelSetup = () => {
    setIsEnabling(false);
    setCurrentSetupStep(0);
    setVerificationCode('');
  };
  
  // Handle copy secret key
  const handleCopySecretKey = () => {
    navigator.clipboard.writeText('JBSWY3DPEHPK3PXP');
    toast.success('Secret key copied to clipboard');
  };
  
  // Handle download recovery codes
  const handleDownloadRecoveryCodes = () => {
    const content = recoveryCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schoolms-recovery-codes.txt';
    document.body.appendChild(a);
    a.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success('Recovery codes downloaded');
  };
  
  // Render 2FA setup steps
  const renderSetupStep = () => {
    switch (currentSetupStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium text-lg">Step 1: Choose your preferred method</h3>
              <p className="text-muted-foreground text-sm">
                Select how you want to receive your two-factor authentication codes.
              </p>
              
              <Tabs 
                value={preferredMethod} 
                onValueChange={handlePreferredMethodChange}
                className="mt-4"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="app">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Authenticator App
                  </TabsTrigger>
                  <TabsTrigger value="sms">
                    <Smartphone className="h-4 w-4 mr-2" />
                    SMS
                  </TabsTrigger>
                  <TabsTrigger value="email">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="app" className="mt-4 space-y-4">
                  <p className="text-sm">
                    Use an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy to get verification codes.
                  </p>
                  <Button onClick={() => setCurrentSetupStep(2)} className="w-full sm:w-auto">
                    Continue with App
                  </Button>
                </TabsContent>
                
                <TabsContent value="sms" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={phoneNumber} 
                      onChange={handlePhoneNumberChange} 
                      placeholder="+1 (555) 123-4567" 
                    />
                    <p className="text-sm text-muted-foreground">
                      We'll send verification codes to this phone number when you sign in.
                    </p>
                  </div>
                  <Button onClick={() => setCurrentSetupStep(3)} className="w-full sm:w-auto">
                    Send Verification Code
                  </Button>
                </TabsContent>
                
                <TabsContent value="email" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      value={email} 
                      readOnly 
                      disabled 
                    />
                    <p className="text-sm text-muted-foreground">
                      We'll send verification codes to this email address when you sign in.
                    </p>
                  </div>
                  <Button onClick={() => setCurrentSetupStep(3)} className="w-full sm:w-auto">
                    Send Verification Code
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelSetup}>
                Cancel
              </Button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium text-lg">Step 2: Set up authenticator app</h3>
              
              <ol className="list-decimal pl-4 space-y-4 text-sm mb-4">
                <li>Open your authenticator app</li>
                <li>Tap the "+" icon to add a new account</li>
                <li>Scan the QR code below or enter the setup key manually</li>
                <li>The app will display a 6-digit code that changes every 30 seconds</li>
              </ol>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="flex-shrink-0 bg-white p-2 rounded-lg border max-w-fit">
                  <img src={qrCodeUrl} alt="QR Code" className="h-44 w-44" />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Manual setup code</Label>
                    <div className="flex items-center">
                      <Input 
                        value="JBSWY3DPEHPK3PXP" 
                        readOnly 
                        className="font-mono bg-muted"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleCopySecretKey}
                        title="Copy to clipboard"
                        className="ml-2"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      If you can't scan the QR code, enter this text code into your authenticator app.
                    </p>
                  </div>
                  
                  <Button onClick={() => setCurrentSetupStep(3)} className="w-full sm:w-auto">
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentSetupStep(1)}>
                Back
              </Button>
              <Button variant="outline" onClick={handleCancelSetup}>
                Cancel
              </Button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="font-medium text-lg">Step 3: Verify your setup</h3>
              <p className="text-muted-foreground text-sm">
                {preferredMethod === 'app' 
                  ? 'Enter the verification code displayed in your authenticator app.' 
                  : `Enter the verification code sent to your ${preferredMethod === 'sms' ? 'phone' : 'email'}.`}
              </p>
              
              <div className="space-y-2 max-w-xs">
                <Label htmlFor="verificationCode">6-digit verification code</Label>
                <Input 
                  id="verificationCode" 
                  value={verificationCode}
                  onChange={handleVerificationCodeChange}
                  placeholder="123456"
                  inputMode="numeric"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
                <p className="text-xs text-muted-foreground">
                  This verifies that your two-factor authentication is set up correctly.
                </p>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 p-3 rounded-md flex gap-2 text-sm">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
                <div>
                  <strong>Important:</strong> After verification, you'll be shown recovery codes. 
                  Store these in a safe place – they're needed if you lose access to your 
                  authentication method.
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setCurrentSetupStep(preferredMethod === 'app' ? 2 : 1)}
              >
                Back
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleCancelSetup}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleVerifyCode} 
                  disabled={verificationCode.length !== 6 || isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify and Enable'
                  )}
                </Button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
        <p className="text-muted-foreground">
          Add an extra layer of security to your account by requiring a verification code.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Main 2FA Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="space-y-1">
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Two-Factor Authentication (2FA)
                </CardTitle>
                <CardDescription>
                  Protect your account with an additional authentication step.
                </CardDescription>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="two-factor"
                  checked={twoFactorEnabled}
                  onCheckedChange={handleTwoFactorToggle}
                  disabled={isEnabling || isDisabling || isVerifying}
                />
                <Label htmlFor="two-factor" className="cursor-pointer">
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* 2FA Status */}
            {!isEnabling && (
              <div className={`p-4 rounded-lg flex items-start gap-3 mb-6 ${
                twoFactorEnabled 
                  ? 'bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-400' 
                  : 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400'
              }`}>
                {twoFactorEnabled ? (
                  <ShieldCheck className="h-5 w-5 flex-shrink-0 text-green-500" />
                ) : (
                  <ShieldAlert className="h-5 w-5 flex-shrink-0 text-amber-500" />
                )}
                <div>
                  <p className="font-medium">
                    {twoFactorEnabled 
                      ? 'Your account is protected with two-factor authentication' 
                      : 'Your account is not protected with two-factor authentication'}
                  </p>
                  <p className="text-sm mt-1">
                    {twoFactorEnabled 
                      ? 'Each time you sign in, you\'ll need your password and a verification code.' 
                      : 'Enable two-factor authentication for enhanced security.'}
                  </p>
                </div>
              </div>
            )}
            
            {/* 2FA Setup Process */}
            {isEnabling && renderSetupStep()}
            
            {/* 2FA Disable Confirmation */}
            {isDisabling && !isEnabling && (
              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 p-4 rounded-lg flex gap-3">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
                  <div>
                    <p className="font-medium">Are you sure you want to disable two-factor authentication?</p>
                    <p className="text-sm mt-1">
                      Your account will be less secure. Anyone with your password will be able to sign in.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDisabling(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDisable2FA}
                    disabled={isDisabling && !isVerifying}
                  >
                    {isDisabling && !isVerifying ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Disabling...
                      </>
                    ) : (
                      'Disable 2FA'
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            {/* 2FA Information */}
            {!isEnabling && !isDisabling && (
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Two-factor authentication adds an extra layer of security to your account by requiring 
                    a verification code in addition to your password when you sign in.
                  </span>
                </p>
                
                {!twoFactorEnabled && (
                  <p className="flex items-start gap-2 pt-2">
                    <Key className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      We recommend using an authenticator app like Google Authenticator, Microsoft Authenticator, 
                      or Authy for the most secure experience.
                    </span>
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recovery Codes Card - Only shown when 2FA is enabled */}
        {twoFactorEnabled && !isEnabling && !isDisabling && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Recovery Codes
              </CardTitle>
              <CardDescription>
                Use these codes if you lose access to your authentication device.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Recovery codes are used as a backup method if you lose access to your 
                authentication device. Each code can only be used once.
              </p>
              
              {showRecoveryCodes ? (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-md grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {recoveryCodes.map((code, index) => (
                      <code key={index} className="font-mono text-sm">{code}</code>
                    ))}
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 p-3 rounded-md flex gap-2 text-sm">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
                    <div>
                      <strong>Important:</strong> Store these recovery codes in a secure location. They won't be shown again.
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={handleDownloadRecoveryCodes}
                      className="text-sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Codes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowRecoveryCodes(false)}
                      className="text-sm"
                    >
                      Hide Codes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm">
                    Your recovery codes are hidden for security. 
                    You can view them at any time or generate new ones.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowRecoveryCodes(true)}
                      className="text-sm"
                    >
                      View Recovery Codes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleGenerateRecoveryCodes}
                      className="text-sm"
                      disabled={isGeneratingCodes}
                    >
                      {isGeneratingCodes ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Generate New Codes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Methods Card - Only shown when 2FA is enabled */}
        {twoFactorEnabled && !isEnabling && !isDisabling && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2" />
                Authentication Methods
              </CardTitle>
              <CardDescription>
                Manage your two-factor authentication methods.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="divide-y">
                <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-medium">Authenticator App</p>
                    <p className="text-sm text-muted-foreground">
                      Primary method
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
                
                <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-medium">Phone Number</p>
                    <p className="text-sm text-muted-foreground">
                      {phoneNumber}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
                
                <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-medium">Email Address</p>
                    <p className="text-sm text-muted-foreground">
                      {email}
                    </p>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Cannot be changed (Primary email)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 