"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
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

interface Transaction {
  id: string;
  invoice: string;
  customer: string;
  email: string;
  course: string;
  amount: string;
  gateway: "Razorpay" | "Stripe" | "UPI";
  status: "Successful" | "Pending" | "Failed" | "Refunded";
  date: string;
}

export default function PaymentsPage() {
  const [transactions] = useState<Transaction[]>([
    {
      id: "tx-1",
      invoice: "INV-2026-001",
      customer: "Aarav Sharma",
      email: "aarav@gmail.com",
      course: "Full Stack Next.js & React 19",
      amount: "₹4,999",
      gateway: "UPI",
      status: "Successful",
      date: "Nov 17, 2026",
    },
    {
      id: "tx-2",
      invoice: "INV-2026-002",
      customer: "Sneha Reddy",
      email: "sneha.r@outlook.com",
      course: "GenAI & Agentic Systems Mastery",
      amount: "₹7,499",
      gateway: "Razorpay",
      status: "Successful",
      date: "Nov 17, 2026",
    },
    {
      id: "tx-3",
      invoice: "INV-2026-003",
      customer: "Rohan Gupta",
      email: "rohan.g@gmail.com",
      course: "System Design for Tech Leads",
      amount: "₹5,999",
      gateway: "Stripe",
      status: "Successful",
      date: "Nov 16, 2026",
    },
    {
      id: "tx-4",
      invoice: "INV-2026-004",
      customer: "Pooja Malhotra",
      email: "pooja.m@yahoo.com",
      course: "UI/UX & Design Systems",
      amount: "₹3,499",
      gateway: "UPI",
      status: "Pending",
      date: "Nov 15, 2026",
    },
    {
      id: "tx-5",
      invoice: "INV-2026-005",
      customer: "Kunal Bansal",
      email: "kunal.b@gmail.com",
      course: "DevOps & Cloud Architecture",
      amount: "₹6,999",
      gateway: "Razorpay",
      status: "Failed",
      date: "Nov 14, 2026",
    },
  ]);

  const [search, setSearch] = useState("");
  const [gatewayFilter, setGatewayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.customer.toLowerCase().includes(search.toLowerCase()) ||
      tx.invoice.toLowerCase().includes(search.toLowerCase()) ||
      tx.email.toLowerCase().includes(search.toLowerCase());
    const matchesGateway =
      gatewayFilter === "all" || tx.gateway.toLowerCase() === gatewayFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "all" || tx.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesGateway && matchesStatus;
  });

  const getStatusBadgeVariant = (status: Transaction["status"]) => {
    switch (status) {
      case "Successful":
        return "success";
      case "Pending":
        return "warning";
      case "Failed":
        return "danger";
      case "Refunded":
        return "neutral";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Payments & Transactions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor incoming course fees, payment gateways, and settlement receipts.
          </p>
        </div>
        <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
          Export Statement
        </Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium uppercase">Total Revenue</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">₹4,82,500</p>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium uppercase">Successful Orders</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">1,124</p>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium uppercase">Pending Settlements</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">₹34,800</p>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium uppercase">Refund Rate</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">0.4%</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="w-full sm:w-80">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            placeholder="Search by invoice, customer, or email..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-36">
            <Select
              options={[
                { value: "all", label: "All Gateways" },
                { value: "razorpay", label: "Razorpay" },
                { value: "upi", label: "UPI" },
                { value: "stripe", label: "Stripe" },
              ]}
              value={gatewayFilter}
              onChange={(e) => setGatewayFilter(e.target.value)}
            />
          </div>
          <div className="w-36">
            <Select
              options={[
                { value: "all", label: "All Statuses" },
                { value: "successful", label: "Successful" },
                { value: "pending", label: "Pending" },
                { value: "failed", label: "Failed" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Gateway</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredTransactions.length === 0 ? (
            <TableEmpty message="No payment transactions found." colSpan={8} />
          ) : (
            filteredTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  <span className="font-mono text-xs text-slate-900 font-semibold">
                    {tx.invoice}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold text-slate-900">{tx.customer}</p>
                    <p className="text-[11px] text-slate-400">{tx.email}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-700">{tx.course}</TableCell>
                <TableCell className="font-bold text-slate-900">{tx.amount}</TableCell>
                <TableCell>
                  <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {tx.gateway}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(tx.status)} size="sm" dot>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-xs">{tx.date}</TableCell>
                <TableCell className="text-right">
                  <button
                    title="Download Receipt"
                    className="text-slate-400 hover:text-slate-700 p-1.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
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
