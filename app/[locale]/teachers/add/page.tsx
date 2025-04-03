'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTeacher } from '@/lib/hooks/useTeachers';
import { ArrowLeft } from 'lucide-react';

export default function AddTeacherPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const createTeacher = useCreateTeacher();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    qualification: '',
    specialization: '',
    joiningDate: '',
    phone: '',
    address: '',
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createTeacher.mutateAsync(formData);
      alert(t('teachers.add_success'));
      router.push('/teachers');
    } catch (error) {
      console.error('Error creating teacher:', error);
      alert(t('teachers.add_error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/teachers">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{t('teachers.add')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('teachers.personal_info')}</h2>
            
            <div className="space-y-2">
              <Label htmlFor="name">{t('teachers.name')}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('teachers.email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('teachers.password')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('teachers.phone')}</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t('teachers.phone_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t('teachers.address')}</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={t('teachers.address_placeholder')}
                rows={3}
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('teachers.professional_info')}</h2>
            
            <div className="space-y-2">
              <Label htmlFor="employeeId">{t('teachers.employee_id')}</Label>
              <Input
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualification">{t('teachers.qualification')}</Label>
              <Input
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder={t('teachers.qualification_placeholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">{t('teachers.specialization')}</Label>
              <Input
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder={t('teachers.specialization_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="joiningDate">{t('teachers.joining_date')}</Label>
              <Input
                id="joiningDate"
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/teachers">
            <Button variant="outline" type="button">
              {t('common.cancel')}
            </Button>
          </Link>
          <Button type="submit" disabled={createTeacher.isPending}>
            {createTeacher.isPending ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  );
} 