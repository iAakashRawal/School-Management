'use client';

import { Card, Table, TableRow, TableCell, TableHead, TableHeaderCell, TableBody } from "@tremor/react"
import { CreateMenu } from "@/components/ui/create-menu"
import Link from "next/link"

const marksheets = [
  {
    id: 1,
    studentName: "John Doe",
    rollNumber: "2024001",
    class: "10th",
    subject: "Mathematics",
    marks: 85,
    totalMarks: 100,
    examType: "MIDTERM",
    date: "2024-03-15",
  },
  {
    id: 2,
    studentName: "Jane Smith",
    rollNumber: "2024002",
    class: "10th",
    subject: "Physics",
    marks: 92,
    totalMarks: 100,
    examType: "MIDTERM",
    date: "2024-03-15",
  },
]

const createMenuItems = [
  {
    label: "Design Marksheet",
    href: "/marksheets/design",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    label: "Assign Marks",
    href: "/marksheets/assign",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
]

export default function MarksheetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Marksheets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage student marksheets
          </p>
        </div>
        <CreateMenu items={createMenuItems} label="Create" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <div className="sm:flex sm:items-center sm:justify-between sm:space-x-10">
            <div className="flex space-x-4">
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                  Class
                </label>
                <select
                  id="class"
                  name="class"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option>All Classes</option>
                  <option>10th</option>
                  <option>11th</option>
                  <option>12th</option>
                </select>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option>All Subjects</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                </select>
              </div>
              <div>
                <label htmlFor="examType" className="block text-sm font-medium text-gray-700">
                  Exam Type
                </label>
                <select
                  id="examType"
                  name="examType"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option>All Types</option>
                  <option>MIDTERM</option>
                  <option>FINAL</option>
                  <option>QUIZ</option>
                </select>
              </div>
            </div>
          </div>

          <Table className="mt-6">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Student Name</TableHeaderCell>
                <TableHeaderCell>Roll Number</TableHeaderCell>
                <TableHeaderCell>Class</TableHeaderCell>
                <TableHeaderCell>Subject</TableHeaderCell>
                <TableHeaderCell>Marks</TableHeaderCell>
                <TableHeaderCell>Total Marks</TableHeaderCell>
                <TableHeaderCell>Exam Type</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {marksheets.map((marksheet) => (
                <TableRow key={marksheet.id}>
                  <TableCell>{marksheet.studentName}</TableCell>
                  <TableCell>{marksheet.rollNumber}</TableCell>
                  <TableCell>{marksheet.class}</TableCell>
                  <TableCell>{marksheet.subject}</TableCell>
                  <TableCell>{marksheet.marks}</TableCell>
                  <TableCell>{marksheet.totalMarks}</TableCell>
                  <TableCell>{marksheet.examType}</TableCell>
                  <TableCell>{marksheet.date}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link
                        href={`/marksheets/${marksheet.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => window.print()}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Print
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
} 