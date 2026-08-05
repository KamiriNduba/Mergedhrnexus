import { Bell, HelpCircle, Search, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigationItems } from "../../constants/navigation";
import { authApi, type CurrentUser } from "../../services/api/auth";
import { getCurrentUserRole } from "../../services/permissions";

/**
 * Read user from localStorage with fallback
 */
const readUser = (): CurrentUser | null => {
  try {
    return JSON.parse(localStorage.getItem("current_user") ?? localStorage.getItem("user") ?? "null") as CurrentUser | null;
  } catch {
    return null;
  }
};

/**
 * Get branch label from user data
 */
const getBranchLabel = (user: CurrentUser | null) => {
  if (!user) return "All branches";
  if (user.branch_name) return user.branch_name;
  if (typeof user.branch === "string") return user.branch;
  if (user.branch?.name) return user.branch.name;
  return "All branches";
};

/**
 * Enhanced Navbar with better session synchronization
 * 
 * Improvements:
 * - Fetches /auth/me/ on mount to ensure current user data
 * - Syncs localStorage with backend data
 * - Handles session refresh properly
 * - Displays correct username and role
 */
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUser | null>(readUser);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch current user from backend and sync with localStorage
   */
  const refreshUserFromBackend = async () => {
    try {
      setIsLoading(true);
      const current = await authApi.me();
      if (current) {
        setUser(current);
        // Sync with localStorage to ensure consistency
        localStorage.setItem("current_user", JSON.stringify(current));
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      // Keep the user from localStorage if backend fails
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initialize user data on mount
   */
  useEffect(() => {
    let active = true;

    // Fetch current user from backend to ensure we have the latest data
    refreshUserFromBackend().then(() => {
      if (!active) return;
    });

    /**
     * Listen for storage changes (e.g., from other tabs)
     */
    const handleStorageChange = () => {
      const updated = readUser();
      if (updated) {
        setUser(updated);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    /**
     * Periodically refresh user data to catch any backend changes
     * This helps keep the session in sync
     */
    const refreshInterval = setInterval(() => {
      if (active) {
        refreshUserFromBackend();
      }
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => {
      active = false;
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(refreshInterval);
    };
  }, []);

  /**
   * Determine page title from current route
   */
  const pageTitle = useMemo(() => {
    const match = [...navigationItems]
      .sort((a, b) => b.path.length - a.path.length)
      .find((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`));
    return match?.label ?? "HR & Payroll";
  }, [location.pathname]);

  /**
   * Get current user role
   */
  const role = getCurrentUserRole();

  /**
   * Generate user initials for avatar
   */
  const initials = (user?.username ?? "User")
    .split(/[._\s-]+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="topbar">
      <span className="branch-selector" aria-label="Assigned branch">
        {getBranchLabel(user)}
      </span>
      <div className="breadcrumb">{pageTitle}</div>
      <div className="topbar-spacer" />
      <span className="role-badge" title={`Role: ${role ?? "Pending"}`}>
        {role ?? "Role pending"}
      </span>
      <button
        className="icon-button"
        type="button"
        aria-label="Search"
        onClick={() => {
          // TODO: Implement search functionality
          console.log("Search clicked");
        }}
      >
        <Search aria-hidden="true" size={17} />
      </button>
      <button
        className="icon-button notification-button"
        type="button"
        aria-label="Notifications"
        onClick={() => {
          // TODO: Implement notifications
          console.log("Notifications clicked");
        }}
      >
        <Bell aria-hidden="true" size={17} />
        <span className="notification-dot" />
      </button>
      <button
        className="icon-button"
        type="button"
        aria-label="Help"
        onClick={() => {
          // TODO: Implement help/ask functionality
          console.log("Help clicked");
        }}
      >
        <HelpCircle aria-hidden="true" size={17} />
      </button>
      {role === "System Admin" && (
        <button
          className="icon-button"
          type="button"
          aria-label="System settings"
          onClick={() => navigate("/system/settings")}
        >
          <Settings aria-hidden="true" size={17} />
        </button>
      )}
      <div
        className="avatar"
        aria-label={user?.username ?? "Current user"}
        title={`${user?.username ?? "User"} (${role ?? "No role"})`}
      >
        {initials || "U"}
      </div>
    </div>
  );
}
