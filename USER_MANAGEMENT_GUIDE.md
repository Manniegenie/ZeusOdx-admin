# User Management - Simplified Actions Guide

## Overview
The user management actions have been streamlined to provide a cleaner, more organized interface that directly maps to your backend endpoints.

## What Changed

### Before
- **9 action buttons** crammed into a dropdown menu
- Cluttered interface with wallet status dialogs
- Hard to navigate and find specific actions
- Not clearly organized by function

### After
- **3 simple buttons** in the Actions menu:
  1. **Manage User** - Opens comprehensive actions page
  2. **View Summary** - Quick access to user summary
  3. **Delete User** - Destructive action (with confirmation)

## New User Actions Page

### Location
`/user-management/actions`

### Features
A beautifully organized page with all user management actions grouped by category:

#### 1. User Information
- **View Summary**: Complete user profile, wallets & balances
  - Endpoint: `GET /usermanagement/summary?email={email}`

#### 2. Security Management
- **Disable 2FA**: Remove two-factor authentication
  - Endpoint: `PATCH /2FA-Disable/disable-2fa`
- **Remove Password**: Reset user password/PIN
  - Endpoint: `PATCH /delete-pin/remove-passwordpin`

#### 3. Wallet Operations
- **View Wallets**: Check wallet addresses & balances
  - Endpoint: `POST /admin/wallets/fetch`
- **Generate Wallets**: Create new wallet addresses
  - Endpoint: `POST /updateuseraddress/generate-wallets-by-phone`
- **Regenerate Wallets**: Recreate existing wallet addresses
  - Endpoint: `PATCH /updateuseraddress/regenerate-by-phone`
- **Check Status**: View wallet generation progress
  - Endpoint: `GET /updateuseraddress/status-by-phone?phonenumber={phone}`

#### 4. Balance Management
- **Wipe Pending Balance**: Clear pending balances for currencies
  - Endpoint: `POST /pending/wipe`

#### 5. Danger Zone
- **Delete User**: Permanently remove user account
  - Endpoint: `DELETE /deleteuser/user`

## Backend Endpoints Reference

### User Management Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/usermanagement/users` | List users with filters |
| GET | `/usermanagement/summary?email={email}` | Get complete user summary |
| PATCH | `/2FA-Disable/disable-2fa` | Disable 2FA |
| PATCH | `/delete-pin/remove-passwordpin` | Remove password/PIN |
| POST | `/admin/wallets/fetch` | Fetch user wallets |
| POST | `/updateuseraddress/generate-wallets-by-phone` | Generate wallets |
| PATCH | `/updateuseraddress/regenerate-by-phone` | Regenerate wallets |
| GET | `/updateuseraddress/status-by-phone` | Check wallet status |
| POST | `/pending/wipe` | Wipe pending balance |
| DELETE | `/deleteuser/user` | Delete user |

## File Structure

```
src/features/users/
├── components/
│   └── ActionsMenu.tsx           ✓ Simplified (3 actions)
├── pages/
│   ├── UserList.tsx              (unchanged)
│   ├── UserActions.tsx           ✓ NEW - Organized actions hub
│   ├── Summary.tsx               (unchanged)
│   ├── Disable2Fa.tsx            (unchanged)
│   ├── RemovePassword.tsx        (unchanged)
│   ├── WalletGenerateByPhone.tsx (unchanged)
│   └── RegenerateWalletByPhone.tsx (unchanged)
└── services/
    ├── usersService.ts           (unchanged)
    └── twoFaService.ts           (unchanged)
```

## Updated Files

### 1. ActionsMenu.tsx
**Location**: `src/features/users/components/ActionsMenu.tsx`

**Changes**:
- Removed 6 cluttered action buttons
- Simplified to 3 clean options
- Removed complex wallet status dialog
- Better visual hierarchy

### 2. UserActions.tsx (NEW)
**Location**: `src/features/users/pages/UserActions.tsx`

**Features**:
- Clean, card-based layout
- Actions organized by category
- Color-coded icons for each action
- User info displayed at top
- Backend endpoint reference at bottom

### 3. routes.tsx
**Location**: `src/core/routes/routes.tsx`

**Changes**:
- Added route: `/user-management/actions`

## Usage Flow

1. User goes to **Users** page
2. Clicks **⋮ (three dots)** on any user row
3. Sees simplified menu:
   - Manage User
   - View Summary
   - Delete User
4. Clicks **Manage User**
5. Lands on **UserActions** page with all organized options
6. Selects specific action (e.g., "Disable 2FA")
7. Completes action on dedicated page

## Benefits

### For Admins
- ✅ Cleaner, less cluttered interface
- ✅ Easy to find specific actions
- ✅ Visual organization by function
- ✅ Quick reference to backend endpoints
- ✅ Better mobile responsiveness

### For Developers
- ✅ Clear mapping to backend APIs
- ✅ Maintainable code structure
- ✅ Easy to add new actions
- ✅ Consistent patterns
- ✅ Self-documenting with endpoint reference

## Design Highlights

- **Color Coding**: Each action category has distinct colors
  - Blue: Information
  - Orange/Red: Security
  - Purple/Green/Teal: Wallets
  - Yellow: Balances
  - Red: Danger

- **Icons**: Lucide icons for visual clarity
  - UserCircle, Shield, Key, Wallet, RefreshCw, XCircle, Trash2

- **Responsive**: Works on all screen sizes
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns

## Next Steps

1. ✅ Actions menu simplified
2. ✅ UserActions page created
3. ✅ Routing configured
4. 🔄 Test all actions work correctly
5. 🔄 Verify backend endpoint connections
6. 🔄 Update any documentation

## Testing Checklist

- [ ] Click "Manage User" from actions menu
- [ ] Verify UserActions page loads
- [ ] Test each action navigates correctly
- [ ] Confirm user data passes via router state
- [ ] Check all backend endpoints respond
- [ ] Test delete confirmation dialog
- [ ] Verify responsive layout on mobile
- [ ] Check accessibility (keyboard navigation)

---

**Last Updated**: 2026-01-08
**Status**: Ready for testing
