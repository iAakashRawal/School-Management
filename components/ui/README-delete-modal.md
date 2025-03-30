# Delete Alert Modal Component

A reusable confirmation modal for delete operations across all tables in the school management system.

## Features

- Consistent deletion confirmation UI across the application
- Customizable title, description, and item name
- Loading state support for async operations
- Responsive design for all screen sizes
- Accessible keyboard navigation and screen reader support

## Usage

```tsx
import { useState } from 'react';
import { DeleteAlertModal } from '@/components/ui/delete-alert-modal';

export default function YourComponent() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    
    setIsDeleting(true);
    
    try {
      // Your delete API call
      await deleteItem(selectedItem.id);
      
      // Update your local state
      // ...
      
      // Close modal
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Your component content */}
      <button onClick={() => handleDeleteClick(item)}>Delete</button>
      
      {/* Delete confirmation modal */}
      <DeleteAlertModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        itemName={selectedItem?.name}
        isLoading={isDeleting}
      />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | *required* | Controls the visibility of the modal |
| `onClose` | function | *required* | Function called when user cancels or closes the modal |
| `onConfirm` | function | *required* | Function called when user confirms deletion |
| `title` | string | "Confirm Deletion" | The modal's title |
| `description` | string | "Are you sure you want to delete this item? This action cannot be undone." | The modal's description text |
| `itemName` | string | undefined | The name of the item to be deleted (will be displayed in quotes) |
| `isLoading` | boolean | false | When true, disables buttons and shows loading state |

## Best Practices

1. Always include specific item information in the confirmation modal (e.g., "Delete student 'John Doe'?")
2. Use appropriate loading states during API operations
3. Handle errors gracefully and provide feedback to users
4. Make sure to clean up state after successful or failed operations 