import { Metadata } from 'next';
import ImportStudentsPage from './ImportStudentsPage';

export const metadata: Metadata = {
  title: 'Import Students - School Management System',
  description: 'Import students from Excel or CSV files',
};

export default function Page() {
  return <ImportStudentsPage />;
} 