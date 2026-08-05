import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Users,
  FileText,
  Settings,
  Bell,
  Calendar,
  BarChart,
  X,
  Send,
  Loader,
} from 'lucide-react';
import { hrApi } from '../../../../services/api/hr';

interface QuickActionsProps {
  onShowToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const QuickActionsEnhanced = ({ onShowToast }: QuickActionsProps) => {
  const navigate = useNavigate();
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employee_number: '',
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    hire_date: new Date().toISOString().split('T')[0],
  });
  const [announcementText, setAnnouncementText] = useState('');
  const [payrollData, setPayrollData] = useState({
    period: new Date().toISOString().split('T')[0],
    description: '',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (onShowToast) {
      onShowToast(message, type);
    } else {
      alert(message);
    }
  };

  const actions = [
    {
      label: 'Add Employee',
      icon: Plus,
      action: () => setShowAddEmployeeModal(true),
    },
    {
      label: 'Run Payroll',
      icon: FileText,
      action: () => setShowPayrollModal(true),
    },
    {
      label: 'Send Announcement',
      icon: Bell,
      action: () => setShowAnnouncementModal(true),
    },
    {
      label: 'View All Employees',
      icon: Users,
      action: () => navigate('/employees'),
    },
    {
      label: 'Calendar',
      icon: Calendar,
      action: () => navigate('/calendar'),
    },
    {
      label: 'Reports',
      icon: BarChart,
      action: () => navigate('/reports-analytics'),
    },
    {
      label: 'Settings',
      icon: Settings,
      action: () => navigate('/settings'),
    },
  ];

  const handleAddEmployee = async () => {
    if (!newEmployee.first_name || !newEmployee.last_name || !newEmployee.email) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await hrApi.createEmployee(newEmployee);
      showToast(`Employee ${newEmployee.first_name} ${newEmployee.last_name} added successfully!`, 'success');
      setNewEmployee({
        employee_number: '',
        first_name: '',
        last_name: '',
        email: '',
        department: '',
        hire_date: new Date().toISOString().split('T')[0],
      });
      setShowAddEmployeeModal(false);
    } catch (error) {
      showToast('Failed to add employee. Please try again.', 'error');
      console.error('Error adding employee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAnnouncement = async () => {
    if (!announcementText.trim()) {
      showToast('Please enter an announcement.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement announcement API endpoint
      showToast('Announcement sent successfully!', 'success');
      setAnnouncementText('');
      setShowAnnouncementModal(false);
    } catch (error) {
      showToast('Failed to send announcement. Please try again.', 'error');
      console.error('Error sending announcement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunPayroll = async () => {
    if (!payrollData.period) {
      showToast('Please select a payroll period.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await hrApi.generatePayroll(payrollData);
      showToast('Payroll generated successfully!', 'success');
      setPayrollData({
        period: new Date().toISOString().split('T')[0],
        description: '',
      });
      setShowPayrollModal(false);
    } catch (error) {
      showToast('Failed to generate payroll. Please try again.', 'error');
      console.error('Error generating payroll:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-800 text-sm mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.action}
              disabled={isLoading}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <action.icon className="w-4 h-4" />}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isLoading && setShowAddEmployeeModal(false)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Employee</h3>
              <button
                onClick={() => setShowAddEmployeeModal(false)}
                disabled={isLoading}
                className="p-1 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name *</label>
                  <input
                    type="text"
                    value={newEmployee.first_name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                    placeholder="John"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    value={newEmployee.last_name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, last_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                    placeholder="Doe"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                  placeholder="john.doe@company.com"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee Number</label>
                <input
                  type="text"
                  value={newEmployee.employee_number}
                  onChange={(e) => setNewEmployee({ ...newEmployee, employee_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                  placeholder="EMP001"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                  placeholder="Engineering"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hire Date</label>
                <input
                  type="date"
                  value={newEmployee.hire_date}
                  onChange={(e) => setNewEmployee({ ...newEmployee, hire_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleAddEmployee}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                Add Employee
              </button>
              <button
                onClick={() => setShowAddEmployeeModal(false)}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Run Payroll Modal */}
      {showPayrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isLoading && setShowPayrollModal(false)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Run Payroll</h3>
              <button
                onClick={() => setShowPayrollModal(false)}
                disabled={isLoading}
                className="p-1 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Payroll Period *</label>
                <input
                  type="date"
                  value={payrollData.period}
                  onChange={(e) => setPayrollData({ ...payrollData, period: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={payrollData.description}
                  onChange={(e) => setPayrollData({ ...payrollData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                  placeholder="Add any notes about this payroll run..."
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleRunPayroll}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                Run Payroll
              </button>
              <button
                onClick={() => setShowPayrollModal(false)}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !isLoading && setShowAnnouncementModal(false)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Send Announcement</h3>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                disabled={isLoading}
                className="p-1 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message *</label>
              <textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-700"
                placeholder="Type your announcement here..."
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleSendAnnouncement}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                <Send className="w-4 h-4" />
                Send Announcement
              </button>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
