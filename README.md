# HR Payroll System

## Project Overview

This is a comprehensive HR Payroll System designed to manage various aspects of human resources and payroll operations. The system features a modern React frontend and a robust Django REST API backend, ensuring a scalable and maintainable solution. It includes a wide range of modules covering employee management, payroll processing, recruitment, contract management, attendance, leave workflows, and financial oversight.

## Key Features

-   **Role-Based Access Control (RBAC)**: Secure access tailored to different user roles (Super Admin, HR Manager, Employee, Finance, etc.).
-   **Employee Management**: Full lifecycle management including onboarding, offboarding, performance, and personal documents.
-   **Payroll Processing**: Creation, approval, history, tax compliance, and compensation data management.
-   **Recruitment**: Manage job positions and candidate applications.
-   **Contract Management**: Create, update, export, and delete employee contracts.
-   **Attendance & Leave**: Track employee attendance and manage leave requests with approval workflows.
-   **Reporting & Analytics**: Dashboards and reports for Executive, HR, Department, Branch, and Finance roles.
-   **Activity Logging**: Comprehensive audit trail of all system activities.
-   **Data Synchronization**: Ensures consistency between frontend and backend data with robust CRUD operations.

## Project Structure

-   `backend/`: Contains the Django REST API for all server-side logic, database interactions, and API endpoints.
-   `frontend/`: Houses the React (Vite) web application, providing an intuitive user interface for all modules.

## Getting Started

### Automated Setup (Recommended)

For a quick and easy setup, use the provided `setup.sh` script. This script will:

-   Install backend Python dependencies.
-   Run database migrations.
-   Seed default permissions and roles.
-   Seed test users with predefined credentials.
-   Install frontend Node.js dependencies.

To run the automated setup, navigate to the project root and execute:

```bash
cd /home/ubuntu/Mergedhrnexus-main
./setup.sh
```

### Manual Setup (Advanced)

If you prefer a manual setup or need to customize specific steps, please refer to the `DEPLOYMENT_GUIDE.md` for detailed instructions.

### Running the Application

After the setup is complete, you can start the backend and frontend servers:

1.  **Start Backend:**
    ```bash
    cd /home/ubuntu/Mergedhrnexus-main/backend
    python manage.py runserver
    ```
    The backend will be available at: `http://127.0.0.1:8000`

2.  **Start Frontend:**
    ```bash
    cd /home/ubuntu/Mergedhrnexus-main/frontend
    npm run dev
    ```
    The frontend will be available at: `http://localhost:5000` (or as shown in your terminal).

## Test Credentials

Use the following credentials to log in and explore the system with different roles:

| Role            | Username     | Password   |
|-----------------|--------------|------------|
| Super Admin     | `admin`        | `admin123456`|
| HR Manager      | `hr_manager`   | `test123456` |
| Employee        | `employee`     | `test123456` |
| Manager         | `manager`      | `test123456` |
| Executive       | `executive`    | `test123456` |
| Department Head | `dept_head`    | `test123456` |
| Finance         | `finance`      | `test123456` |

## Documentation

-   `FIXES.md`: Detailed documentation of all fixes, new components, API endpoints, and module verification.
-   `DEPLOYMENT_GUIDE.md`: Comprehensive guide for manual setup and deployment.

## Status

🟢 **ALL SYSTEMS OPERATIONAL**

This system is fully functional, with all modules, buttons, and APIs working as expected. It is ready for production deployment and further enhancements.
