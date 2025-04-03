'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateClass } from '@/lib/hooks/useClasses';
import { ArrowLeft } from 'lucide-react';

export default function AddClassPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const createClass = useCreateClass();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    section: '',
    academicYear: new Date().getFullYear().toString(),
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createClass.mutateAsync(formData);
      alert(t('classes.add_success'));
      router.push('/classes');
    } catch (error) {
      console.error('Error creating class:', error);
      alert(t('classes.add_error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/classes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{t('classes.add')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('classes.name')}</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('classes.name_placeholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section">{t('classes.section')}</Label>
            <Input
              id="section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder={t('classes.section_placeholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicYear">{t('classes.academic_year')}</Label>
            <Input
              id="academicYear"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              placeholder={t('classes.academic_year_placeholder')}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/classes">
            <Button variant="outline" type="button">
              {t('common.cancel')}
            </Button>
          </Link>
          <Button type="submit" disabled={createClass.isPending}>
            {createClass.isPending ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  );
} 