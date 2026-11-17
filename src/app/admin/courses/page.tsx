"use client";

import React, { useState } from "react";
import { Plus, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  price: string;
  studentsCount: number;
  lessonsCount: number;
  tags: string[];
  status: "Published" | "Draft" | "Archived";
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "crs-01",
      title: "Full Stack Next.js 16 & React 19 Mastery",
      instructor: "Rahul Sharma",
      category: "Web Development",
      price: "₹4,999",
      studentsCount: 3840,
      lessonsCount: 48,
      tags: ["Next.js", "React", "TypeScript", "Tailwind"],
      status: "Published",
    },
    {
      id: "crs-02",
      title: "GenAI & Agentic Systems Engineering",
      instructor: "Dr. Arvind Rao",
      category: "Artificial Intelligence",
      price: "₹7,499",
      studentsCount: 2190,
      lessonsCount: 36,
      tags: ["Python", "LangChain", "LLMs", "VectorDB"],
      status: "Published",
    },
    {
      id: "crs-03",
      title: "System Design & Distributed Architectures",
      instructor: "Nikhil Joshi",
      category: "Backend & Systems",
      price: "₹5,999",
      studentsCount: 1650,
      lessonsCount: 42,
      tags: ["Kafka", "Redis", "Microservices", "Scalability"],
      status: "Published",
    },
    {
      id: "crs-04",
      title: "Enterprise UI/UX with Figma & Design Tokens",
      instructor: "Tanvi Kapoor",
      category: "Design",
      price: "₹3,499",
      studentsCount: 890,
      lessonsCount: 28,
      tags: ["Figma", "Design Systems", "Prototyping"],
      status: "Draft",
    },
  ]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newCourse, setNewCourse] = useState({
    title: "",
    instructor: "",
    category: "Web Development",
    price: "",
    tags: ["Next.js", "React"],
    status: "Published" as Course["status"],
  });

  const availableTags = [
    { value: "Next.js", label: "Next.js" },
    { value: "React", label: "React" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "Python", label: "Python" },
    { value: "LLMs", label: "LLMs" },
    { value: "Docker", label: "Docker" },
    { value: "Kubernetes", label: "Kubernetes" },
    { value: "System Design", label: "System Design" },
    { value: "Figma", label: "Figma" },
  ];

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.price) return;

    const created: Course = {
      id: `crs-${Date.now()}`,
      title: newCourse.title,
      instructor: newCourse.instructor || "Rahul Sharma",
      category: newCourse.category,
      price: newCourse.price.startsWith("₹") ? newCourse.price : `₹${newCourse.price}`,
      studentsCount: 0,
      lessonsCount: 12,
      tags: newCourse.tags,
      status: newCourse.status,
    };

    setCourses([created, ...courses]);
    setIsModalOpen(false);
    setNewCourse({
      title: "",
      instructor: "",
      category: "Web Development",
      price: "",
      tags: ["Next.js", "React"],
      status: "Published",
    });
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || c.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Course Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, publish, and structure educational curriculum for your learners.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          size="sm"
        >
          Create Course
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="w-full sm:w-80">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            placeholder="Search by course title or instructor..."
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            options={[
              { value: "all", label: "All Categories" },
              { value: "web development", label: "Web Development" },
              { value: "artificial intelligence", label: "AI & ML" },
              { value: "backend & systems", label: "Backend & Systems" },
              { value: "design", label: "Design" },
            ]}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded">
                  {c.category}
                </span>
                <Badge variant={c.status === "Published" ? "success" : "warning"} size="sm" dot>
                  {c.status}
                </Badge>
              </div>

              <h3 className="text-sm font-semibold text-slate-900 mt-3 leading-snug">{c.title}</h3>
              <p className="text-xs text-slate-400 mt-1">Instructor: {c.instructor}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {c.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-base font-bold text-slate-900">{c.price}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {c.studentsCount}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  {c.lessonsCount} lessons
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Course"
        description="Enter curriculum details to publish or save as draft."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <Input
            label="Course Title"
            placeholder="e.g. Master Clean Architecture in TypeScript"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Instructor Name"
              placeholder="e.g. Rahul Sharma"
              value={newCourse.instructor}
              onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
            />
            <Input
              label="Price (INR)"
              placeholder="e.g. 4999"
              value={newCourse.price}
              onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={[
                { value: "Web Development", label: "Web Development" },
                { value: "Artificial Intelligence", label: "Artificial Intelligence" },
                { value: "Backend & Systems", label: "Backend & Systems" },
                { value: "Design", label: "Design" },
              ]}
              value={newCourse.category}
              onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
            />

            <Select
              label="Initial Status"
              options={[
                { value: "Published", label: "Published" },
                { value: "Draft", label: "Draft" },
              ]}
              value={newCourse.status}
              onChange={(e) =>
                setNewCourse({
                  ...newCourse,
                  status: e.target.value as Course["status"],
                })
              }
            />
          </div>

          <MultiSelect
            label="Curriculum Tags & Topics"
            options={availableTags}
            selectedValues={newCourse.tags}
            onChange={(tags) => setNewCourse({ ...newCourse, tags })}
            placeholder="Choose tags for filtering..."
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
