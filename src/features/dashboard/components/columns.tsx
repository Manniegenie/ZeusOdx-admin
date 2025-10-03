"use client"
import React from "react";
import type { ColumnDef } from "@tanstack/react-table"
import type { User } from '@/features/users/types/user'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "_id",
    header: "User ID",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phonenumber",
    header: "Phone",
  },
  {
    accessorKey: "kycLevel",
    header: "KYC Level",
  },
  {
    accessorKey: "kycStatus",
    header: "KYC Status",
  },
  {
    accessorKey: "emailVerified",
    header: "Email Verified",
    cell: info => info.getValue() ? 'Yes' : 'No',
  },
  {
    accessorKey: "bvnVerified",
    header: "BVN Verified",
    cell: info => info.getValue() ? 'Yes' : 'No',
  },
  {
    accessorKey: "ngnbBalance",
    header: "NGNB Balance",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: info => new Date(info.getValue() as string).toLocaleString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);
      return (
        <div className="relative">
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="More actions"
          >
            {/* Use a MoreVertical icon from lucide-react or fallback to more-horizontal asset */}
            {/* If lucide-react is not installed, replace with an <img src> from assets */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setOpen(false);
                  // TODO: Implement disable 2fa logic here
                  alert(`Disable 2fa for ${row.original.email}`);
                }}
              >
                Disable 2fa
              </button>
            </div>
          )}
        </div>
      );
    },
  },
]