# API Response Standards for HR Payroll System

## Overview

This document defines standardized response formats for all API endpoints to ensure consistency across the system and facilitate frontend integration.

## Standard Response Format

### Success Response (2xx)

```json
{
  "status": "success",
  "code": 200,
  "data": {
    // Actual response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2026-08-05T10:30:00Z"
}
```

### Error Response (4xx, 5xx)

```json
{
  "status": "error",
  "code": 400,
  "error": {
    "type": "ValidationError",
    "message": "Invalid input provided",
    "details": {
      "field_name": ["Error message"]
    }
  },
  "timestamp": "2026-08-05T10:30:00Z"
}
```

## List Response Format

### Paginated List

```json
{
  "status": "success",
  "code": 200,
  "data": {
    "count": 100,
    "next": "http://api.example.com/endpoint/?page=2",
    "previous": null,
    "results": [
      { "id": 1, "name": "Item 1" },
      { "id": 2, "name": "Item 2" }
    ]
  },
  "message": "Items retrieved successfully",
  "timestamp": "2026-08-05T10:30:00Z"
}
```

### Filtered/Searched List

```json
{
  "status": "success",
  "code": 200,
  "data": {
    "count": 5,
    "filters": {
      "status": "active",
      "department": "Engineering"
    },
    "results": [
      { "id": 1, "name": "Item 1", "status": "active" }
    ]
  },
  "message": "Items retrieved successfully",
  "timestamp": "2026-08-05T10:30:00Z"
}
```

## CRUD Operation Responses

### Create (POST)

**Request:**
```json
{
  "name": "New Employee",
  "email": "employee@example.com",
  "department_id": 1
}
```

**Response (201):**
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "id": 123,
    "name": "New Employee",
    "email": "employee@example.com",
    "department_id": 1,
    "created_at": "2026-08-05T10:30:00Z"
  },
  "message": "Employee created successfully",
  "timestamp": "2026-08-05T10:30:00Z"
}
```

### Read (GET)

**Response (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "id": 123,
    "name": "Employee Name",
    "email": "employee@example.com",
    "department": {
      "id": 1,
      "name": "Engineering"
    },
    "created_at": "2026-08-05T10:30:00Z",
    "updated_at": "2026-08-05T10:30:00Z"
  },
  "message": "Employee retrieved successfully",
  "timestamp": "2026-08-05T10:30:00Z"
}
```

### Update (PUT/PATCH)

**Request:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "id": 123,
    "name": "Updated Name",
    "email": "newemail@example.com",
    "updated_at": "2026-08-05T10:35:00Z"
  },
  "message": "Employee updated successfully",
  "timestamp": "2026-08-05T10:35:00Z"
}
```

### Delete (DELETE)

**Response (204 or 200):**
```json
{
  "status": "success",
  "code": 204,
  "data": null,
  "message": "Employee deleted successfully",
  "timestamp": "2026-08-05T10:40:00Z"
}
```

## Error Response Examples

### Validation Error (400)

```json
{
  "status": "error",
  "code": 400,
  "error": {
    "type": "ValidationError",
    "message": "Invalid input provided",
    "details": {
      "email": ["Enter a valid email address"],
      "department_id": ["This field is required"]
    }
  },
  "timestamp": "2026-08-05T10:30:00Z"
}
```

### Authentication Error (401)

```json
{
  "status": "error",
  "code": 401,
  "error": {
    "type": "AuthenticationError",
    "message": "Authentication credentials were not provided"
  },
  "timestamp": "2026-08-05T10:30:00Z"
}
```

### Permission Error (403)

```json
{
  "status": "error",
  "code": 403,
  "error": {
    "type": "PermissionError",
    "message": "You do not have permission to perform this action"
  },
  "timestamp": "2026-08-05T10:30:00Z"
}
```

### Not Found Error (404)

```json
{
  "status": "error",
  "code": 404,
  "error": {
    "type": "NotFoundError",
    "message": "Employee with id 999 not found"
  },
  "timestamp": "2026-08-05T10:30:00Z"
}
```

### Server Error (500)

```json
{
  "status": "error",
  "code": 500,
  "error": {
    "type": "ServerError",
    "message": "An unexpected error occurred",
    "details": "Internal server error"
  },
  "timestamp": "2026-08-05T10:30:00Z"
}
```

## Module-Specific Response Formats

### Employee Module

**Employee Object:**
```json
{
  "id": 1,
  "user_id": 1,
  "employee_number": "EMP001",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone_number": "+254712345678",
  "department": {
    "id": 1,
    "name": "Engineering"
  },
  "branch": {
    "id": 1,
    "name": "Nairobi HQ"
  },
  "employment_status": "ACTIVE",
  "hire_date": "2022-01-15",
  "created_at": "2026-08-05T10:30:00Z",
  "updated_at": "2026-08-05T10:30:00Z"
}
```

### Document Upload Response

**Request (multipart/form-data):**
- `employee`: Employee ID
- `document_name`: Name of document
- `document_type`: Type (CV, NATIONAL_ID, etc.)
- `file`: File to upload

**Response (201):**
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "id": 1,
    "employee_id": 1,
    "document_name": "John_Doe_CV",
    "document_type": "CV",
    "file": "http://api.example.com/media/employees/documents/john_doe_cv.pdf",
    "is_verified": false,
    "uploaded_at": "2026-08-05T10:30:00Z"
  },
  "message": "Document uploaded successfully",
  "timestamp": "2026-08-05T10:30:00Z"
}
```

