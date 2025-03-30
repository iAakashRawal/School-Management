'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/form/input';
import { Select } from '@/components/ui/form/select';
import { DatePicker } from '@/components/ui/form/date-picker';

interface StudentFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  aadhaarNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  class: string;
  section: string;
  rollNumber: string;
  admissionNumber: string;
  admissionDate: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail: string;
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
}

const initialFormData: StudentFormData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  aadhaarNumber: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  country: '',
  class: '',
  section: '',
  rollNumber: '',
  admissionNumber: '',
  admissionDate: '',
  guardianName: '',
  guardianRelation: '',
  guardianPhone: '',
  guardianEmail: '',
  fatherName: '',
  fatherOccupation: '',
  fatherPhone: '',
  motherName: '',
  motherOccupation: '',
  motherPhone: '',
};

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const bloodGroupOptions = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
];

const classOptions = [
  { value: '1', label: 'Class 1' },
  { value: '2', label: 'Class 2' },
  { value: '3', label: 'Class 3' },
  { value: '4', label: 'Class 4' },
  { value: '5', label: 'Class 5' },
  { value: '6', label: 'Class 6' },
  { value: '7', label: 'Class 7' },
  { value: '8', label: 'Class 8' },
  { value: '9', label: 'Class 9' },
  { value: '10', label: 'Class 10' },
];

const sectionOptions = [
  { value: 'A', label: 'Section A' },
  { value: 'B', label: 'Section B' },
  { value: 'C', label: 'Section C' },
  { value: 'D', label: 'Section D' },
];

export default function AddStudentPage() {
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);

  const handleChange = (field: keyof StudentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form data:', formData);
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Add New Student</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Fill in the student&apos;s information below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(value) => handleChange('firstName', value)}
                  required
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(value) => handleChange('lastName', value)}
                  required
                />
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={(value) => handleChange('dateOfBirth', value)}
                  required
                />
                <Select
                  label="Gender"
                  value={formData.gender}
                  onChange={(value) => handleChange('gender', value)}
                  options={genderOptions}
                  required
                />
                <Select
                  label="Blood Group"
                  value={formData.bloodGroup}
                  onChange={(value) => handleChange('bloodGroup', value)}
                  options={bloodGroupOptions}
                  required
                />
                <Input
                  label="Aadhaar Number"
                  value={formData.aadhaarNumber}
                  onChange={(value) => handleChange('aadhaarNumber', value)}
                  pattern="[0-9]{12}"
                  required
                />
                <Input
                  label="Email"
                  value={formData.email}
                  onChange={(value) => handleChange('email', value)}
                  type="email"
                  required
                />
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(value) => handleChange('phone', value)}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(value) => handleChange('address', value)}
                  required
                />
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(value) => handleChange('city', value)}
                  required
                />
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(value) => handleChange('state', value)}
                  required
                />
                <Input
                  label="Pincode"
                  value={formData.pincode}
                  onChange={(value) => handleChange('pincode', value)}
                  pattern="[0-9]{6}"
                  required
                />
                <Input
                  label="Country"
                  value={formData.country}
                  onChange={(value) => handleChange('country', value)}
                  required
                />
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Class"
                  value={formData.class}
                  onChange={(value) => handleChange('class', value)}
                  options={classOptions}
                  required
                />
                <Select
                  label="Section"
                  value={formData.section}
                  onChange={(value) => handleChange('section', value)}
                  options={sectionOptions}
                  required
                />
                <Input
                  label="Roll Number"
                  value={formData.rollNumber}
                  onChange={(value) => handleChange('rollNumber', value)}
                  required
                />
                <Input
                  label="Admission Number"
                  value={formData.admissionNumber}
                  onChange={(value) => handleChange('admissionNumber', value)}
                  required
                />
                <DatePicker
                  label="Admission Date"
                  value={formData.admissionDate}
                  onChange={(value) => handleChange('admissionDate', value)}
                  required
                />
              </div>
            </div>

            {/* Guardian Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Guardian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Guardian Name"
                  value={formData.guardianName}
                  onChange={(value) => handleChange('guardianName', value)}
                  required
                />
                <Input
                  label="Relation with Student"
                  value={formData.guardianRelation}
                  onChange={(value) => handleChange('guardianRelation', value)}
                  required
                />
                <Input
                  label="Guardian Phone"
                  value={formData.guardianPhone}
                  onChange={(value) => handleChange('guardianPhone', value)}
                  pattern="[0-9]{10}"
                  required
                />
                <Input
                  label="Guardian Email"
                  value={formData.guardianEmail}
                  onChange={(value) => handleChange('guardianEmail', value)}
                  type="email"
                  required
                />
              </div>
            </div>

            {/* Parent Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Parent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Father's Name"
                  value={formData.fatherName}
                  onChange={(value) => handleChange('fatherName', value)}
                  required
                />
                <Input
                  label="Father's Occupation"
                  value={formData.fatherOccupation}
                  onChange={(value) => handleChange('fatherOccupation', value)}
                  required
                />
                <Input
                  label="Father's Phone"
                  value={formData.fatherPhone}
                  onChange={(value) => handleChange('fatherPhone', value)}
                  pattern="[0-9]{10}"
                  required
                />
                <Input
                  label="Mother's Name"
                  value={formData.motherName}
                  onChange={(value) => handleChange('motherName', value)}
                  required
                />
                <Input
                  label="Mother's Occupation"
                  value={formData.motherOccupation}
                  onChange={(value) => handleChange('motherOccupation', value)}
                  required
                />
                <Input
                  label="Mother's Phone"
                  value={formData.motherPhone}
                  onChange={(value) => handleChange('motherPhone', value)}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 