import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Progress,
} from '@nextui-org/react';
import { read, utils } from 'xlsx';
import { EXPECTED_COLUMNS } from '@/app/api/students/import/route';
import { toast } from 'react-hot-toast';
import { Upload } from 'lucide-react';

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicYear: string;
}

export default function ImportStudentsModal({
  isOpen,
  onClose,
  academicYear,
}: ImportStudentsModalProps) {
  const [step, setStep] = useState(1);
  const [fileData, setFileData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string>('');

  // File drop handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          toast.error('Error reading file');
          return;
        }

        const workbook = read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(firstSheet);
        
        if (jsonData.length === 0) {
          toast.error('No data found in the file');
          return;
        }

        // Get headers from the first row
        const fileHeaders = Object.keys(jsonData[0]);
        setHeaders(fileHeaders);
        setFileData(jsonData);
        setStep(2);

        // Try to auto-map columns based on header names
        const autoMappings: Record<string, string> = {};
        Object.entries(EXPECTED_COLUMNS).forEach(([key, expectedHeader]) => {
          const match = fileHeaders.find(
            (h) => h.toLowerCase() === expectedHeader.toLowerCase()
          );
          if (match) {
            autoMappings[key] = match;
          }
        });
        setMappings(autoMappings);

        toast.success('File uploaded successfully');
      } catch (error) {
        toast.error('Error reading file');
        console.error('Error reading file:', error);
      }
    };

    reader.onerror = () => {
      toast.error('Error reading file');
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    multiple: false,
    maxSize: 5242880, // 5MB
  });

  // Handle column mapping change
  const handleMappingChange = (key: string, value: string) => {
    setMappings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset form
  const handleReset = () => {
    setStep(1);
    setFileData([]);
    setHeaders([]);
    setMappings({});
    setFileName('');
    setProgress(0);
  };

  // Import students
  const handleImport = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/students/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mappings,
          students: fileData,
          academicYear,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Successfully imported ${result.data.success} students`);
        if (result.data.failed > 0) {
          toast.error(`Failed to import ${result.data.failed} students`);
          console.error('Import errors:', result.data.errors);
        }
        onClose();
        handleReset();
      } else {
        toast.error(result.message || 'Failed to import students');
      }
    } catch (error) {
      toast.error('Error importing students');
      console.error('Error importing students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {
        onClose();
        handleReset();
      }} 
      size="3xl"
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold">
            Import Students - Step {step} of 2
          </h2>
        </ModalHeader>
        <ModalBody>
          {step === 1 ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <div className="text-lg">
                  {isDragActive
                    ? 'Drop the file here'
                    : fileName 
                      ? `Selected file: ${fileName}`
                      : 'Drag and drop your Excel/CSV file here, or click to select'}
                </div>
                <div className="text-sm text-gray-500">
                  Supported formats: .xlsx, .xls, .csv (max 5MB)
                </div>
                {fileName && (
                  <Button
                    color="primary"
                    variant="light"
                    onPress={handleReset}
                  >
                    Choose Different File
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-sm text-gray-500">
                Map the columns from your file to the required fields
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(EXPECTED_COLUMNS).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium">
                      {label}
                      {['name', 'email', 'admissionNo'].includes(key) && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <Select
                      value={mappings[key]}
                      onChange={(e) => handleMappingChange(key, e.target.value)}
                      isRequired={['name', 'email', 'admissionNo'].includes(key)}
                    >
                      <SelectItem value="">Select column</SelectItem>
                      {headers.map((header) => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>
              {isLoading && (
                <Progress
                  value={progress}
                  className="w-full"
                  aria-label="Import progress"
                />
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={() => {
              onClose();
              handleReset();
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          {step === 2 && (
            <Button
              color="primary"
              onPress={handleImport}
              isLoading={isLoading}
              disabled={
                isLoading ||
                !mappings.name ||
                !mappings.email ||
                !mappings.admissionNo
              }
            >
              Import Students
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 