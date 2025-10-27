"use client"
import type { ColumnDef } from "@tanstack/react-table"
import type { CryptoFee } from "../type/fee";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteCryptoFee } from '../store/cryptoFeeSlice';
import type { AppDispatch } from '@/core/store/store';
import { toast } from 'sonner';

// Delete button component
const DeleteButton = ({ fee }: { fee: CryptoFee }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the ${fee.currency} ${fee.network} fee?`)) {
      return;
    }

    try {
      setDeleting(true);
      await dispatch(deleteCryptoFee({ 
        currency: fee.currency, 
        network: fee.network 
      })).unwrap();
      toast.success('Crypto fee deleted successfully');
    } catch (err: any) {
      console.error('Delete failed', err);
      const errorMessage = err?.response?.data?.message || 'Failed to delete crypto fee';
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Button 
      size="sm" 
      variant="destructive" 
      onClick={handleDelete}
      disabled={deleting}
    >
      {deleting ? 'Deleting...' : 'Delete'}
    </Button>
  );
};

export const columns: ColumnDef<CryptoFee>[] = [
  {
    accessorKey: "currency",
    header: "Currency",
  },
  {
    accessorKey: "network",
    header: "Network",
  },
  {
    accessorKey: "networkName",
    header: "Network name",
  },
  {
    accessorKey: "networkFee",
    header: "Fee (Token)",
    cell: ({ row }) => {
      const fee = row.original as CryptoFee;
      return `${fee.networkFee} ${fee.currency}`;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const fee = row.original as CryptoFee;
      return (
        <div className="flex items-center gap-2">
          <Link to={`/fees-rates/view/${fee.currency}/${encodeURIComponent(fee.network)}`} state={{ fee }}>
            <Button size="sm" variant="ghost">View</Button>
          </Link>
          <Link to="/fees-rates/edit-fee" state={{ fee }}>
            <Button size="sm" variant="outline">Edit</Button>
          </Link>
          <Link to="/fees-rates/edit-network-name" state={{ fee }}>
            <Button size="sm">Edit Name</Button>
          </Link>
          <DeleteButton fee={fee} />
        </div>
      );
    },
  },
];