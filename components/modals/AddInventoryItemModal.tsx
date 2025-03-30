'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface AddInventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemData: InventoryItem) => void;
}

export interface InventoryItem {
  id?: string;
  name: string;
  itemCode: string;
  category: string;
  unit: string;
  unitPrice: number;
  totalQuantity: number;
  minQuantity: number;
  supplier: string;
  location: string;
  description: string;
}

export default function AddInventoryItemModal({ isOpen, onClose, onSubmit }: AddInventoryItemModalProps) {
  const [itemData, setItemData] = useState<InventoryItem>({
    name: '',
    itemCode: '',
    category: 'Stationery',
    unit: 'Piece',
    unitPrice: 0,
    totalQuantity: 0,
    minQuantity: 0,
    supplier: '',
    location: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setItemData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setItemData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItemData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(itemData);
    setItemData({
      name: '',
      itemCode: '',
      category: 'Stationery',
      unit: 'Piece',
      unitPrice: 0,
      totalQuantity: 0,
      minQuantity: 0,
      supplier: '',
      location: '',
      description: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Inventory Item</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new item to the inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                value={itemData.name}
                onChange={handleChange}
                placeholder="Enter item name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemCode">Item Code <span className="text-red-500">*</span></Label>
              <Input
                id="itemCode"
                name="itemCode"
                value={itemData.itemCode}
                onChange={handleChange}
                placeholder="e.g., INV-001"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                value={itemData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Stationery">Stationery</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Lab Equipment">Lab Equipment</SelectItem>
                  <SelectItem value="Sports Equipment">Sports Equipment</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Cleaning Supplies">Cleaning Supplies</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                name="unit"
                value={itemData.unit}
                onValueChange={(value) => handleSelectChange('unit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Piece">Piece</SelectItem>
                  <SelectItem value="Box">Box</SelectItem>
                  <SelectItem value="Dozen">Dozen</SelectItem>
                  <SelectItem value="Kg">Kg</SelectItem>
                  <SelectItem value="Liter">Liter</SelectItem>
                  <SelectItem value="Meter">Meter</SelectItem>
                  <SelectItem value="Set">Set</SelectItem>
                  <SelectItem value="Pack">Pack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price (₹) <span className="text-red-500">*</span></Label>
              <Input
                id="unitPrice"
                name="unitPrice"
                type="number"
                value={itemData.unitPrice}
                onChange={handleNumberChange}
                min={0}
                step={0.01}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalQuantity">Total Quantity <span className="text-red-500">*</span></Label>
              <Input
                id="totalQuantity"
                name="totalQuantity"
                type="number"
                value={itemData.totalQuantity}
                onChange={handleNumberChange}
                min={0}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minQuantity">Minimum Quantity</Label>
              <Input
                id="minQuantity"
                name="minQuantity"
                type="number"
                value={itemData.minQuantity}
                onChange={handleNumberChange}
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                name="supplier"
                value={itemData.supplier}
                onChange={handleChange}
                placeholder="Supplier name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Storage Location</Label>
              <Input
                id="location"
                name="location"
                value={itemData.location}
                onChange={handleChange}
                placeholder="e.g., Storeroom A, Shelf 3"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={itemData.description}
              onChange={handleChange}
              placeholder="Brief description of the item"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 