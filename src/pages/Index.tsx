import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { EmployeeList } from "@/components/employees/EmployeeList";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "employees":
        return <EmployeeList />;
      case "departments":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Departments</h2>
            <p className="text-muted-foreground">Department management coming soon. Connect Supabase to enable full functionality.</p>
          </div>
        );
      case "attendance":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Attendance</h2>
            <p className="text-muted-foreground">Attendance tracking coming soon. Connect Supabase to enable full functionality.</p>
          </div>
        );
      case "leave":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Leave Requests</h2>
            <p className="text-muted-foreground">Leave management coming soon. Connect Supabase to enable full functionality.</p>
          </div>
        );
      case "payroll":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Payroll</h2>
            <p className="text-muted-foreground">Payroll management coming soon. Connect Supabase to enable full functionality.</p>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Reports</h2>
            <p className="text-muted-foreground">Reporting features coming soon. Connect Supabase to enable full functionality.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
