# HR Payroll System - Deployment & Testing Guide

## Pre-Deployment Checklist

### Backend Requirements
- [ ] Python 3.8+
- [ ] MySQL 5.7+ or PostgreSQL 10+
- [ ] pip package manager
- [ ] Virtual environment created

### Frontend Requirements
- [ ] Node.js 16+
- [ ] npm or yarn
- [ ] Modern web browser

### System Requirements
- [ ] 2GB RAM minimum
- [ ] 1GB disk space
- [ ] Internet connectivity

## Automated Setup (Recommended)

For a quick and easy setup, use the provided `setup.sh` script. This script will:
- Install backend Python dependencies
- Run database migrations
- Seed default permissions and roles
- Seed test users with predefined credentials
- Install frontend Node.js dependencies

### Step 1: Run the Setup Script

```bash
cd /home/ubuntu/Mergedhrnexus-main
./setup.sh
```

### Step 2: Start Backend Server

```bash
cd /home/ubuntu/Mergedhrnexus-main/backend
python manage.py runserver 127.0.0.1:8000
```

Backend will be available at: `http://127.0.0.1:8000`

### Step 3: Start Frontend Development Server

```bash
cd /home/ubuntu/Mergedhrnexus-main/frontend
npm run dev
```

Frontend will be available at: `http://localhost:5000`

## Manual Setup (Advanced)

If you prefer a manual setup or need to customize specific steps, follow the instructions below.

### Backend Deployment

#### Step 1: Environment Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Step 2: Database Configuration

Create `.env` file in backend directory:

```env
# Database Configuration
DB_ENGINE=mysql
DB_NAME=hr_payroll_system
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=127.0.0.1
DB_PORT=3306

# Django Settings
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5000,http://127.0.0.1:5000
```

#### Step 3: Database Migration and Seeding

```bash
# Create database (if using MySQL)
mysql -u root -p
> CREATE DATABASE hr_payroll_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> EXIT;

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Seed permissions and roles
python manage.py seed_permissions

# Seed test users and roles
python manage.py seed_test_users

# Create superuser (if not using seed_test_users)
# python manage.py createsuperuser

# Create test data (optional)
# python manage.py seed_employees
```

#### Step 4: Start Backend Server

```bash
python manage.py runserver 127.0.0.1:8000
```

Backend will be available at: `http://127.0.0.1:8000`

### Frontend Deployment

#### Step 1: Environment Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=
VITE_API_TIMEOUT=30000
EOF
```

#### Step 2: Development Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5000`

### Step 3: Production Build

```bash
npm run build
npm run preview
```

## Testing Strategy

### Unit Testing

#### Backend Unit Tests

```bash
cd backend

# Run all tests
python manage.py test

# Run specific app tests
python manage.py test accounts
python manage.py test employees
python manage.py test leave_management

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

#### Frontend Unit Tests

```bash
cd frontend

# Run tests (if configured)
npm test

