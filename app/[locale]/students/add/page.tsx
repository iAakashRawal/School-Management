'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateStudent } from '@/lib/hooks/useStudents';
import { ArrowLeft } from 'lucide-react';

export default function AddStudentPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const createStudent = useCreateStudent();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    admissionNo: '',
    classId: '',
    rollNo: '',
    dateOfBirth: '',
    gender: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
  });

  // Dummy classes - in a real app, fetch these from API
  const classes = [
    { id: 'class1', name: 'Class 1', section: 'A' },
    { id: 'class2', name: 'Class 2', section: 'B' },
    { id: 'class3', name: 'Class 3', section: 'A' },
  ];

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await createStudent.mutateAsync(formData);
      alert(t('students.add_success'));
      router.push('/students');
    } catch (error) {
      console.error('Error creating student:', error);
      alert(t('students.add_error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/students">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{t('students.add')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('students.personal_info')}</h2>
            
            <div className="space-y-2">
              <Label htmlFor="name">{t('students.name')}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('students.email')}</Label>
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
              <Label htmlFor="password">{t('students.password')}</Label>
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
              <Label htmlFor="dateOfBirth">{t('students.date_of_birth')}</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">{t('students.gender')}</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('students.select_gender')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">{t('gender.male')}</SelectItem>
                  <SelectItem value="FEMALE">{t('gender.female')}</SelectItem>
                  <SelectItem value="OTHER">{t('gender.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('students.academic_info')}</h2>
            
            <div className="space-y-2">
              <Label htmlFor="admissionNo">{t('students.admission_no')}</Label>
              <Input
                id="admissionNo"
                name="admissionNo"
                value={formData.admissionNo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classId">{t('students.class')}</Label>
              <Select
                value={formData.classId}
                onValueChange={(value) => handleSelectChange('classId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('students.select_class')} />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name} - {classItem.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollNo">{t('students.roll_no')}</Label>
              <Input
                id="rollNo"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentName">{t('students.parent_name')}</Label>
              <Input
                id="parentName"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentPhone">{t('students.parent_phone')}</Label>
              <Input
                id="parentPhone"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentEmail">{t('students.parent_email')}</Label>
              <Input
                id="parentEmail"
                name="parentEmail"
                type="email"
                value={formData.parentEmail}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">{t('students.address')}</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/students">
            <Button variant="outline" type="button">
              {t('common.cancel')}
            </Button>
          </Link>
          <Button type="submit" disabled={createStudent.isPending}>
            {createStudent.isPending ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  );
} 