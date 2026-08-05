from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Role, Permission, RolePermission

User = get_user_model()

class Command(BaseCommand):
    help = "Seed default roles and test users for the HR Payroll System"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Seeding default roles..."))

        # Define roles to be created
        roles_to_create = [
            ("SUPER_ADMIN", "Super Admin"),
            ("ADMIN", "Admin"),
            ("HR", "HR"),
            ("MANAGER", "Manager"),
            ("PAYROLL_OFFICER", "Payroll Officer"),
            ("EMPLOYEE", "Employee"),
            ("EXECUTIVE", "Executive"),
            ("DEPARTMENT_HEAD", "Department Head"),
            ("FINANCE", "Finance"),
        ]

        for name, display_name in roles_to_create:
            role, created = Role.objects.get_or_create(name=name, defaults={
                "description": f"{display_name} role"
            })
            if created:
                self.stdout.write(self.style.SUCCESS(f"Successfully created role: {display_name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Role already exists: {display_name}"))

        self.stdout.write(self.style.SUCCESS("Seeding test users..."))

        # Define test users with their roles and passwords
        test_users = [
            {
                "username": "admin",
                "email": "admin@example.com",
                "password": "admin123456",
                "role_name": "SUPER_ADMIN",
                "is_superuser": True,
                "is_staff": True,
            },
            {
                "username": "hr_manager",
                "email": "hr@example.com",
                "password": "test123456",
                "role_name": "HR",
                "is_staff": True,
            },
            {
                "username": "employee",
                "email": "employee@example.com",
                "password": "test123456",
                "role_name": "EMPLOYEE",
            },
            {
                "username": "manager",
                "email": "manager@example.com",
                "password": "test123456",
                "role_name": "MANAGER",
                "is_staff": True,
            },
            {
                "username": "executive",
                "email": "executive@example.com",
                "password": "test123456",
                "role_name": "EXECUTIVE",
                "is_staff": True,
            },
            {
                "username": "dept_head",
                "email": "depthead@example.com",
                "password": "test123456",
                "role_name": "DEPARTMENT_HEAD",
                "is_staff": True,
            },
            {
                "username": "finance",
                "email": "finance@example.com",
                "password": "test123456",
                "role_name": "FINANCE",
                "is_staff": True,
            },
        ]

        for user_data in test_users:
            username = user_data["username"]
            email = user_data["email"]
            password = user_data["password"]
            role_name = user_data["role_name"]
            is_superuser = user_data.get("is_superuser", False)
            is_staff = user_data.get("is_staff", False)

            try:
                user = User.objects.get(username=username)
                self.stdout.write(self.style.WARNING(f"User already exists: {username}. Updating role and password..."))
                user.set_password(password)
                user.is_superuser = is_superuser
                user.is_staff = is_staff
                user.is_approved = True
                user.is_active = True
                user.save()
            except User.DoesNotExist:
                self.stdout.write(self.style.SUCCESS(f"Creating user: {username}"))
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    is_superuser=is_superuser,
                    is_staff=is_staff,
                    is_approved=True,
                    is_active=True,
                )
            
            # Assign role
            try:
                role = Role.objects.get(name=role_name)
                user.role = role
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Assigned role {role_name} to user {username}"))
            except Role.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Role {role_name} not found for user {username}"))

        self.stdout.write(self.style.SUCCESS("Test users and roles seeded successfully."))

        self.stdout.write(self.style.WARNING("\n--- Test Credentials ---"))
        self.stdout.write(self.style.WARNING("| Role            | Username     | Password   |"))
        self.stdout.write(self.style.WARNING("|-----------------|--------------|------------|"))
        for user_data in test_users:
            self.stdout.write(self.style.WARNING(f"| {user_data['role_name'].replace('_', ' ').title():<15} | {user_data['username']:<12} | {user_data['password']:<10} |"))
        self.stdout.write(self.style.WARNING("------------------------"))
