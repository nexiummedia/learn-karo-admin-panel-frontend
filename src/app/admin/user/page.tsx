import React from "react";
import { MoreVertical, Shield } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  lastLogin: string;
}

export default function UserManagementPage() {
  const users: AdminUserRecord[] = [
    {
      id: "usr_01",
      name: "Rahul Sharma",
      email: "rahul@learnkaro.com",
      role: "Super Admin",
      status: "Active",
      lastLogin: "Just now",
    },
    {
      id: "usr_02",
      name: "Priya Patel",
      email: "priya@learnkaro.com",
      role: "Course Manager",
      status: "Active",
      lastLogin: "2 hours ago",
    },
    {
      id: "usr_03",
      name: "Aman Verma",
      email: "aman@learnkaro.com",
      role: "Instructor",
      status: "Inactive",
      lastLogin: "3 days ago",
    },
    {
      id: "usr_04",
      name: "Tanvi Kapoor",
      email: "tanvi@learnkaro.com",
      role: "Instructor",
      status: "Active",
      lastLogin: "Yesterday",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Admin Staff & Instructors
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage system roles, permissions, and staff accounts.
        </p>
      </div>

      <Table>
        <TableHeader>
          <tr>
            <TableHead>Staff Member</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Assigned Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {users.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
                    {item.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-slate-900">{item.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-slate-500 text-xs">{item.email}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  <Shield className="w-3 h-3 text-slate-500" />
                  {item.role}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={item.status === "Active" ? "success" : "neutral"} size="sm" dot>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-slate-500 text-xs">{item.lastLogin}</TableCell>
              <TableCell className="text-right">
                <button className="text-slate-400 hover:text-slate-700 p-1 rounded cursor-pointer">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
