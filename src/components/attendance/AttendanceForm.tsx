import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AttendanceRecord {
  id: number;
  employeeName: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  status: "Present" | "Late" | "Absent" | "Half Day";
  overtime: number;
}

const mockAttendance: AttendanceRecord[] = [
  { id: 1, employeeName: "John Doe", employeeId: "EMP001", date: "2024-01-15", checkIn: "09:00", checkOut: "17:30", hoursWorked: 8.5, status: "Present", overtime: 0.5 },
  { id: 2, employeeName: "Jane Smith", employeeId: "EMP002", date: "2024-01-15", checkIn: "09:15", checkOut: "17:00", hoursWorked: 7.75, status: "Late", overtime: 0 },
  { id: 3, employeeName: "Mike Johnson", employeeId: "EMP003", date: "2024-01-15", checkIn: "", checkOut: "", hoursWorked: 0, status: "Absent", overtime: 0 },
  { id: 4, employeeName: "Sarah Wilson", employeeId: "EMP004", date: "2024-01-15", checkIn: "09:00", checkOut: "13:00", hoursWorked: 4, status: "Half Day", overtime: 0 },
];

export function AttendanceForm() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendance);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    date: "",
    checkIn: "",
    checkOut: "",
    status: "Present" as "Present" | "Late" | "Absent" | "Half Day"
  });
  const { toast } = useToast();

  const calculateHours = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0;
    const [inHours, inMinutes] = checkIn.split(':').map(Number);
    const [outHours, outMinutes] = checkOut.split(':').map(Number);
    const inTime = inHours + inMinutes / 60;
    const outTime = outHours + outMinutes / 60;
    return Math.max(0, outTime - inTime);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hoursWorked = calculateHours(formData.checkIn, formData.checkOut);
    const overtime = Math.max(0, hoursWorked - 8);
    
    const newRecord: AttendanceRecord = {
      id: Math.max(...attendanceRecords.map(r => r.id)) + 1,
      ...formData,
      hoursWorked,
      overtime
    };
    
    setAttendanceRecords(records => [...records, newRecord]);
    toast({ title: "Attendance record added successfully!" });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      employeeName: "",
      employeeId: "",
      date: "",
      checkIn: "",
      checkOut: "",
      status: "Present"
    });
    setShowForm(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Late": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "Absent": return <XCircle className="w-4 h-4 text-red-500" />;
      case "Half Day": return <Clock className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Present": return "default";
      case "Late": return "secondary";
      case "Absent": return "destructive";
      case "Half Day": return "outline";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground">Track employee attendance and working hours</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Clock className="w-4 h-4" />
          Add Attendance
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Present Today</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Absent Today</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Late Arrivals</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Hours</p>
                <p className="text-2xl font-bold">8.2</p>
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
              Add Attendance Record
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkIn">Check In Time</Label>
                  <Input
                    id="checkIn"
                    type="time"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOut">Check Out Time</Label>
                  <Input
                    id="checkOut"
                    type="time"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add Record</Button>
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
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.employeeName}</div>
                      <div className="text-sm text-muted-foreground">{record.employeeId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.checkIn || "—"}</TableCell>
                  <TableCell>{record.checkOut || "—"}</TableCell>
                  <TableCell>{record.hoursWorked.toFixed(1)}h</TableCell>
                  <TableCell>{record.overtime.toFixed(1)}h</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <Badge variant={getStatusVariant(record.status) as any}>
                        {record.status}
                      </Badge>
                    </div>
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