# Run with coverage
npm test -- --coverage
```

### Integration Testing

#### Authentication Flow

1. **User Registration**
   - Navigate to registration page
   - Fill in registration form
   - Verify user is created with EMPLOYEE role
   - Verify user can login immediately

2. **User Login**
   - Login as different roles (Employee, HR, Admin)
   - Verify correct dashboard is displayed
   - Verify navbar shows correct username and role
   - Verify session persists on refresh

3. **User Logout**
   - Login as user
   - Click logout
   - Verify redirected to login page
   - Verify session is cleared

#### RBAC Testing

1. **Employee Permissions**
   - Login as employee
   - Verify cannot access HR modules
   - Verify cannot access Admin modules
   - Verify can access employee modules

2. **HR Permissions**
   - Login as HR user
   - Verify can access HR modules
   - Verify cannot access Admin modules
   - Verify can view all employee data

3. **Admin Permissions**
   - Login as admin
   - Verify can access all modules
   - Verify can create/edit/delete users
   - Verify can manage roles and permissions

#### Employee Module Testing

1. **Dashboard**
   - Verify correct user name displayed
   - Verify correct department and location
   - Verify stats load correctly
   - Verify quick actions navigate correctly

2. **Document Upload**
   - Upload document
   - Verify document appears in My Documents
   - Verify document appears in HR compliance view
   - Verify document can be deleted

3. **Leave Request**
   - Submit leave request
   - Verify request appears in pending list
   - Verify manager receives notification
   - Verify HR can approve/reject

4. **Attendance**
   - View attendance records
   - Verify correct data displayed
   - Verify can check in/out

5. **Payslips**
   - View payslips
   - Verify correct salary information
   - Verify can download payslip

#### HR Module Testing

1. **Dashboard**
   - Verify metrics display correctly
   - Verify export functionality works
   - Verify quick actions are functional

2. **Employee Management**
   - Create new employee
   - Edit employee information
   - Delete employee
   - Verify changes reflected immediately

3. **Document Management**
   - View all employee documents
   - Filter documents by type
   - Verify/reject documents
   - Download documents

4. **Leave Management**
   - View leave requests
   - Approve/reject requests
   - View leave balance
   - Generate leave reports

5. **Payroll Management**
   - Generate payroll
   - Approve payroll
   - Export payroll data

#### Data Synchronization Testing

1. **Create Operations**
   - Create record in frontend
   - Verify immediately appears in view
   - Refresh page
   - Verify record persists

2. **Update Operations**
   - Update record
   - Verify changes appear immediately
   - Refresh page
   - Verify changes persist

3. **Delete Operations**
   - Delete record
   - Verify removed from view
   - Refresh page
   - Verify deletion persists

4. **Concurrent Operations**
   - Open same record in two tabs
   - Edit in tab 1
   - Edit in tab 2
   - Verify conflict resolution works

### API Testing

#### Using Postman

1. Import Postman collection: `backend/postman/hr-payroll-system-api.postman_collection.json`
2. Configure environment: `backend/postman/hr-payroll-local.postman_environment.json`
3. Run collection tests

#### Using cURL

```bash
# Login
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123456"}'

# Get current user
curl -X GET http://127.0.0.1:8000/api/auth/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# List employees
curl -X GET http://127.0.0.1:8000/api/employees/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Create employee
curl -X POST http://127.0.0.1:8000/api/employees/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "employee_number":"EMP002",
    "first_name":"Jane",
    "last_name":"Doe",
    "hire_date":"2026-08-05"
  }'
```

### Performance Testing

#### Load Testing

```bash
# Install Apache Bench
apt-get install apache2-utils

# Test API endpoint
ab -n 1000 -c 10 http://127.0.0.1:8000/api/employees/

# Test with authentication
ab -n 1000 -c 10 -H "Authorization: Bearer TOKEN" http://127.0.0.1:8000/api/employees/
```

#### Database Performance

```bash
# Check query performance
python manage.py shell

from django.db import connection
from django.test.utils import CaptureQueriesContext

with CaptureQueriesContext(connection) as context:
    # Your code here
    pass

print(f"Queries: {len(context)}")
for query in context:
    print(query['sql'])
    print(f"Time: {query['time']}")
```

### Security Testing

#### CSRF Protection
- Verify CSRF tokens are required for POST requests
- Verify CSRF token validation works

#### SQL Injection
- Attempt SQL injection in search fields
- Verify queries are parameterized

#### XSS Protection
- Attempt XSS in text fields
- Verify output is escaped

#### Authentication
- Attempt to access protected endpoints without token
- Verify 401 response
- Attempt with invalid token
- Verify 401 response

#### Authorization
- Attempt to access unauthorized resources
- Verify 403 response

## Test Data Setup

### Create Test Users

```bash
python manage.py shell

from accounts.models import CustomUser, Role

# Create roles
admin_role, _ = Role.objects.get_or_create(name='ADMIN')
hr_role, _ = Role.objects.get_or_create(name='HR')
employee_role, _ = Role.objects.get_or_create(name='EMPLOYEE')

# Create admin user
admin = CustomUser.objects.create_superuser(
    username='admin',
    email='admin@example.com',
    password='admin123456'
)
admin.role = admin_role
admin.save()

# Create HR user
hr_user = CustomUser.objects.create_user(
    username='hr_manager',
    email='hr@example.com',
    password='test123456'
)
hr_user.role = hr_role
hr_user.save()

