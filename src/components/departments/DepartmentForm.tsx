import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Department {
  id: number;
  name: string;
  description: string;
  manager: string;
  employeeCount: number;
  status: "Active" | "Inactive";
}

const mockDepartments: Department[] = [
  { id: 1, name: "Human Resources", description: "Employee management and HR policies", manager: "Sarah Johnson", employeeCount: 8, status: "Active" },
  { id: 2, name: "Engineering", description: "Software development and technical operations", manager: "Mike Chen", employeeCount: 25, status: "Active" },
  { id: 3, name: "Sales", description: "Business development and client relations", manager: "Emily Davis", employeeCount: 12, status: "Active" },
  { id: 4, name: "Marketing", description: "Brand promotion and digital marketing", manager: "Alex Wilson", employeeCount: 6, status: "Inactive" },
];

export function DepartmentForm() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager: "",
    employeeCount: 0,
    status: "Active" as "Active" | "Inactive"
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setDepartments(deps => deps.map(dep => 
        dep.id === editingId 
          ? { ...dep, ...formData }
          : dep
      ));
      toast({ title: "Department updated successfully!" });
    } else {
      const newDepartment: Department = {
        id: Math.max(...departments.map(d => d.id)) + 1,
        ...formData
      };
      setDepartments(deps => [...deps, newDepartment]);
      toast({ title: "Department created successfully!" });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      manager: "",
      employeeCount: 0,
      status: "Active"
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (department: Department) => {
    setFormData({
      name: department.name,
      description: department.description,
      manager: department.manager,
      employeeCount: department.employeeCount,
      status: department.status
    });
    setEditingId(department.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setDepartments(deps => deps.filter(dep => dep.id !== id));
    toast({ title: "Department deleted successfully!" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Departments</h1>
          <p className="text-muted-foreground">Manage company departments and organizational structure</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Department
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {editingId ? "Edit Department" : "Add New Department"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter department name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Department Manager</Label>
                  <Input
                    id="manager"
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    placeholder="Enter manager name"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter department description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Employee Count</Label>
                  <Input
                    id="employeeCount"
                    type="number"
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({...formData, employeeCount: parseInt(e.target.value) || 0})}
                    placeholder="Number of employees"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as "Active" | "Inactive"})}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingId ? "Update" : "Create"} Department</Button>
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
          <CardTitle>All Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{department.name}</div>
                      <div className="text-sm text-muted-foreground">{department.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{department.manager}</TableCell>
                  <TableCell>{department.employeeCount}</TableCell>
                  <TableCell>
                    <Badge variant={department.status === "Active" ? "default" : "secondary"}>
                      {department.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(department)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(department.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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