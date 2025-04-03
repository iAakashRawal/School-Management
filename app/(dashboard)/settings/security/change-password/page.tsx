'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { toast } from 'sonner';

// Password validation requirements
const passwordRequirements = [
  { id: 'length', label: 'At least 8 characters', regex: /.{8,}/ },
  { id: 'lowercase', label: 'At least one lowercase letter', regex: /[a-z]/ },
  { id: 'uppercase', label: 'At least one uppercase letter', regex: /[A-Z]/ },
  { id: 'number', label: 'At least one number', regex: /[0-9]/ },
  { id: 'special', label: 'At least one special character', regex: /[^a-zA-Z0-9]/ },
];

export default function ChangePasswordPage() {
  const [formState, setFormState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Calculate password strength as percentage (0-100)
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Add 20% for each met requirement
    passwordRequirements.forEach(req => {
      if (req.regex.test(password)) {
        strength += 20;
      }
    });
    
    return strength;
  };

  // Validate if all requirements are met
  const validatePassword = (password: string) => {
    return passwordRequirements.every(req => req.regex.test(password));
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Update password strength when new password changes
    if (name === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formState.newPassword !== formState.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    // Validate new password meets requirements
    if (!validatePassword(formState.newPassword)) {
      toast.error('New password does not meet all requirements');
      return;
    }
    
    // Show loading state
    setLoading(true);
    
    try {
      // Simulate API call to change password
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success flow
      toast.success('Password changed successfully');
      
      // Reset form
      setFormState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordStrength(0);
    } catch (error) {
      // Error handling
      toast.error('Failed to change password. Please try again.');
      console.error('Change password error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get color for strength bar
  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Check if passwords match
  const passwordsMatch = formState.newPassword && formState.confirmPassword && 
    formState.newPassword === formState.confirmPassword;
  
  // Check if passwords don't match
  const passwordsDontMatch = formState.confirmPassword && 
    formState.newPassword !== formState.confirmPassword;

  return (
    <div className="container max-w-3xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Change Password</h1>
        <p className="text-muted-foreground">Update your account password to keep your account secure</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Password Security</CardTitle>
          <CardDescription>
            Your password should be strong and unique. A strong password helps protect your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formState.currentPassword}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formState.newPassword}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {/* Password strength meter */}
              {formState.newPassword && (
                <div className="mt-2 space-y-2">
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor()} transition-all duration-300 ease-in-out`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center space-x-1">
                    <Info className="h-3 w-3" />
                    <span>
                      Password strength: 
                      {passwordStrength < 40 && " Weak"}
                      {passwordStrength >= 40 && passwordStrength < 80 && " Medium"}
                      {passwordStrength >= 80 && " Strong"}
                    </span>
                  </p>
                  
                  <div className="space-y-1 mt-2">
                    <p className="text-xs font-medium">Password requirements:</p>
                    <ul className="space-y-1">
                      {passwordRequirements.map(req => (
                        <li key={req.id} className="text-xs flex items-center space-x-2">
                          {req.regex.test(formState.newPassword) ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className={req.regex.test(formState.newPassword) 
                            ? "text-green-500 dark:text-green-400" 
                            : "text-muted-foreground"}>
                            {req.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formState.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className={`pr-10 ${passwordsDontMatch ? 'border-red-500 focus-visible:ring-red-500' : passwordsMatch ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                
                {/* Password match indicator */}
                {passwordsMatch && (
                  <div className="flex items-center mt-1 text-green-500 dark:text-green-400 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    <span>Passwords match</span>
                  </div>
                )}
                
                {passwordsDontMatch && (
                  <div className="flex items-center mt-1 text-red-500 dark:text-red-400 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>Passwords do not match</span>
                  </div>
                )}
              </div>
            </div>
          
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full sm:w-auto" 
                disabled={
                  loading || 
                  !formState.currentPassword || 
                  !formState.newPassword || 
                  !formState.confirmPassword ||
                  passwordsDontMatch ||
                  !validatePassword(formState.newPassword)
                }
              >
                {loading ? "Updating Password..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start border-t bg-gray-50 dark:bg-gray-800/50 p-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Info className="h-4 w-4 mr-2" />
            <p>
              After changing your password, you'll be asked to log in again on all your devices.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 