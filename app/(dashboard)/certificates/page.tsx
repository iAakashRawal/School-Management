import { Card, Table, TableRow, TableCell, TableHead, TableHeaderCell, TableBody } from "@tremor/react"

const certificates = [
  {
    id: 1,
    studentName: "John Doe",
    rollNumber: "2024001",
    certificateType: "COMPLETION",
    certificateNumber: "CERT2024001",
    issueDate: "2024-03-15",
    class: "10th",
  },
  {
    id: 2,
    studentName: "Jane Smith",
    rollNumber: "2024002",
    certificateType: "ACHIEVEMENT",
    certificateNumber: "CERT2024002",
    issueDate: "2024-03-15",
    class: "10th",
  },
]

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Certificates</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate and manage student certificates
          </p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Generate Certificate
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <div className="sm:flex sm:items-center sm:justify-between sm:space-x-10">
            <div className="flex space-x-4">
              <div>
                <label htmlFor="certificateType" className="block text-sm font-medium text-gray-700">
                  Certificate Type
                </label>
                <select
                  id="certificateType"
                  name="certificateType"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option>All Types</option>
                  <option>COMPLETION</option>
                  <option>ACHIEVEMENT</option>
                  <option>TRANSFER</option>
                  <option>CHARACTER</option>
                  <option>SPORTS</option>
                </select>
              </div>
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
                <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
                  Issue Date Range
                </label>
                <input
                  type="date"
                  id="dateRange"
                  name="dateRange"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>
            </div>
          </div>

          <Table className="mt-6">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Student Name</TableHeaderCell>
                <TableHeaderCell>Roll Number</TableHeaderCell>
                <TableHeaderCell>Certificate Type</TableHeaderCell>
                <TableHeaderCell>Certificate Number</TableHeaderCell>
                <TableHeaderCell>Issue Date</TableHeaderCell>
                <TableHeaderCell>Class</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certificates.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell>{certificate.studentName}</TableCell>
                  <TableCell>{certificate.rollNumber}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {certificate.certificateType}
                    </span>
                  </TableCell>
                  <TableCell>{certificate.certificateNumber}</TableCell>
                  <TableCell>{certificate.issueDate}</TableCell>
                  <TableCell>{certificate.class}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        View
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Download
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900">
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