### Leave Request Response

**Leave Request Object:**
```json
{
  "id": 1,
  "employee": {
    "id": 1,
    "name": "John Doe"
  },
  "leave_type": {
    "id": 1,
    "name": "Annual Leave"
  },
  "start_date": "2026-08-15",
  "end_date": "2026-08-20",
  "total_days": 5,
  "reason": "Personal leave",
  "status": "PENDING_MANAGER",
  "requested_by": "john.doe@example.com",
  "requested_at": "2026-08-05T10:30:00Z",
  "manager_approved_at": null,
  "hr_approved_at": null
}
```

### Payroll Response

**Payslip Object:**
```json
{
  "id": 1,
  "employee": {
    "id": 1,
    "name": "John Doe",
    "employee_number": "EMP001"
  },
  "period": "2026-08",
  "gross_salary": 50000,
  "deductions": 5000,
  "net_salary": 45000,
  "status": "PROCESSED",
  "generated_at": "2026-08-05T10:30:00Z",
  "paid_at": null
}
```

## Response Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate/conflict error |
| 422 | Unprocessable Entity | Validation failed |
| 500 | Server Error | Internal server error |
| 503 | Service Unavailable | Service temporarily unavailable |

## Pagination Standards

### Query Parameters

- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)
- `ordering`: Field to order by (prefix with `-` for descending)
- `search`: Search query
- `filters`: Additional filters (module-specific)

### Example Request

```
GET /api/employees/?page=2&page_size=50&ordering=-created_at&search=john
```

### Response Format

```json
{
  "status": "success",
  "code": 200,
  "data": {
    "count": 150,
    "next": "http://api.example.com/employees/?page=3",
    "previous": "http://api.example.com/employees/?page=1",
    "results": [...]
  }
}
```

## Filtering Standards

### Query Parameters

- `status`: Filter by status
- `department`: Filter by department ID
- `branch`: Filter by branch ID
- `date_from`: Filter by start date
- `date_to`: Filter by end date

### Example Request

```
GET /api/leave/requests/?status=PENDING_MANAGER&employee=1&date_from=2026-08-01
```

## Sorting Standards

### Query Parameter

- `ordering`: Field name (prefix with `-` for descending)

### Example Requests

```
GET /api/employees/?ordering=first_name
GET /api/employees/?ordering=-created_at
```

## Batch Operations

### Batch Create

**Request:**
```json
{
  "items": [
    { "name": "Item 1" },
    { "name": "Item 2" }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "created": 2,
    "failed": 0,
    "results": [
      { "id": 1, "name": "Item 1", "status": "created" },
      { "id": 2, "name": "Item 2", "status": "created" }
    ]
  }
}
```

### Batch Delete

**Request:**
```json
{
  "ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "deleted": 3,
    "failed": 0
  }
}
```

## File Upload Standards

### Supported Formats

- Documents: PDF, DOC, DOCX, XLS, XLSX
- Images: PNG, JPG, JPEG, GIF
- Max file size: 10MB

### Upload Response

```json
{
  "status": "success",
  "code": 201,
  "data": {
    "id": 1,
    "filename": "document.pdf",
    "size": 1024000,
    "url": "http://api.example.com/media/uploads/document.pdf",
    "uploaded_at": "2026-08-05T10:30:00Z"
  }
}
```

## Rate Limiting

### Headers

- `X-RateLimit-Limit`: Total requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when limit resets

### Example

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1691220600
```

## Implementation Checklist

- [ ] All endpoints return standardized response format
- [ ] All error responses include proper error type and details
- [ ] Pagination implemented for list endpoints
- [ ] Filtering implemented where applicable
- [ ] Sorting implemented where applicable
- [ ] File uploads handled properly
- [ ] Rate limiting implemented
- [ ] Response timestamps in ISO 8601 format
- [ ] Status codes follow HTTP standards
- [ ] Documentation matches implementation
