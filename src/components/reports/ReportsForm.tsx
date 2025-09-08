import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Users, DollarSign, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Report {
  id: number;
  title: string;
  type: string;
  description: string;
  generatedOn: string;
  period: string;
  status: "Generated" | "Processing" | "Failed";
  size: string;
}

const mockReports: Report[] = [
  {
    id: 1,
    title: "Monthly Payroll Report - January 2024",
    type: "Payroll",
    description: "Complete payroll summary including taxes and deductions",
    generatedOn: "2024-01-31",
    period: "January 2024",
    status: "Generated",
    size: "2.3 MB"
  },
  {
    id: 2,
    title: "Employee Attendance Summary - Q1 2024",
    type: "Attendance",
    description: "Quarterly attendance analysis with overtime calculations",
    generatedOn: "2024-01-15",
    period: "Q1 2024",
    status: "Generated",
    size: "1.8 MB"
  },
  {
    id: 3,
    title: "Leave Requests Analysis - 2023",
    type: "Leave",
    description: "Annual leave patterns and approval statistics",
    generatedOn: "2024-01-10",
    period: "2023",
    status: "Processing",
    size: "—"
  },
  {
    id: 4,
    title: "Department Performance Metrics",
    type: "Performance",
    description: "Cross-departmental productivity and efficiency metrics",
    generatedOn: "2024-01-05",
    period: "December 2023",
    status: "Generated",
    size: "3.1 MB"
  },
];

const reportTypes = [
  { value: "payroll", label: "Payroll Report", icon: DollarSign, description: "Salary, taxes, and compensation details" },
  { value: "attendance", label: "Attendance Report", icon: Clock, description: "Work hours, overtime, and punctuality" },
  { value: "leave", label: "Leave Report", icon: Calendar, description: "Leave requests, balances, and patterns" },
  { value: "employee", label: "Employee Report", icon: Users, description: "Staff demographics and organizational data" },
  { value: "performance", label: "Performance Report", icon: TrendingUp, description: "KPIs and productivity metrics" },
  { value: "custom", label: "Custom Report", icon: BarChart3, description: "Build your own report with selected metrics" },
];

export function ReportsForm() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    period: "",
    description: "",
    includeCharts: true,
    format: "PDF"
  });
  const { toast } = useToast();

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedReportType = reportTypes.find(type => type.value === selectedType);
    
    const newReport: Report = {
      id: Math.max(...reports.map(r => r.id)) + 1,
      title: formData.title || `${selectedReportType?.label} - ${formData.period}`,
      type: selectedReportType?.label || "Custom",
      description: formData.description,
      generatedOn: new Date().toISOString().split('T')[0],
      period: formData.period,
      status: "Processing",
      size: "—"
    };
    
    setReports(prev => [...prev, newReport]);
    toast({ title: "Report generation started!" });
    
    // Simulate report processing
    setTimeout(() => {
      setReports(prev => prev.map(report => 
        report.id === newReport.id 
          ? { ...report, status: "Generated" as const, size: "2.1 MB" }
          : report
      ));
      toast({ title: "Report generated successfully!" });
    }, 3000);
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      period: "",
      description: "",
      includeCharts: true,
      format: "PDF"
    });
    setSelectedType("");
    setShowForm(false);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Generated": return "default";
      case "Processing": return "secondary";
      case "Failed": return "destructive";
      default: return "default";
    }
  };

  const handleDownload = (reportId: number) => {
    toast({ title: "Report download started!" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate comprehensive HR reports and insights</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <FileText className="w-4 h-4" />
          Generate Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{reports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Downloads</p>
                <p className="text-2xl font-bold">48</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Generate New Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateReport} className="space-y-6">
              <div className="space-y-4">
                <Label>Select Report Type</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedType === type.value 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedType(type.value)}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium">{type.label}</h3>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedType && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Custom Title (Optional)</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter custom report title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="period">Period</Label>
                      <Input
                        id="period"
                        value={formData.period}
                        onChange={(e) => setFormData({...formData, period: e.target.value})}
                        placeholder="e.g., January 2024, Q1 2024"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Brief description of the report"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="format">Export Format</Label>
                      <select
                        id="format"
                        value={formData.format}
                        onChange={(e) => setFormData({...formData, format: e.target.value})}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      >
                        <option value="PDF">PDF</option>
                        <option value="Excel">Excel</option>
                        <option value="CSV">CSV</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <input
                        type="checkbox"
                        id="includeCharts"
                        checked={formData.includeCharts}
                        onChange={(e) => setFormData({...formData, includeCharts: e.target.checked})}
                        className="rounded border-input"
                      />
                      <Label htmlFor="includeCharts">Include Charts & Graphs</Label>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={!selectedType}>
                  Generate Report
                </Button>
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
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Generated: {report.generatedOn}</span>
                      <span>Period: {report.period}</span>
                      <span>Size: {report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(report.status) as any}>
                    {report.status}
                  </Badge>
                  {report.status === "Generated" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(report.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}