import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { EmployeeList } from "@/components/employees/EmployeeList";
import { DepartmentForm } from "@/components/departments/DepartmentForm";
import { AttendanceForm } from "@/components/attendance/AttendanceForm";
import { LeaveRequestForm } from "@/components/leave/LeaveRequestForm";
import { PayrollForm } from "@/components/payroll/PayrollForm";
import { ReportsForm } from "@/components/reports/ReportsForm";
import { ProfileManagement } from "@/components/profile/ProfileManagement";
import { AppStoreProvider } from "@/store/AppStore";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "employees":
        return <EmployeeList />;
      case "departments":
        return <DepartmentForm />;
      case "attendance":
        return <AttendanceForm />;
      case "leave":
        return <LeaveRequestForm />;
      case "payroll":
        return <PayrollForm />;
      case "reports":
        return <ReportsForm />;
      case "profile":
        return <ProfileManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppStoreProvider>
      <div className="flex h-screen bg-background">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </AppStoreProvider>
  );
};

export default Index;