# Create employee user
employee = CustomUser.objects.create_user(
    username='employee',
    email='employee@example.com',
    password='test123456'
)
employee.role = employee_role
employee.save()
```

### Create Test Employees

```bash
from employees.models import Employee
from departments.models import Department, Branch

# Create department and branch
dept, _ = Department.objects.get_or_create(name='Engineering')
branch, _ = Branch.objects.get_or_create(name='Nairobi HQ')

# Create employee
emp = Employee.objects.create(
    user=employee,
    employee_number='EMP001',
    first_name='John',
    last_name='Doe',
    hire_date='2022-01-15',
    department=dept,
    branch=branch
)
```

## Troubleshooting

### Backend Issues

#### Database Connection Error
```
Error: Can't connect to MySQL server on '127.0.0.1'
```

**Solution:**
- Verify MySQL is running
- Check database credentials in .env
- Verify database exists

#### Migration Error
```
Error: No such table: accounts_customuser
```

**Solution:**
- Run `python manage.py migrate`
- Check for migration conflicts
- Reset migrations if necessary

#### Permission Error
```
Error: You do not have permission to perform this action
```

**Solution:**
- Verify user role is assigned
- Check role permissions in database
- Run `python manage.py seed_permissions`

### Frontend Issues

#### API Connection Error
```
Error: Failed to fetch from /api/...
```

**Solution:**
- Verify backend is running
- Check CORS configuration
- Verify API endpoint URL in .env

#### Authentication Error
```
Error: Invalid credentials
```

**Solution:**
- Verify user exists in database
- Check password
- Verify user is approved

#### Module Not Found
```
Error: Cannot find module...
```

**Solution:**
- Run `npm install`
- Clear node_modules and reinstall
- Check import paths

## Performance Optimization

### Backend Optimization

1. **Database Indexing**
   ```python
   class Meta:
       indexes = [
           models.Index(fields=['status']),
           models.Index(fields=['department', 'status']),
       ]
   ```

2. **Query Optimization**
   ```python
   # Use select_related for foreign keys
   employees = Employee.objects.select_related('department', 'branch')
   
   # Use prefetch_related for reverse relations
   departments = Department.objects.prefetch_related('employees')
   ```

3. **Caching**
   ```python
   from django.views.decorators.cache import cache_page
   
   @cache_page(60 * 5)  # Cache for 5 minutes
   def employee_list(request):
       pass
   ```

### Frontend Optimization

1. **Code Splitting**
   ```typescript
   const EmployeeDashboard = lazy(() => import('./EmployeeDashboard'));
   ```

2. **Lazy Loading**
   ```typescript
   <Suspense fallback={<Loading />}>
     <EmployeeDashboard />
   </Suspense>
   ```

3. **Memoization**
   ```typescript
   const MemoizedComponent = memo(Component);
   ```

## Monitoring

### Backend Monitoring

```bash
# Monitor Django logs
tail -f logs/django.log

# Monitor database queries
python manage.py shell_plus --print-sql

# Monitor system resources
top
```

### Frontend Monitoring

```bash
# Check browser console for errors
# Monitor network requests in DevTools
# Check performance metrics
```

## Backup & Recovery

### Database Backup

```bash
# MySQL backup
mysqldump -u root -p hr_payroll_system > backup.sql

# Restore from backup
mysql -u root -p hr_payroll_system < backup.sql
```

### File Backup

```bash
# Backup media files
tar -czf media_backup.tar.gz media/

# Restore media files
tar -xzf media_backup.tar.gz
```

## Deployment to Production

### Backend Deployment

1. Use production-grade server (Gunicorn, uWSGI)
2. Configure reverse proxy (Nginx)
3. Enable HTTPS/SSL
4. Set DEBUG=False
5. Configure allowed hosts
6. Set up error logging
7. Configure database backups
8. Set up monitoring

### Frontend Deployment

1. Build for production: `npm run build`
2. Deploy to CDN or static server
3. Configure caching headers
4. Enable gzip compression
5. Set up monitoring
6. Configure error tracking

## Maintenance

### Regular Tasks

- [ ] Monitor error logs daily
- [ ] Check database performance weekly
- [ ] Review user activity monthly
- [ ] Update dependencies quarterly
- [ ] Backup database daily
- [ ] Review security logs weekly
