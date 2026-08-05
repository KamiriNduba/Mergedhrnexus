import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../../services/api/auth';
import { employeeApi } from '../../../../services/api/employees';
import type { EmployeeDashboardData } from '../types/dashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<EmployeeDashboardData>({
    user: {
      name: "Loading...",
      location: "Loading...",
      department: "Loading..."
    },
    stats: [
      { label: "LEAVE BALANCE", value: "-- days" },
      { label: "ATTENDANCE THIS MONTH", value: "--%" },
      { label: "NEXT APPRAISAL", value: "-- " },
      { label: "PENDING REQUESTS", value: 0 },
    ],
    actions: [
      { title: "Check in", description: "GPS-verified attendance" },
      { title: "Request leave", description: "Annual, sick, compassionate" },
      { title: "View payslip", description: "June 2026 available" },
      { title: "My training", description: "1 mandatory pending" },
      { title: "File complaint", description: "Confidential submission" },
      { title: "Ask HR bot", description: "Leave, pay, policies" },
    ],
    timeline: [
      { date: "Mar 2022", title: "Joined Engineering", description: "Onboarded into Nairobi HQ grade E4" },
      { date: "Apr 2024", title: "Promoted to Senior", description: "Salary revised to band E4-upper" },
      { date: "Jun 2026", title: "Annual review open", description: "Self-review due 8 Jul" },
    ],
    tasks: [
      { id: "TSK-401", title: "Update tax computation module documentation", dueDate: "10 Jul", assignedBy: "Alice Njoki", status: "in progress" },
      { id: "TSK-405", title: "Review new team member onboarding access tickets", dueDate: "14 Jul", assignedBy: "Alice Njoki", status: "pending" },
      { id: "TSK-392", title: "Acknowledge updated remote work policy guidelines", dueDate: "30 Jun", assignedBy: "Alice Njoki", status: "completed" }
    ]
  });

  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load authenticated user data and employee profile
   */
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch current user
        const currentUser = await authApi.me();
        if (!currentUser) {
          navigate('/login');
          return;
        }

        // Fetch employee profile
        let employeeData = null;
        try {
          const employees = await employeeApi.list();
          // Find employee matching current user
          if (employees && Array.isArray(employees)) {
            employeeData = employees.find((emp: any) => emp.user?.id === currentUser.id);
          }
        } catch (error) {
          console.error("Failed to fetch employee data:", error);
        }

        // Update dashboard with real data
        setDashboardData(prev => ({
          ...prev,
          user: {
            name: currentUser.username || "Employee",
            location: employeeData?.branch?.name || "Unknown",
            department: employeeData?.department?.name || "Unknown"
          },
          stats: [
            { label: "LEAVE BALANCE", value: employeeData?.leave_balance || "-- days" },
            { label: "ATTENDANCE THIS MONTH", value: employeeData?.attendance_percentage || "--%" },
            { label: "NEXT APPRAISAL", value: employeeData?.next_appraisal_date || "-- " },
            { label: "PENDING REQUESTS", value: employeeData?.pending_requests || 0 },
          ]
        }));
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  /**
   * Handle quick action clicks
   */
  const handleQuickAction = (actionTitle: string) => {
    const actionRoutes: Record<string, string> = {
      "Check in": "/employee-self-service/attendance",
      "Request leave": "/employee-self-service/leave",
      "View payslip": "/employee-self-service/payslips",
      "My training": "/employee-self-service/training",
      "File complaint": "/employee-self-service/complaints",
      "Ask HR bot": "/ai-assistant",
    };

    const route = actionRoutes[actionTitle];
    if (route) {
      navigate(route);
    }
  };

  const handleStatusChange = (id: string, nextStatus: 'in progress' | 'completed') => {
    setDashboardData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === id ? { ...task, status: nextStatus } : task
      )
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-10 selection:bg-transparent">
      
      {/* Welcome Heading Banner */}
      <div className="mb-8">
        <h2 className="text-4xl font-serif text-slate-900 tracking-tight">
          Welcome back, {dashboardData.user.name}
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 font-medium">
          {dashboardData.user.location}, {dashboardData.user.department}
        </p>
      </div>

      {/* KPI Stats Top Grid Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {dashboardData.stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-[110px]">
            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
              {stat.label}
            </span>
            <span className="text-3xl font-light text-slate-800 mt-2 block">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Bottom Layout Architecture Main Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column Stack: Houses Quick Actions + Tasks Assigned Workspace Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Actions Panel Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-6">Quick actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {dashboardData.actions.map((action, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleQuickAction(action.title)}
                  className="border border-slate-100 bg-white hover:bg-slate-50 rounded-xl p-5 text-left transition min-h-[100px] flex flex-col justify-between outline-none cursor-pointer"
                >
                  <h4 className="text-sm font-bold text-slate-800">
                    {action.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {action.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Tasks Assigned Section Block */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 px-8 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-2.5 mb-2">
              Tasks assigned
            </h3>
            
            {/* Task Rows List Container */}
            <div className="divide-y divide-slate-100/60">
              {dashboardData.tasks.map((task) => (
                <div key={task.id} className="py-4.5 flex items-center justify-between hover:bg-slate-50/20 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 leading-snug">
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">
                      Assigned by: <span className="text-slate-500 font-semibold">{task.assignedBy}</span> • Due: <span className="font-semibold text-slate-500">{task.dueDate}</span>
                    </p>
                  </div>

                  {/* Interactive Status Dropdown Workflow Interface Selection Block */}
                  <div className="shrink-0 select-none">
                    {task.status === 'completed' ? (
                      <span className="inline-block text-center font-bold px-2.5 py-1 rounded text-[10px] scale-95 border lowercase bg-emerald-50 text-emerald-700 border-emerald-100/60 tracking-wide">
                        completed
                      </span>
                    ) : task.status === 'in progress' ? (
                      <button
                        onClick={() => handleStatusChange(task.id, 'completed')}
                        className="text-center font-bold px-2.5 py-1 rounded text-[10px] scale-95 border lowercase bg-blue-50 text-blue-700 border-blue-100/60 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all tracking-wide outline-none relative group"
                      >
                        <span className="group-hover:hidden">in progress</span>
                        <span className="hidden group-hover:inline">mark complete?</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(task.id, 'in progress')}
                        className="text-center font-bold px-2.5 py-1 rounded text-[10px] scale-95 border lowercase bg-orange-50 text-orange-700 border-orange-100/60 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all tracking-wide outline-none relative group"
                      >
                        <span className="group-hover:hidden">pending</span>
                        <span className="hidden group-hover:inline">start task?</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column Stack: Timeline Feed Card Sidebar */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm min-h-[380px]">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">My timeline</h3>
          <div className="relative border-l-2 border-slate-100 pl-6 ml-2 space-y-8">
            {dashboardData.timeline.map((event, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white ring-4 ring-white" />
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-1">
                  {event.date}
                </span>
                <h4 className="text-sm font-bold text-slate-800 leading-tight">
                  {event.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
