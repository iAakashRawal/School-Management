# Delete Components

This document outlines the delete functionality components available in the school management system.

## Components Overview

There are two main components for handling deletion:

1. **DeleteAlertModal** - A reusable confirmation modal for delete operations
2. **DeleteButton** - A wrapper component that includes the button and modal logic together

## 1. DeleteAlertModal Component

A standalone confirmation modal for delete operations across all tables in the application.

### Features

- Consistent deletion confirmation UI
- Customizable title, description, and item name
- Loading state support for async operations
- Responsive design and accessible

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | *required* | Controls the visibility of the modal |
| `onClose` | function | *required* | Function called when user cancels or closes the modal |
| `onConfirm` | function | *required* | Function called when user confirms deletion |
| `title` | string | "Confirm Deletion" | The modal's title |
| `description` | string | "Are you sure you want to delete this item? This action cannot be undone." | The modal's description text |
| `itemName` | string | undefined | The name of the item to be deleted (displayed in quotes) |
| `isLoading` | boolean | false | When true, disables buttons and shows loading state |

### Usage Example

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
      <button onClick={() => handleDeleteClick(item)}>Delete</button>
      
      <DeleteAlertModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        description="Are you sure you want to delete this item?"
        itemName={selectedItem?.name}
        isLoading={isDeleting}
      />
    </>
  );
}
```

## 2. DeleteButton Component

A higher-level component that combines the delete button and confirmation modal into one reusable package.

### Features

- Encapsulates all deletion logic in one component
- Can be styled as either a button or a link
- Handles confirmation and loading states internally
- Provides the same customization options as the modal

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `item` | T | *required* | The item to be deleted (passed to your onDelete handler) |
| `itemName` | string | *required* | The name of the item to display in the confirmation modal |
| `onDelete` | function | *required* | Function called when deletion is confirmed (receives item as parameter) |
| `buttonVariant` | 'button' \| 'link' | 'button' | The visual style of the delete trigger |
| `modalTitle` | string | "Delete Item" | The title of the confirmation modal |
| `modalDescription` | string | "Are you sure you want to delete this item? This action cannot be undone." | The description in the modal |

### Usage Example

```tsx
import { useState } from 'react';
import { DeleteButton } from '@/components/ui/delete-button';

export default function ExampleTable() {
  const [items, setItems] = useState([
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ]);

  const handleDeleteItem = (itemToDelete) => {
    // Simply update your state - no need to manage modals or loading states
    setItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>
              <DeleteButton 
                item={item}
                itemName={item.name}
                onDelete={handleDeleteItem}
                modalTitle="Delete Item"
                modalDescription="Are you sure you want to delete this item?"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Best Practices

1. **Use DeleteButton for simple cases** - When you just need a delete button with confirmation
2. **Use DeleteAlertModal for complex flows** - When you need more control over the deletion process
3. **Always include specific item information** in the confirmation modal
4. **Consider user feedback** for successful/failed operations
5. **Use appropriate loading states** during API operations 