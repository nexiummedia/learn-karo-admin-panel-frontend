"use client";

import React, { useState } from "react";
import { Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from "@/components/ui/Table";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  source: string;
  status: "New" | "Contacted" | "Qualified" | "Converted" | "Lost";
  date: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "lead-1",
      name: "Aditya Nair",
      email: "aditya.n@gmail.com",
      phone: "+91 98765 43210",
      course: "Full Stack Next.js & React 19",
      source: "Webinar",
      status: "Qualified",
      date: "Nov 17, 2026",
    },
    {
      id: "lead-2",
      name: "Meera Kapoor",
      email: "meera.k@yahoo.com",
      phone: "+91 98123 45678",
      course: "GenAI & Agentic Systems Mastery",
      source: "Google Search",
      status: "New",
      date: "Nov 17, 2026",
    },
    {
      id: "lead-3",
      name: "Karan Johar",
      email: "karan.j@techmail.com",
      phone: "+91 99887 76655",
      course: "System Design for Tech Leads",
      source: "LinkedIn Ads",
      status: "Contacted",
      date: "Nov 16, 2026",
    },
    {
      id: "lead-4",
      name: "Ananya Joshi",
      email: "ananya.j@gmail.com",
      phone: "+91 97654 32109",
      course: "UI/UX & Design Systems",
      source: "Referral",
      status: "Converted",
      date: "Nov 15, 2026",
    },
    {
      id: "lead-5",
      name: "Suresh Rao",
      email: "suresh.rao@enterprise.in",
      phone: "+91 91234 56789",
      course: "DevOps & Cloud Architecture",
      source: "Website Form",
      status: "Contacted",
      date: "Nov 14, 2026",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Lead form state
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    course: "Full Stack Next.js & React 19",
    source: "Website Form",
    status: "New" as Lead["status"],
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.email) return;

    const created: Lead = {
      id: `lead-${Date.now()}`,
      ...newLead,
      date: "Just now",
    };

    setLeads([created, ...leads]);
    setIsModalOpen(false);
    setNewLead({
      name: "",
      email: "",
      phone: "",
      course: "Full Stack Next.js & React 19",
      source: "Website Form",
      status: "New",
    });
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || lead.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: Lead["status"]) => {
    switch (status) {
      case "Converted":
        return "success";
      case "Qualified":
        return "info";
      case "Contacted":
        return "purple";
      case "New":
        return "warning";
      case "Lost":
        return "danger";
      default:
        return "neutral";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Leads Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Capture, track, and convert prospective students across all channels.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          size="sm"
        >
          Add New Lead
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="w-full sm:w-72">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search by name, email, or course..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-40">
            <Select
              options={[
                { value: "all", label: "All Statuses" },
                { value: "new", label: "New" },
                { value: "contacted", label: "Contacted" },
                { value: "qualified", label: "Qualified" },
                { value: "converted", label: "Converted" },
                { value: "lost", label: "Lost" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Leads Data Table */}
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Lead</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Interested Course</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {filteredLeads.length === 0 ? (
            <TableEmpty message="No leads found matching your criteria." colSpan={7} />
          ) : (
            filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div>
                    <p className="font-semibold text-slate-900">{lead.name}</p>
                    <p className="text-[11px] text-slate-400">{lead.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 font-mono text-[11px]">{lead.phone}</TableCell>
                <TableCell className="font-medium text-slate-700">{lead.course}</TableCell>
                <TableCell>
                  <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {lead.source}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(lead.status)} size="sm" dot>
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-xs">{lead.date}</TableCell>
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

      {/* Add Lead Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Lead"
        description="Fill in candidate details to enroll them into the sales pipeline."
      >
        <form onSubmit={handleCreateLead} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Rohit Deshmukh"
            value={newLead.name}
            onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="rohit@example.com"
            value={newLead.email}
            onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 00000"
            value={newLead.phone}
            onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
          />
          <Select
            label="Interested Course"
            options={[
              { value: "Full Stack Next.js & React 19", label: "Full Stack Next.js & React 19" },
              {
                value: "GenAI & Agentic Systems Mastery",
                label: "GenAI & Agentic Systems Mastery",
              },
              { value: "System Design for Tech Leads", label: "System Design for Tech Leads" },
              { value: "UI/UX & Design Systems", label: "UI/UX & Design Systems" },
            ]}
            value={newLead.course}
            onChange={(e) => setNewLead({ ...newLead, course: e.target.value })}
          />
          <Select
            label="Lead Source"
            options={[
              { value: "Website Form", label: "Website Form" },
              { value: "Google Search", label: "Google Search" },
              { value: "Webinar", label: "Webinar" },
              { value: "LinkedIn Ads", label: "LinkedIn Ads" },
              { value: "Referral", label: "Referral" },
            ]}
            value={newLead.source}
            onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Lead
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
