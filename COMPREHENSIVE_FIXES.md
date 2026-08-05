# HR Payroll System - Comprehensive Fixes

## Phase 1: Authentication & User Session Fixes

### Issue 1.1: User Session Inconsistency
**Problem:** Navbar reads user from localStorage but also fetches `/auth/me/`, causing display mismatches.

**Root Cause:** 
- `navbar.tsx` initializes user from localStorage
- Then fetches `/auth/me/` which may return different data
- If the two sources disagree, the displayed username/role becomes inconsistent

**Fix:**
- Ensure `/auth/me/` always returns the authenticated user's current data
- Synchronize localStorage with backend on every auth operation
- Use a single source of truth (backend) for user identity

### Issue 1.2: Employee Accounts Getting Admin Permissions
**Problem:** Employees are being assigned admin-level access and permissions.

**Root Cause:**
- Backend `RegisterSerializer` sets `is_approved=True` but doesn't assign a role
- Frontend role detection falls back to `is_staff` flag
- No explicit role assignment during user creation

**Fix:**
- Always assign the "EMPLOYEE" role during registration
- Validate role assignment in backend
- Prevent privilege escalation by enforcing role-based access

### Issue 1.3: RBAC Role Mapping Mismatch
**Problem:** Frontend role names don't match backend role names.

**Root Cause:**
- Backend uses: `SUPER_ADMIN`, `ADMIN`, `HR`, `MANAGER`, `PAYROLL_OFFICER`, `EMPLOYEE`
- Frontend expects: `System Admin`, `Executive`, `Manager`, `HR`, `Department Head`, `Finance`, `Employee`
- Normalization function tries to map but can fail

**Fix:**
- Standardize role names across frontend and backend
- Create explicit role mapping
- Update seed_permissions.py to include all expected roles

### Issue 1.4: Missing Role Endpoints
**Problem:** Frontend needs to fetch available roles but endpoints may be incomplete.

**Fix:**
- Ensure `RoleListView` is properly implemented
- Add role permissions to the response
- Cache roles on frontend for performance

## Phase 2: Employee Module Fixes

### Issue 2.1: Profile Information Display
**Problem:** Logged-in employee's username and profile don't reflect authenticated user.

**Fix:**
- Update employee dashboard to fetch from `/auth/me/`
- Sync profile data from employee profile endpoint
- Ensure navbar displays correct user

### Issue 2.2: Document Upload
**Problem:** Employees can't upload documents under My Documents.

**Fix:**
- Verify document upload endpoint exists
- Check file permissions and storage
- Ensure CORS allows file uploads

### Issue 2.3: Leave Application Submission
**Problem:** My Leave module doesn't allow successful leave submission.

**Fix:**
- Verify leave request endpoint
- Check leave approval workflow
- Ensure employee role has `leave.request` permission

### Issue 2.4: Notifications, Search, Ask Icons
**Problem:** These icons are not functional.

**Fix:**
- Implement notification system
- Implement search functionality
- Implement help/ask system

## Phase 3: HR Module Fixes

### Issue 3.1: HR User Profile
**Problem:** HR user profile doesn't display correct username and role.

**Fix:**
- Same as employee profile fixes
- Ensure HR role is correctly assigned
- Verify HR dashboard loads correct data

### Issue 3.2: Documents & Compliance
**Problem:** Employee documents don't appear in HR's Documents & Compliance.

**Fix:**
- Verify document listing endpoint filters correctly
- Ensure HR has permission to view all employee documents
- Sync document uploads to HR view

### Issue 3.3: Activity Log
**Problem:** Search and refresh don't work correctly.

**Fix:**
- Implement proper activity log filtering
- Add refresh functionality
- Ensure audit logs are being recorded

### Issue 3.4: Quick Actions
**Problem:** Quick actions on HR Dashboard don't work.

**Fix:**
- Verify all action endpoints
- Check button wiring
- Ensure permissions allow actions

### Issue 3.5: Recruitment Module
**Problem:** Create Position, action buttons, and exports don't work.

**Fix:**
- Verify recruitment endpoints
- Check position creation logic
- Ensure export functionality works

## Phase 4: Data Synchronization Fixes

### Issue 4.1: CRUD Operations
**Problem:** Records created/updated/deleted don't sync between frontend and backend.

**Fix:**
- Verify all CRUD endpoints exist
- Ensure proper response formats
- Add data validation on both sides

### Issue 4.2: Frontend State Management
**Problem:** Frontend state doesn't reflect backend changes.

**Fix:**
- Implement proper state refresh after operations
- Add optimistic updates with rollback
- Use React Query for data synchronization

## Implementation Strategy

1. **Backend Fixes First** - Ensure all endpoints work correctly
2. **API Response Standardization** - Consistent response formats
3. **Frontend Session Management** - Fix authentication flow
4. **RBAC Enforcement** - Verify permissions at every level
5. **End-to-End Testing** - Test all workflows

## Testing Checklist

- [ ] Login with different roles displays correct dashboard
- [ ] User profile shows correct username
- [ ] Employee can't access admin modules
- [ ] Employee can submit leave and upload documents
- [ ] HR can view all employee documents
- [ ] All CRUD operations work
- [ ] Exports work correctly
- [ ] Activity logs are recorded
