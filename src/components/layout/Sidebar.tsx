import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Settings,
  Building2,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'employees', name: 'Employees', icon: Users },
  { id: 'departments', name: 'Departments', icon: Building2 },
  { id: 'attendance', name: 'Attendance', icon: Clock },
  { id: 'leave', name: 'Leave Requests', icon: Calendar },
  { id: 'payroll', name: 'Payroll', icon: DollarSign },
  { id: 'reports', name: 'Reports', icon: FileText },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-card border-r border-border transition-all duration-300 relative",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-6">
        <div className="flex items-center gap-3">
          {!isCollapsed && (
            <>
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">HR Pro</h1>
                <p className="text-xs text-muted-foreground">Management System</p>
              </div>
            </>
          )}
        </div>
      </div>

      <nav className="px-3 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                isActive && "bg-accent text-accent-foreground font-medium",
                isCollapsed && "px-2"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Button>
          );
        })}
      </nav>

      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background shadow-md"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </Button>
    </div>
  );
}