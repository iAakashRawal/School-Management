'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

// Default user data - don't change during hydration
const defaultUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  role: 'Administrator',
  department: 'Information Technology',
  joinDate: 'January 15, 2023',
  address: '123 School Street, Education City, EC 12345',
  bio: 'Passionate education administrator with 10+ years of experience in school management systems.',
  avatar: '/avatars/user.png',
  birthDate: '1985-05-15'
};

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(defaultUser);
  const [form, setForm] = useState(defaultUser);
  
  // Handle mounting - important to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(form);
    setIsEditing(false);
    toast.success('Profile information updated successfully!');
  };
  
  const handleCancel = () => {
    setForm({ ...user });
    setIsEditing(false);
  };
  
  // Don't render content until after hydration
  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-muted-foreground">Loading profile information...</p>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile Information</h1>
        <p className="text-muted-foreground">Manage your personal profile information and settings</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Avatar Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 relative">
              <Avatar className="w-full h-full">
                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2 w-full">
              <Button variant="outline" className="w-full text-sm">Change Picture</Button>
              <Button variant="ghost" className="w-full text-sm">Remove</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* User Info Card */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Personal Information</CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={form.firstName} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={form.lastName} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input 
                      id="role" 
                      name="role" 
                      value={form.role} 
                      onChange={handleChange} 
                      readOnly 
                      disabled 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      id="department" 
                      name="department" 
                      value={form.department} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Input 
                      id="birthDate" 
                      name="birthDate" 
                      type="date" 
                      value={form.birthDate} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input 
                      id="joinDate" 
                      name="joinDate" 
                      value={form.joinDate} 
                      onChange={handleChange} 
                      readOnly 
                      disabled 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={form.address} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input 
                    id="bio" 
                    name="bio" 
                    value={form.bio} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                    <div>{user.firstName} {user.lastName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Email</div>
                    <div>{user.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Phone</div>
                    <div>{user.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Role</div>
                    <div>{user.role}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Department</div>
                    <div>{user.department}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Join Date</div>
                    <div>{user.joinDate}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Birth Date</div>
                    <div>{new Date(user.birthDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Address</div>
                  <div>{user.address}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Bio</div>
                  <div>{user.bio}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 