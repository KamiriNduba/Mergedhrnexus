#!/bin/bash

# HR Payroll System - Master Setup Script
# This script automates the initialization of the backend and frontend.

echo "🚀 Starting HR Payroll System Setup..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check for Python
if ! command -v python3 &> /dev/null
then
    echo "❌ Python3 is not installed. Please install it first."
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

echo -e "${BLUE}📦 Setting up Backend...${NC}"
cd backend

# Install backend dependencies
if [ -f "requirements.txt" ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
else
    echo "❌ requirements.txt not found!"
    exit 1
fi

# Run Migrations
echo "Running database migrations..."
python3 manage.py makemigrations
python3 manage.py migrate

# Seed Permissions
echo "Seeding system permissions..."
python3 manage.py seed_permissions

# Seed Test Users and Roles
echo "Seeding test users and roles..."
python3 manage.py seed_test_users

cd ..

echo -e "${BLUE}📦 Setting up Frontend...${NC}"
cd frontend

# Install frontend dependencies
if [ -f "package.json" ]; then
    echo "Installing Node dependencies..."
    npm install
else
    echo "❌ package.json not found!"
    exit 1
fi

cd ..

echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "--- How to Run ---"
echo "1. Start Backend: cd backend && python3 manage.py runserver"
echo "2. Start Frontend: cd frontend && npm run dev"
echo ""
echo "--- Test Credentials ---"
echo "| Role            | Username     | Password   |"
echo "|-----------------|--------------|------------|"
echo "| Super Admin     | admin        | admin123456|"
echo "| HR Manager      | hr_manager   | test123456 |"
echo "| Employee        | employee     | test123456 |"
echo "| Manager         | manager      | test123456 |"
echo "-----------------------------------------------"
