'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteAlertModal } from '@/components/ui/delete-alert-modal';

interface DeleteButtonProps<T> {
  item: T;
  itemName: string;
  onDelete: (item: T) => void;
  buttonVariant?: 'button' | 'link';
  modalTitle?: string;
  modalDescription?: string;
}

export function DeleteButton<T>({
  item,
  itemName,
  onDelete,
  buttonVariant = 'button',
  modalTitle = 'Delete Item',
  modalDescription = 'Are you sure you want to delete this item? This action cannot be undone.',
}: DeleteButtonProps<T>) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent onClick handlers from firing
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the onDelete handler provided by the parent
      onDelete(item);
      
      // Close the modal
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting item:', error);
      // Handle error (could show an error toast here)
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {buttonVariant === 'button' ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteClick}
          className="flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      ) : (
        <button
          onClick={handleDeleteClick}
          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
        >
          Delete
        </button>
      )}

      <DeleteAlertModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={modalTitle}
        description={modalDescription}
        itemName={itemName}
        isLoading={isDeleting}
      />
    </>
  );
} 