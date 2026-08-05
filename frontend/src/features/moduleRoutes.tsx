import {
  BadgeDollarSign,
  Banknote,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileCheck2,
  FileText,
  FolderOpen,
  GraduationCap,
  HandCoins,
  Handshake,
  Landmark,
  LayoutDashboard,
  MessageCircleQuestion,
  ReceiptText,
  Scale,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserCog,
  UserRound,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import type { ReactElement } from "react";

// --- Import Real Components ---
import AiAssistant from "./ai-assistant/pages/AiAssistantPage";
import AnnouncementsTraining from "./training/announcements/pages/AnnouncementsTrainingPage";
import AttendanceManagement from "./attendance/management/pages/AttendanceManagementPage";
import BankIntegration from "./payroll/bank-integration/pages/BankIntegrationPage";
import BankIntegrationAccounts from "./finance/bank-integration/pages/BankIntegrationAccountsPage";
import BenefitsManagement from "./benefits/management/pages/Dashboard";
import BenefitsManagementAccounts from "./finance/benefits-management/pages/BenefitsManagementAccountsPage";
import BranchDashboard from "./dashboards/branch/pages/BranchDashboardPage";
import CompensationData from "./payroll/compensation-data/pages/CompensationDataPage";
import Complaints from "./complaints/pages/ComplaintsPage";
import FinanceGrievances from "./finance/finance-grievances/pages/FinanceGrievances";
import ContractManagement from "./contracts/pages/ContractManagementPage";
import DepartmentDashboard from "./dashboards/department/pages/DepartmentDashboardPage";
import DisciplinaryCases from "./disciplinary/cases/pages/DisciplinaryCasesPage";
import DisciplinaryManagement from "./disciplinary/management/pages/DisciplinaryManagementPage";
import EmployeeDashboard from "./dashboards/employee/pages/EmployeeDashboardPage-fixed";
import EmployeeFinance from "./finance/employee-finance/pages/EmployeeFinancePage";
import EmployeeLifecycle from "./employees/lifecycle/pages/EmployeeLifecyclePage";
import ExecutiveDashboard from "./dashboards/executive/pages/ExecutiveDashboardPage";
import FinanceDashboard from "./dashboards/finance/pages/FinanceDashboardPage";
import HrDashboard from "./dashboards/hr/pages/HrDashboardPage";
import LeaveApprovals from "./leave/approvals/pages/LeaveApprovalsPage";
import LeaveWorkflow from "./leave/workflow/pages/LeaveWorkflowPage";
import MyAnnouncements from "./employee-self-service/announcements/pages/MyAnnouncementsPage";
import MyAttendance from "./employee-self-service/attendance/pages/MyAttendancePage";
import MyBenefits from "./employee-self-service/benefits/pages/MyBenefitsPage";
import MyDocuments from "./employee-self-service/documents/pages/MyDocumentsPage-fixed";
import MyPayslips from "./employee-self-service/payslips/pages/MyPayslip";
import MyPerformance from "./employee-self-service/performance/pages/MyPerformancePage";
import Offboarding from "./employees/offboarding/pages/OffboardingPage";
import Onboarding from "./employees/onboarding/pages/OnboardingPage";
import Payroll from "./payroll/overview/pages/PayrollPage";
import PayrollApproval from "./payroll/approval/pages/PayrollApprovalPage";
import PayrollCreation from "./payroll/creation/pages/PayrollCreationPage";
import PayrollHistory from "./payroll/history/pages/PayrollHistoryPage";
import PerformanceOversight from "./performance/pages/PerformanceOversightPage";
import ReportsAnalytics from "./reports/pages/ReportsAnalyticsPage";
import SecurityAudit from "./hr-operations/activity-log/ActivityLogPage";
import TaxCompliance from "./payroll/tax-compliance/pages/TaxCompliancePage";
import TaxComplianceAccounts from "./finance/tax-compliance/pages/TaxComplianceAccountsPage";
import UserProfile from "./user-profile/pages/UserProfilePage";
import SystemSettings from "../system/SystemSettings";
import RecruitmentPage from "./recruitment/RecruitmentPage";
import BranchReports from "./reports-branch/pages/BranchReportsPage";

export type ModuleRoute = {
  title: string;
  path: string;
  section: string;
  icon: LucideIcon;
  Component: () => ReactElement;
};

export const moduleRoutes: ModuleRoute[] = [
  // ─── Executive Section ───
  {
    title: "Executive Dashboard",
    path: "/dashboard/executive",
    section: "Executive",
    icon: LayoutDashboard,
    Component: ExecutiveDashboard,
  },
  {
    title: "Reports & Analytics",
    path: "/reports-analytics",
    section: "Executive",
    icon: BarChart3,
    Component: ReportsAnalytics,
  },
  {
    title: "AI Assistant",
    path: "/ai-assistant",
    section: "Executive",
    icon: Sparkles,
    Component: AiAssistant,
  },

  // ─── Account Section ───
  {
    title: "User Profile",
    path: "/user-profile",
    section: "Account",
    icon: UserRound,
    Component: UserProfile,
  },

  // ─── Administration Section ───
  {
    title: "Security & Audit",
    path: "/security-audit",
    section: "Administration",
    icon: ShieldCheck,
    Component: SecurityAudit,
  },
  {
    title: "System Settings",
    path: "/system/settings",
    section: "Administration",
    icon: Settings,
    Component: SystemSettings,
  },

  // ─── HR Operations Section ───
  {
    title: "HR Dashboard",
    path: "/dashboard/hr",
    section: "HR Operations",
    icon: Users,
    Component: HrDashboard,
  },
  {
    title: "Candidate Applications",
    path: "/recruitment/applications",
    section: "HR Operations",
    icon: Users,
    Component: RecruitmentPage,
  },
  {
    title: "Department Dashboard",
    path: "/dashboard/department",
    section: "HR Operations",
    icon: Building2,
    Component: DepartmentDashboard,
  },
  {
    title: "Employee Lifecycle",
    path: "/employees/lifecycle",
    section: "HR Operations",
    icon: UserCheck,
    Component: EmployeeLifecycle,
  },
  {
    title: "Contract Management",
    path: "/contracts",
    section: "HR Operations",
    icon: FileCheck2,
    Component: ContractManagement,
  },
  {
    title: "Performance Oversight",
    path: "/performance",
    section: "HR Operations",
    icon: TrendingUp,
    Component: PerformanceOversight,
  },
  {
    title: "Offboarding",
    path: "/employees/offboarding",
    section: "HR Operations",
    icon: UserCog,
    Component: Offboarding,
  },
  {
    title: "Onboarding",
    path: "/employees/onboarding",
    section: "HR Operations",
    icon: Handshake,
    Component: Onboarding,
  },
  {
    title: "Attendance Management",
    path: "/attendance",
    section: "HR Operations",
    icon: CalendarClock,
    Component: AttendanceManagement,
  },
  {
    title: "Leave Workflow",
    path: "/leave/workflow",
    section: "HR Operations",
    icon: CalendarCheck,
    Component: LeaveWorkflow,
  },
  {
    title: "Leave Approvals",
    path: "/leave/approvals",
    section: "HR Operations",
    icon: ClipboardCheck,
    Component: LeaveApprovals,
  },
  {
    title: "Disciplinary Cases",
    path: "/disciplinary/cases",
    section: "HR Operations",
    icon: Scale,
    Component: DisciplinaryCases,
  },
  {
    title: "Disciplinary Management",
    path: "/disciplinary/management",
    section: "HR Operations",
    icon: ClipboardList,
    Component: DisciplinaryManagement,
  },
  {
    title: "Announcements & Training",
    path: "/training/announcements",
    section: "HR Operations",
    icon: GraduationCap,
    Component: AnnouncementsTraining,
  },
  {
    title: "Benefits Management",
    path: "/benefits",
    section: "HR Operations",
    icon: HandCoins,
    Component: BenefitsManagement,
  },

  // ─── Branch Section ───
  {
    title: "Branch Dashboard",
    path: "/dashboard/branch",
    section: "Branch",
    icon: Building2,
    Component: BranchDashboard,
  },
  {
    title: "Branch Reports",
    path: "/branch-reports",
    section: "Branch",
    icon: BarChart3,
    Component: BranchReports,
  },

  // ─── Payroll Section ───
  {
    title: "Payroll",
    path: "/payroll",
    section: "Payroll",
    icon: WalletCards,
    Component: Payroll,
  },
  {
    title: "Payroll Creation",
    path: "/payroll/creation",
    section: "Payroll",
    icon: BadgeDollarSign,
    Component: PayrollCreation,
  },
  {
    title: "Payroll Approval",
    path: "/payroll/approval",
    section: "Payroll",
    icon: ClipboardCheck,
    Component: PayrollApproval,
  },
  {
    title: "Payroll History",
    path: "/payroll/history",
    section: "Payroll",
    icon: ReceiptText,
    Component: PayrollHistory,
  },
  {
    title: "Tax & Compliance",
    path: "/payroll/tax-compliance",
    section: "Payroll",
    icon: FileText,
    Component: TaxCompliance,
  },
  {
    title: "Bank Integration",
    path: "/payroll/bank-integration",
    section: "Payroll",
    icon: Landmark,
    Component: BankIntegration,
  },
  {
    title: "Compensation Data",
    path: "/payroll/compensation",
    section: "Payroll",
    icon: CreditCard,
    Component: CompensationData,
  },

  // ─── Finance Section ───
  {
    title: "Finance Dashboard",
    path: "/dashboard/finance",
    section: "Finance",
    icon: Banknote,
    Component: FinanceDashboard,
  },
  {
    title: "Bank Integration (Accounts)",
    path: "/finance/bank-integration",
    section: "Finance",
    icon: Landmark,
    Component: BankIntegrationAccounts,
  },
  {
    title: "Tax & Compliance (Accounts)",
    path: "/finance/tax-compliance",
    section: "Finance",
    icon: FileText,
    Component: TaxComplianceAccounts,
  },
  {
    title: "Benefits Management (Accounts)",
    path: "/finance/benefits",
    section: "Finance",
    icon: HandCoins,
    Component: BenefitsManagementAccounts,
  },
  {
    title: "Employee Finance",
    path: "/finance/employee",
    section: "Finance",
    icon: BriefcaseBusiness,
    Component: EmployeeFinance,
  },
  {
    title: "Finance Grievances",
    path: "/finance/finance-grievances",
    section: "Finance",
    icon: MessageCircleQuestion,
    Component: FinanceGrievances,
  },

  // ─── Employee Section ───
  {
    title: "Employee Dashboard",
    path: "/dashboard/employee",
    section: "Employee",
    icon: LayoutDashboard,
    Component: EmployeeDashboard,
  },
  {
    title: "My Attendance",
    path: "/self-service/attendance",
    section: "Employee",
    icon: CalendarClock,
    Component: MyAttendance,
  },
  {
    title: "My Performance",
    path: "/self-service/performance",
    section: "Employee",
    icon: TrendingUp,
    Component: MyPerformance,
  },
  {
    title: "My Benefits",
    path: "/self-service/benefits",
    section: "Employee",
    icon: HandCoins,
    Component: MyBenefits,
  },
  {
    title: "My Payslips",
    path: "/self-service/payslips",
    section: "Employee",
    icon: ReceiptText,
    Component: MyPayslips,
  },
  {
    title: "My Documents",
    path: "/self-service/documents",
    section: "Employee",
    icon: FolderOpen,
    Component: MyDocuments,
  },
  {
    title: "My Announcements",
    path: "/self-service/announcements",
    section: "Employee",
    icon: Bell,
    Component: MyAnnouncements,
  },
  {
    title: "Complaints",
    path: "/complaints",
    section: "Employee",
    icon: MessageCircleQuestion,
    Component: Complaints,
  },
];

export const moduleSections = Array.from(
  moduleRoutes.reduce((sections, moduleRoute) => {
    const sectionItems = sections.get(moduleRoute.section) ?? [];
    sectionItems.push(moduleRoute);
    sections.set(moduleRoute.section, sectionItems);
    return sections;
  }, new Map<string, ModuleRoute[]>()),
).map(([label, items]) => ({ label, items }));
