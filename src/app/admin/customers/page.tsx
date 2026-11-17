"use client";

import React, { useState } from "react";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from "@/components/ui/Table";
import { MoreVertical } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  coursesCount: number;
  totalSpent: string;
  progress: number;
  status: "Active" | "Completed" | "Inactive";
  joinedDate: string;
}

export default function CustomersPage() {
  const [customers] = useState<Customer[]>([
    {
      id: "c-1",
      name: "Aarav Sharma",
      email: "aarav@gmail.com",
      coursesCount: 3,
      totalSpent: "₹14,997",
      progress: 85,
      status: "Active",
      joinedDate: "Oct 12, 2026",
    },
    {
      id: "c-2",
      name: "Sneha Reddy",
      email: "sneha.r@outlook.com",
      coursesCount: 2,
      totalSpent: "₹12,498",
      progress: 60,
      status: "Active",
      joinedDate: "Oct 28, 2026",
    },
    {
      id: "c-3",
      name: "Rohan Gupta",
      email: "rohan.g@gmail.com",
      coursesCount: 4,
      totalSpent: "₹21,996",
      progress: 100,
      status: "Completed",
      joinedDate: "Sep 15, 2026",
    },
    {
      id: "c-4",
      name: "Pooja Malhotra",
      email: "pooja.m@yahoo.com",
      coursesCount: 1,
      totalSpent: "₹3,499",
      progress: 40,
      status: "Active",
      joinedDate: "Nov 02, 2026",
    },
    {
      id: "c-5",
      name: "Siddharth Sen",
      email: "sid.sen@gmail.com",
      coursesCount: 1,
      totalSpent: "₹4,999",
      progress: 10,
      status: "Inactive",
      joinedDate: "Aug 20, 2026",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Students & Customers</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage enrolled learners, monitor their curriculum progress and lifetime value.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium uppercase">Total Students</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">14,248</p>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium uppercase">Active Learners</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">11,890</p>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium uppercase">Avg. Course Completion</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">72.4%</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            placeholder="Search student by name or email..."
          />
        </div>

        <div className="w-full sm:w-40">
          <Select
            options={[
              { value: "all", label: "All Statuses" },
              { value: "active", label: "Active" },
              { value: "completed", label: "Completed" },
              { value: "inactive", label: "Inactive" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Table */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Student</TableHead>
            <TableHead>Courses Enrolled</TableHead>
            <TableHead>Learning Progress</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredCustomers.length === 0 ? (
            <TableEmpty message="No students found." colSpan={7} />
          ) : (
            filteredCustomers.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{c.name}</p>
                      <p className="text-[11px] text-slate-400">{c.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-slate-700">
                    {c.coursesCount} {c.coursesCount === 1 ? "course" : "courses"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="w-32 space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                      <span>{c.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-slate-900 h-full rounded-full"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-slate-900">{c.totalSpent}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      c.status === "Active"
                        ? "success"
                        : c.status === "Completed"
                          ? "purple"
                          : "neutral"
                    }
                    size="sm"
                    dot
                  >
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-xs">{c.joinedDate}</TableCell>
                <TableCell className="text-right">
                  <button className="text-slate-400 hover:text-slate-700 p-1 rounded cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
