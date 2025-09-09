import React, { createContext, useContext, useMemo, useState } from "react";

export type Employee = {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: "Active" | "On Leave" | "Inactive";
  joinDate: string;
  avatar: string;
  address?: string;
  salary?: string;
  emergencyContact?: string;
};

export type Profile = {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
  address: string;
  bio: string;
  avatar: string;
};

type AppStoreState = {
  employees: Employee[];
  profile: Profile;
  addEmployee: (employee: Partial<Employee>) => void;
  updateEmployee: (id: number, updates: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
  updateProfile: (updates: Partial<Profile>) => void;
};

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    position: "Senior Developer",
    status: "Active",
    joinDate: "2022-03-15",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@company.com",
    phone: "+1 (555) 234-5678",
    department: "Marketing",
    position: "Marketing Manager",
    status: "Active",
    joinDate: "2021-08-22",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    phone: "+1 (555) 345-6789",
    department: "Sales",
    position: "Sales Representative",
    status: "On Leave",
    joinDate: "2023-01-10",
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@company.com",
    phone: "+1 (555) 456-7890",
    department: "Engineering",
    position: "DevOps Engineer",
    status: "Active",
    joinDate: "2022-11-05",
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa.wang@company.com",
    phone: "+1 (555) 567-8901",
    department: "HR",
    position: "HR Specialist",
    status: "Active",
    joinDate: "2021-06-18",
    avatar: "/placeholder.svg",
  },
];

const initialProfile: Profile = {
  name: "Sarah Johnson",
  email: "sarah.johnson@company.com",
  phone: "+1 (555) 123-4567",
  position: "HR Manager",
  department: "Human Resources",
  joinDate: "2021-03-15",
  address: "123 Main St, New York, NY 10001",
  bio: "Experienced HR professional with over 8 years in talent management and organizational development.",
  avatar: "/placeholder.svg",
};

const AppStoreContext = createContext<AppStoreState | undefined>(undefined);

export const AppStoreProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [profile, setProfile] = useState<Profile>(initialProfile);

  const addEmployee = (employee: Partial<Employee>) => {
    setEmployees((prev) => [
      ...prev,
      {
        id: Date.now(),
        status: (employee.status as Employee["status"]) || "Active",
        avatar: employee.avatar || "/placeholder.svg",
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department: employee.department || "",
        position: employee.position || "",
        joinDate: employee.joinDate || new Date().toISOString().substring(0, 10),
        address: employee.address,
        salary: employee.salary,
        emergencyContact: employee.emergencyContact,
      },
    ]);
  };

  const updateEmployee = (id: number, updates: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteEmployee = (id: number) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const value = useMemo(
    () => ({ employees, profile, addEmployee, updateEmployee, deleteEmployee, updateProfile }),
    [employees, profile]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};

export const useAppStore = () => {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
};
