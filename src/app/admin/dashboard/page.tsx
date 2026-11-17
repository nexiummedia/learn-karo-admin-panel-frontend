"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ChevronRight, MoreVertical } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

export default function AdminDashboardPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const recentStudents = [
    {
      id: "std-01",
      name: "Aarav Sharma",
      email: "aarav@gmail.com",
      course: "Full Stack Next.js & React 19",
      amount: "₹4,999",
      status: "Active" as const,
      enrolledAt: "Today, 14:32",
    },
    {
      id: "std-02",
      name: "Sneha Reddy",
      email: "sneha.r@outlook.com",
      course: "GenAI & Agentic Systems Mastery",
      amount: "₹7,499",
      status: "Active" as const,
      enrolledAt: "Today, 11:20",
    },
    {
      id: "std-03",
      name: "Rohan Gupta",
      email: "rohan.g@gmail.com",
      course: "System Design for Tech Leads",
      amount: "₹5,999",
      status: "Completed" as const,
      enrolledAt: "Yesterday",
    },
    {
      id: "std-04",
      name: "Pooja Malhotra",
      email: "pooja.m@yahoo.com",
      course: "UI/UX & Design Systems",
      amount: "₹3,499",
      status: "Active" as const,
      enrolledAt: "Nov 15, 2026",
    },
    {
      id: "std-05",
      name: "Vikram Mehta",
      email: "vikram@techcorp.in",
      course: "DevOps & Cloud Architecture",
      amount: "₹6,999",
      status: "Pending" as const,
      enrolledAt: "Nov 14, 2026",
    },
  ];

  const toggleSelectAll = () => {
    if (selectedRows.length === recentStudents.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(recentStudents.map((s) => s.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((r) => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Overview Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time course enrollments, leads pipeline, and revenue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/courses">
            <Button size="sm" variant="secondary">
              Manage Courses
            </Button>
          </Link>
          <Link href="/admin/leads">
            <Button size="sm" variant="primary">
              View Leads
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards Row (as in the screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value="14,248"
          subtitle="Last 30 days"
          trend={{ value: "+25%", isPositive: true }}
          sparklineVariant="green"
        />

        <StatCard
          title="Lead Conversions"
          value="325"
          subtitle="Last 30 days"
          trend={{ value: "-2.5%", isPositive: false }}
          sparklineVariant="red"
        />

        <StatCard
          title="Course Sales"
          value="₹4,82,500"
          subtitle="Last 30 days"
          trend={{ value: "+18.2%", isPositive: true }}
          sparklineVariant="blue"
        />

        {/* Explore Card / Action Card (matching right-most card in screenshot) */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Explore LMS Insights</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Uncover lead funnel bottlenecks and student engagement with intelligent data
              analytics.
            </p>
          </div>
          <div className="mt-4">
            <Link href="/admin/analytics">
              <button
                type="button"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Get insights</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Layered Area Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <div className="flex items-start justify-between pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">13,277</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  +35%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Student learning sessions per day for the last 30 days
              </p>
            </div>
            <div className="text-xs font-medium text-slate-400">Daily Activity</div>
          </div>

          <div className="h-48 w-full mt-2">
            <svg viewBox="0 0 500 160" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaDarkBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="areaMidBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="areaLightBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.7" />
                </linearGradient>
              </defs>

              <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" />

              <path
                d="M 0 145 Q 60 135, 120 120 T 220 90 T 320 60 T 420 40 L 500 30 L 500 160 L 0 160 Z"
                fill="url(#areaLightBlue)"
              />
              <path
                d="M 0 152 Q 60 142, 120 130 T 220 105 T 320 80 T 420 60 L 500 50 L 500 160 L 0 160 Z"
                fill="url(#areaMidBlue)"
              />
              <path
                d="M 0 158 Q 60 150, 120 140 T 220 120 T 320 100 T 420 80 L 500 70 L 500 160 L 0 160 Z"
                fill="url(#areaDarkBlue)"
              />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>Nov 1</span>
              <span>Nov 5</span>
              <span>Nov 10</span>
              <span>Nov 15</span>
              <span>Nov 20</span>
              <span>Nov 25</span>
              <span>Nov 30</span>
            </div>
          </div>
        </div>

        {/* Stacked Bar Chart */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">1.3M</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60">
                    -8%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Lesson views and resource downloads</p>
              </div>
            </div>

            <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-2">
              {[
                { month: "Jul", h1: "h-12", h2: "h-8", h3: "h-6" },
                { month: "Aug", h1: "h-16", h2: "h-10", h3: "h-8" },
                { month: "Sep", h1: "h-10", h2: "h-6", h3: "h-4" },
                { month: "Oct", h1: "h-20", h2: "h-12", h3: "h-10" },
                { month: "Nov", h1: "h-24", h2: "h-14", h3: "h-12" },
                { month: "Dec", h1: "h-14", h2: "h-8", h3: "h-6" },
              ].map((bar) => (
                <div key={bar.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full max-w-[28px] flex flex-col items-center gap-0.5">
                    <div className={`w-full ${bar.h3} bg-sky-200 rounded-t-sm`} />
                    <div className={`w-full ${bar.h2} bg-sky-400`} />
                    <div className={`w-full ${bar.h1} bg-sky-600 rounded-b-sm`} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-sky-600 rounded-xs" /> Lessons
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-sky-400 rounded-xs" /> Quizzes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-sky-200 rounded-xs" /> Resources
            </span>
          </div>
        </div>
      </div>

      {/* Details Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Recent Student Enrollments
          </h2>
          <Link
            href="/admin/customers"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <span>View all students</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <Table>
          <TableHeader>
            <tr>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={
                    selectedRows.length === recentStudents.length && recentStudents.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                />
              </TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {recentStudents.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => toggleSelectRow(item.id)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-[11px] text-slate-400">{item.email}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-700">{item.course}</TableCell>
                <TableCell className="font-semibold text-slate-900">{item.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === "Active"
                        ? "success"
                        : item.status === "Completed"
                          ? "purple"
                          : "warning"
                    }
                    size="sm"
                    dot
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500">{item.enrolledAt}</TableCell>
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
    </div>
  );
}
