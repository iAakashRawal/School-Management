'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/form/input';
import { Select } from '@/components/ui/form/select';
import { DatePicker } from '@/components/ui/form/date-picker';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';

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

// Sample student data for ID 1 (John Doe) and ID 2 (Jane Smith)
const sampleStudents = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "2008-05-15",
    gender: "male",
    bloodGroup: "O+",
    aadhaarNumber: "987654321012",
    email: "john.doe@example.com",
    phone: "9876543210",
    address: "123 School Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    country: "India",
    class: "10",
    section: "A",
    rollNumber: "2024001",
    admissionNumber: "ADM001",
    admissionDate: "2023-06-10",
    guardianName: "Robert Doe",
    guardianRelation: "Father",
    guardianPhone: "9876543211",
    guardianEmail: "robert.doe@example.com",
    fatherName: "Robert Doe",
    fatherOccupation: "Engineer",
    fatherPhone: "9876543211",
    motherName: "Sarah Doe",
    motherOccupation: "Doctor",
    motherPhone: "9876543212",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    dateOfBirth: "2008-07-20",
    gender: "female",
    bloodGroup: "B+",
    aadhaarNumber: "876543210123",
    email: "jane.smith@example.com",
    phone: "8765432101",
    address: "456 College Road",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    country: "India",
    class: "10",
    section: "B",
    rollNumber: "2024002",
    admissionNumber: "ADM002",
    admissionDate: "2023-06-12",
    guardianName: "Michael Smith",
    guardianRelation: "Father",
    guardianPhone: "8765432102",
    guardianEmail: "michael.smith@example.com",
    fatherName: "Michael Smith",
    fatherOccupation: "Business",
    fatherPhone: "8765432102",
    motherName: "Emily Smith",
    motherOccupation: "Teacher",
    motherPhone: "8765432103",
  },
];

export default function EditStudentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, you would fetch the student data from an API
    // For demonstration purposes, we'll use the sample data
    const studentId = parseInt(params.id);
    const student = sampleStudents.find(s => s.id === studentId);
    
    if (student) {
      setFormData(student);
      setLoading(false);
    } else {
      setError("Student not found");
      setLoading(false);
    }
  }, [params.id]);

  const handleChange = (field: keyof StudentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - in a real app, this would be an API call
    console.log('Updated student data:', formData);
    
    // Show success message
    alert("Student information updated successfully!");
    
    // Redirect back to students list
    router.push('/students');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 text-xl">{error}</div>
        <Link href="/students" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
          Return to Students List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-slate-100 shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Edit Student</h1>
              <p className="mt-1 text-sm text-gray-500">
                Update the student&apos;s information below
              </p>
            </div>
            <Link href="/students">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Students
              </Button>
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
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
                  label="Guardian Relation"
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
                />
                <Input
                  label="Father's Occupation"
                  value={formData.fatherOccupation}
                  onChange={(value) => handleChange('fatherOccupation', value)}
                />
                <Input
                  label="Father's Phone"
                  value={formData.fatherPhone}
                  onChange={(value) => handleChange('fatherPhone', value)}
                  pattern="[0-9]{10}"
                />
                <Input
                  label="Mother's Name"
                  value={formData.motherName}
                  onChange={(value) => handleChange('motherName', value)}
                />
                <Input
                  label="Mother's Occupation"
                  value={formData.motherOccupation}
                  onChange={(value) => handleChange('motherOccupation', value)}
                />
                <Input
                  label="Mother's Phone"
                  value={formData.motherPhone}
                  onChange={(value) => handleChange('motherPhone', value)}
                  pattern="[0-9]{10}"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Link href="/students">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 