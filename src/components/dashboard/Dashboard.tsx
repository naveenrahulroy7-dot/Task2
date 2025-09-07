import { StatsCard } from "./StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck, Clock, TrendingUp, Calendar, AlertCircle } from "lucide-react";

const stats = [
  {
    title: "Total Employees",
    value: "1,247",
    change: "+12% from last month",
    changeType: 'positive' as const,
    icon: Users,
    iconColor: "text-primary"
  },
  {
    title: "Present Today",
    value: "1,156",
    change: "92.7% attendance rate",
    changeType: 'positive' as const,
    icon: UserCheck,
    iconColor: "text-success"
  },
  {
    title: "Pending Leaves",
    value: "23",
    change: "5 urgent requests",
    changeType: 'neutral' as const,
    icon: Calendar,
    iconColor: "text-warning"
  },
  {
    title: "Avg Working Hours",
    value: "8.2h",
    change: "+0.3h from last week",
    changeType: 'positive' as const,
    icon: Clock,
    iconColor: "text-info"
  },
];

const recentActivities = [
  {
    id: 1,
    action: "New employee onboarded",
    employee: "Alex Chen",
    department: "Engineering",
    time: "2 hours ago",
    type: "success"
  },
  {
    id: 2,
    action: "Leave request submitted",
    employee: "Maria Garcia",
    department: "Marketing",
    time: "4 hours ago",
    type: "pending"
  },
  {
    id: 3,
    action: "Performance review completed",
    employee: "John Smith",
    department: "Sales",
    time: "1 day ago",
    type: "success"
  },
];

const departmentStats = [
  { name: "Engineering", count: 342, percentage: 65 },
  { name: "Sales", count: 198, percentage: 45 },
  { name: "Marketing", count: 124, percentage: 78 },
  { name: "HR", count: 56, percentage: 90 },
  { name: "Finance", count: 89, percentage: 82 },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening at your company today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Department Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{dept.name}</span>
                  <span className="text-sm text-muted-foreground">{dept.count} employees</span>
                </div>
                <Progress value={dept.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.employee} • {activity.department}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
                <Badge variant={activity.type === 'success' ? 'default' : 'secondary'}>
                  {activity.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}