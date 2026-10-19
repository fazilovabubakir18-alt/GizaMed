import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { TopBar } from './components/common/TopBar';
import { Sidebar, NavItemKey } from './components/common/Sidebar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { QuickActionModal } from './components/common/QuickActionModal';
import { CustomizerDrawer } from './components/common/CustomizerDrawer';

import { DashboardView } from './components/dashboard/DashboardView';
import { StudentsView } from './components/students/StudentsView';
import { TeachersView } from './components/teachers/TeachersView';
import { CoursesGroupsView } from './components/courses/CoursesGroupsView';
import { ScheduleView } from './components/schedule/ScheduleView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { HomeworkView } from './components/homework/HomeworkView';
import { CRMView } from './components/crm/CRMView';
import { EContractView } from './components/contracts/EContractView';
import { FinanceView } from './components/finance/FinanceView';
import { BranchesStaffView } from './components/branches/BranchesStaffView';
import { AIAssistantView } from './components/ai/AIAssistantView';
import { ReportsView } from './components/reports/ReportsView';
import { SupportView } from './components/support/SupportView';
import { SettingsView } from './components/settings/SettingsView';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavItemKey>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Cross-module states
  const [initialStudentIdForPayment, setInitialStudentIdForPayment] = useState<string | null>(null);

  const handleOpenSpecificModal = (actionType: 'add_lead' | 'add_student' | 'add_teacher' | 'add_payment' | 'add_contract' | 'add_expense') => {
    if (actionType === 'add_lead') {
      setActiveTab('crm');
    } else if (actionType === 'add_student') {
      setActiveTab('students');
    } else if (actionType === 'add_teacher') {
      setActiveTab('teachers');
    } else if (actionType === 'add_payment') {
      setActiveTab('finance');
    } else if (actionType === 'add_contract') {
      setActiveTab('contracts');
    } else if (actionType === 'add_expense') {
      setActiveTab('finance');
    }
  };

  const handleOpenPaymentForStudent = (studentId: string) => {
    setInitialStudentIdForPayment(studentId);
    setActiveTab('finance');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <TopBar
          onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
          onOpenQuickAction={() => setIsQuickActionOpen(true)}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={setActiveTab}
              onOpenQuickAction={handleOpenSpecificModal}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              onOpenPaymentModal={handleOpenPaymentForStudent}
            />
          )}

          {activeTab === 'teachers' && <TeachersView />}

          {activeTab === 'courses' && <CoursesGroupsView />}

          {activeTab === 'schedule' && <ScheduleView />}

          {activeTab === 'attendance' && <AttendanceView />}

          {activeTab === 'homework' && <HomeworkView />}

          {activeTab === 'crm' && <CRMView />}

          {activeTab === 'contracts' && <EContractView />}

          {activeTab === 'finance' && (
            <FinanceView
              initialStudentIdForPayment={initialStudentIdForPayment}
              onClearInitialStudentId={() => setInitialStudentIdForPayment(null)}
            />
          )}

          {activeTab === 'branches' && <BranchesStaffView />}

          {activeTab === 'aiAssistant' && <AIAssistantView />}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'support' && <SupportView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onNavigate={setActiveTab}
      />

      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onOpenSpecificModal={handleOpenSpecificModal}
      />

      <CustomizerDrawer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
