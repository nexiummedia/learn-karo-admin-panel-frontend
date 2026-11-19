"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { INITIAL_COURSES, COURSE_CATEGORIES } from "./constants";
import type { Course } from "./types";

export default function CoursesPage() {
  const [courses] = useState<Course[]>(INITIAL_COURSES);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

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

        <Link href="/admin/courses/create">
          <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">
            Create Course
          </Button>
        </Link>
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
              ...COURSE_CATEGORIES.map((cat) => ({
                value: cat.toLowerCase(),
                label: cat,
              })),
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
                {c.tags?.map((tag) => (
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
    </div>
  );
}
