import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Check, X, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LeaveRequest {
  id: number;
  employeeName: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedOn: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 1,
    employeeName: "John Doe",
    employeeId: "EMP001",
    leaveType: "Annual Leave",
    startDate: "2024-01-20",
    endDate: "2024-01-25",
    days: 6,
    reason: "Family vacation",
    status: "Approved",
    appliedOn: "2024-01-10"
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    employeeId: "EMP002",
    leaveType: "Sick Leave",
    startDate: "2024-01-18",
    endDate: "2024-01-19",
    days: 2,
    reason: "Medical appointment",
    status: "Pending",
    appliedOn: "2024-01-15"
  },
  {
    id: 3,
    employeeName: "Mike Johnson",
    employeeId: "EMP003",
    leaveType: "Personal Leave",
    startDate: "2024-01-22",
    endDate: "2024-01-22",
    days: 1,
    reason: "Personal emergency",
    status: "Rejected",
    appliedOn: "2024-01-16"
  },
];

const leaveTypes = [
  "Annual Leave",
  "Sick Leave",
  "Personal Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Emergency Leave",
  "Bereavement Leave"
];

export function LeaveRequestForm() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: ""
  });
  const { toast } = useToast();

  const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const days = calculateDays(formData.startDate, formData.endDate);
    
    const newRequest: LeaveRequest = {
      id: Math.max(...leaveRequests.map(r => r.id)) + 1,
      ...formData,
      days,
      status: "Pending",
      appliedOn: new Date().toISOString().split('T')[0]
    };
    
    setLeaveRequests(requests => [...requests, newRequest]);
    toast({ title: "Leave request submitted successfully!" });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      employeeName: "",
      employeeId: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: ""
    });
    setShowForm(false);
  };

  const handleStatusChange = (id: number, status: "Approved" | "Rejected") => {
    setLeaveRequests(requests => 
      requests.map(request => 
        request.id === id ? { ...request, status } : request
      )
    );
    toast({ title: `Leave request ${status.toLowerCase()} successfully!` });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved": return <Check className="w-4 h-4 text-green-500" />;
      case "Rejected": return <X className="w-4 h-4 text-red-500" />;
      case "Pending": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Approved": return "default";
      case "Rejected": return "destructive";
      case "Pending": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leave Requests</h1>
          <p className="text-muted-foreground">Manage employee leave applications and approvals</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Calendar className="w-4 h-4" />
          New Leave Request
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Approved This Month</p>
                <p className="text-2xl font-bold">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Average Days</p>
                <p className="text-2xl font-bold">3.2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Submit Leave Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeName">Employee Name</Label>
                  <Input
                    id="employeeName"
                    value={formData.employeeName}
                    onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                    placeholder="Enter employee name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                    placeholder="Enter employee ID"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="leaveType">Leave Type</Label>
                <select
                  id="leaveType"
                  value={formData.leaveType}
                  onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  required
                >
                  <option value="">Select leave type</option>
                  {leaveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              {formData.startDate && formData.endDate && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">
                    <strong>Total Days:</strong> {calculateDays(formData.startDate, formData.endDate)} days
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Enter reason for leave"
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Submit Request</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.employeeName}</div>
                      <div className="text-sm text-muted-foreground">{request.employeeId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{request.leaveType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{request.startDate}</div>
                      <div className="text-muted-foreground">to {request.endDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>{request.days} days</TableCell>
                  <TableCell>{request.appliedOn}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <Badge variant={getStatusVariant(request.status) as any}>
                        {request.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.status === "Pending" && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(request.id, "Approved")}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(request.id, "Rejected")}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}