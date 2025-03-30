'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookData: Book) => void;
}

export interface Book {
  id?: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  category: string;
  subject: string;
  publicationYear: number;
  edition: string;
  totalCopies: number;
  availableCopies?: number;
  location: string;
  description: string;
}

export default function AddBookModal({ isOpen, onClose, onSubmit }: AddBookModalProps) {
  const [bookData, setBookData] = useState<Book>({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    category: 'Academic',
    subject: 'Mathematics',
    publicationYear: new Date().getFullYear(),
    edition: '',
    totalCopies: 1,
    location: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setBookData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(bookData);
    setBookData({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      category: 'Academic',
      subject: 'Mathematics',
      publicationYear: new Date().getFullYear(),
      edition: '',
      totalCopies: 1,
      location: '',
      description: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Book</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new book to the library catalog.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Book Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={bookData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author <span className="text-red-500">*</span></Label>
              <Input
                id="author"
                name="author"
                value={bookData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN <span className="text-red-500">*</span></Label>
              <Input
                id="isbn"
                name="isbn"
                value={bookData.isbn}
                onChange={handleChange}
                placeholder="e.g., 9781234567897"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                name="publisher"
                value={bookData.publisher}
                onChange={handleChange}
                placeholder="Publishing company"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                value={bookData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Fiction">Fiction</SelectItem>
                  <SelectItem value="Reference">Reference</SelectItem>
                  <SelectItem value="Magazine">Magazine</SelectItem>
                  <SelectItem value="Biography">Biography</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                name="subject"
                value={bookData.subject}
                onValueChange={(value) => handleSelectChange('subject', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Literature">Literature</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publicationYear">Publication Year</Label>
              <Input
                id="publicationYear"
                name="publicationYear"
                type="number"
                value={bookData.publicationYear}
                onChange={handleNumberChange}
                min={1900}
                max={new Date().getFullYear()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edition">Edition</Label>
              <Input
                id="edition"
                name="edition"
                value={bookData.edition}
                onChange={handleChange}
                placeholder="e.g., 2nd"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalCopies">Total Copies <span className="text-red-500">*</span></Label>
              <Input
                id="totalCopies"
                name="totalCopies"
                type="number"
                value={bookData.totalCopies}
                onChange={handleNumberChange}
                min={1}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Shelf Location</Label>
            <Input
              id="location"
              name="location"
              value={bookData.location}
              onChange={handleChange}
              placeholder="e.g., Shelf A-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={bookData.description}
              onChange={handleChange}
              placeholder="Brief description of the book"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 