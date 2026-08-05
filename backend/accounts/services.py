from accounts.models import (
    GroupPermission,
    RolePermission,
    RolePermissionGroup,
    Role,
    Permission,
)
from django.contrib.auth import get_user_model

User = get_user_model()


def user_has_permission(user, permission_codename):
    if not user or not user.is_authenticated:
        return False

    if user.is_superuser:
        return True

    if not user.role:
        return False

    direct_permission_exists = RolePermission.objects.filter(
        role=user.role,
        permission__codename=permission_codename,
    ).exists()

    if direct_permission_exists:
        return True

    group_ids = RolePermissionGroup.objects.filter(
        role=user.role,
        group__is_active=True,
    ).values_list(
        "group_id",
        flat=True,
    )

    return GroupPermission.objects.filter(
        group_id__in=group_ids,
        permission__codename=permission_codename,
    ).exists()


def get_user_permissions(user):
    """Get all permissions for a user based on their role."""
    if not user or not user.is_authenticated:
        return []
    
    if user.is_superuser:
        return list(Permission.objects.values_list('codename', flat=True))
    
    if not user.role:
        return []
    
    return list(
        Permission.objects.filter(
            role_permissions__role=user.role
        ).values_list('codename', flat=True).distinct()
    )


def assign_role_to_user(user, role_name: str) -> bool:
    """Assign a role to a user."""
    try:
        role = Role.objects.get(name=role_name)
        user.role = role
        user.save()
        return True
    except Role.DoesNotExist:
        return False


def validate_user_role(user) -> bool:
    """Validate that a user has a proper role assigned."""
    if user.is_superuser:
        return True
    
    # Ensure user has a role assigned
    if not user.role:
        # Try to assign EMPLOYEE role by default
        return assign_role_to_user(user, 'EMPLOYEE')
    
    return True


def prevent_privilege_escalation(user, target_role_name: str) -> bool:
    """Prevent privilege escalation by checking if a user can assign a role."""
    # Only superusers can assign admin/super_admin roles
    admin_roles = ['SUPER_ADMIN', 'ADMIN']
    
    if target_role_name in admin_roles:
        return user.is_superuser
    
    # HR and managers can assign non-admin roles
    if user.role and user.role.name in ['HR', 'ADMIN', 'SUPER_ADMIN']:
        return True
    
    return False


def is_user_approved(user) -> bool:
    """Check if a user is approved and can log in."""
    # Superusers are always approved
    if user.is_superuser:
        return True
    
    return user.is_approved and user.is_active
