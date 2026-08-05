#!/bin/bash
# ============================================================
# Nexus HR & Payroll - MySQL Database Setup Script
# Run this after starting XAMPP MySQL service
# ============================================================

set -e

echo "============================================"
echo " Nexus HR & Payroll - Database Setup"
echo "============================================"

# Default values
DB_NAME="${DB_NAME:-hr_payroll_system}"
DB_USER="${DB_USER:-root}"
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"

echo ""
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Host: $DB_HOST:$DB_PORT"
echo ""

# Check if MySQL is running
echo "Checking MySQL connection..."
if command -v mysql &> /dev/null; then
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT 1;" 2>/dev/null && echo "MySQL is running!" || {
        echo "ERROR: Cannot connect to MySQL at $DB_HOST:$DB_PORT"
        echo "Please start XAMPP MySQL service first."
        exit 1
    }
else
    echo "mysql client not found. Please install it or use XAMPP shell."
    echo "On Windows: Use 'XAMPP Control Panel' > 'Shell' > run: mysql -u root"
    echo "On Linux/Mac: sudo apt install mysql-client or brew install mysql"
fi

# Create database if it doesn't exist
echo ""
echo "Creating database '$DB_NAME' if not exists..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null && echo "Database ready!" || echo "Could not create database automatically. Please create it manually."

echo ""
echo "============================================"
echo " Next steps:"
echo " 1. Copy .env.example to .env and adjust values"
echo " 2. cd backend && python manage.py makemigrations"
echo " 3. python manage.py migrate"
echo " 4. python manage.py createsuperuser"
echo " 5. cd ../frontend && npm install && npm run dev"
echo " 6. In another terminal: cd backend && python manage.py runserver"
echo "============================================"
