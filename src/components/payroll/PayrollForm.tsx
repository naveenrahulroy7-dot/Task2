import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calculator, Download, Eye, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PayrollRecord {
  id: number;
  employeeName: string;
  employeeId: string;
  position: string;
  basicSalary: number;
  allowances: number;
  overtime: number;
  deductions: number;
  grossPay: number;
  taxDeduction: number;
  netPay: number;
  payPeriod: string;
  status: "Processed" | "Pending" | "Paid";
}

const mockPayroll: PayrollRecord[] = [
  {
    id: 1,
    employeeName: "John Doe",
    employeeId: "EMP001",
    position: "Software Engineer",
    basicSalary: 5000,
    allowances: 500,
    overtime: 200,
    deductions: 100,
    grossPay: 5600,
    taxDeduction: 840,
    netPay: 4760,
    payPeriod: "January 2024",
    status: "Paid"
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    employeeId: "EMP002",
    position: "HR Manager",
    basicSalary: 6000,
    allowances: 600,
    overtime: 0,
    deductions: 50,
    grossPay: 6550,
    taxDeduction: 982.5,
    netPay: 5567.5,
    payPeriod: "January 2024",
    status: "Processed"
  },
  {
    id: 3,
    employeeName: "Mike Johnson",
    employeeId: "EMP003",
    position: "Sales Executive",
    basicSalary: 4000,
    allowances: 400,
    overtime: 300,
    deductions: 80,
    grossPay: 4620,
    taxDeduction: 693,
    netPay: 3927,
    payPeriod: "January 2024",
    status: "Pending"
  },
];

export function PayrollForm() {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayroll);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    position: "",
    basicSalary: 0,
    allowances: 0,
    overtime: 0,
    deductions: 0,
    payPeriod: ""
  });
  const { toast } = useToast();

  const calculatePayroll = (basic: number, allowances: number, overtime: number, deductions: number) => {
    const grossPay = basic + allowances + overtime - deductions;
    const taxDeduction = grossPay * 0.15; // 15% tax rate
    const netPay = grossPay - taxDeduction;
    return { grossPay, taxDeduction, netPay };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { grossPay, taxDeduction, netPay } = calculatePayroll(
      formData.basicSalary,
      formData.allowances,
      formData.overtime,
      formData.deductions
    );
    
    const newRecord: PayrollRecord = {
      id: Math.max(...payrollRecords.map(r => r.id)) + 1,
      ...formData,
      grossPay,
      taxDeduction,
      netPay,
      status: "Pending"
    };
    
    setPayrollRecords(records => [...records, newRecord]);
    toast({ title: "Payroll record created successfully!" });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      employeeName: "",
      employeeId: "",
      position: "",
      basicSalary: 0,
      allowances: 0,
      overtime: 0,
      deductions: 0,
      payPeriod: ""
    });
    setShowForm(false);
  };

  const handleStatusChange = (id: number, status: "Processed" | "Paid") => {
    setPayrollRecords(records => 
      records.map(record => 
        record.id === id ? { ...record, status } : record
      )
    );
    toast({ title: `Payroll ${status.toLowerCase()} successfully!` });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Paid": return "default";
      case "Processed": return "secondary";
      case "Pending": return "outline";
      default: return "default";
    }
  };

  const totalGrossPay = payrollRecords.reduce((sum, record) => sum + record.grossPay, 0);
  const totalNetPay = payrollRecords.reduce((sum, record) => sum + record.netPay, 0);
  const totalTaxes = payrollRecords.reduce((sum, record) => sum + record.taxDeduction, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground">Process employee salaries and manage payroll</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Payroll Record
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Gross Pay</p>
                <p className="text-2xl font-bold">${totalGrossPay.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Net Pay</p>
                <p className="text-2xl font-bold">${totalNetPay.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Taxes</p>
                <p className="text-2xl font-bold">${totalTaxes.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="text-2xl font-bold">{payrollRecords.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Add Payroll Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    placeholder="Enter position"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basicSalary">Basic Salary ($)</Label>
                  <Input
                    id="basicSalary"
                    type="number"
                    value={formData.basicSalary}
                    onChange={(e) => setFormData({...formData, basicSalary: parseFloat(e.target.value) || 0})}
                    placeholder="Enter basic salary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payPeriod">Pay Period</Label>
                  <Input
                    id="payPeriod"
                    value={formData.payPeriod}
                    onChange={(e) => setFormData({...formData, payPeriod: e.target.value})}
                    placeholder="e.g., January 2024"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="allowances">Allowances ($)</Label>
                  <Input
                    id="allowances"
                    type="number"
                    value={formData.allowances}
                    onChange={(e) => setFormData({...formData, allowances: parseFloat(e.target.value) || 0})}
                    placeholder="Enter allowances"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overtime">Overtime ($)</Label>
                  <Input
                    id="overtime"
                    type="number"
                    value={formData.overtime}
                    onChange={(e) => setFormData({...formData, overtime: parseFloat(e.target.value) || 0})}
                    placeholder="Enter overtime pay"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deductions">Deductions ($)</Label>
                  <Input
                    id="deductions"
                    type="number"
                    value={formData.deductions}
                    onChange={(e) => setFormData({...formData, deductions: parseFloat(e.target.value) || 0})}
                    placeholder="Enter deductions"
                  />
                </div>
              </div>

              {(formData.basicSalary > 0) && (
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-medium mb-2">Calculation Preview:</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Gross Pay:</span>
                      <p className="font-medium">${calculatePayroll(formData.basicSalary, formData.allowances, formData.overtime, formData.deductions).grossPay.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tax (15%):</span>
                      <p className="font-medium">${calculatePayroll(formData.basicSalary, formData.allowances, formData.overtime, formData.deductions).taxDeduction.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Net Pay:</span>
                      <p className="font-medium">${calculatePayroll(formData.basicSalary, formData.allowances, formData.overtime, formData.deductions).netPay.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit">Create Payroll Record</Button>
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
          <CardTitle>Payroll Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>Gross Pay</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.employeeName}</div>
                      <div className="text-sm text-muted-foreground">{record.employeeId} • {record.position}</div>
                    </div>
                  </TableCell>
                  <TableCell>{record.payPeriod}</TableCell>
                  <TableCell>${record.basicSalary.toLocaleString()}</TableCell>
                  <TableCell>${record.grossPay.toLocaleString()}</TableCell>
                  <TableCell>${record.taxDeduction.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">${record.netPay.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(record.status) as any}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                      {record.status === "Pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(record.id, "Processed")}
                        >
                          Process
                        </Button>
                      )}
                      {record.status === "Processed" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(record.id, "Paid")}
                        >
                          Mark Paid
                        </Button>
                      )}
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