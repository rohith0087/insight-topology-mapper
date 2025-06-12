
import React from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Profile } from './userManagementUtils';

interface UserDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: Profile | null;
  onConfirm: () => void;
}

const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({
  open,
  onOpenChange,
  selectedUser,
  onConfirm
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-800 border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Confirm User Deletion</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-300">
            Are you sure you want to deactivate <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong> ({selectedUser?.email})?
            <br /><br />
            This action will:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Immediately revoke their access to the system</li>
              <li>Prevent them from logging in</li>
              <li>Remove them from all active sessions</li>
            </ul>
            <br />
            <strong className="text-red-400">This action cannot be easily undone.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-600 text-white hover:bg-slate-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Deactivate User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserDeleteDialog;
