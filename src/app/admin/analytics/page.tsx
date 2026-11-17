"use client";

import React from "react";
import { StatCard } from "@/components/ui/StatCard";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          LMS Analytics & Insights
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Detailed metrics on student engagement, drop-off rates, and revenue trajectories.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Conversion Rate"
          value="4.8%"
          subtitle="From visitor to paid student"
          trend={{ value: "+0.6%", isPositive: true }}
          sparklineVariant="green"
        />
        <StatCard
          title="Course Completion"
          value="68.2%"
          subtitle="Average lessons watched"
          trend={{ value: "+4.1%", isPositive: true }}
          sparklineVariant="blue"
        />
        <StatCard
          title="Monthly Churn"
          value="1.2%"
          subtitle="Subscription cancellations"
          trend={{ value: "-0.3%", isPositive: true }}
          sparklineVariant="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Top Performing Courses</h3>
          <div className="space-y-3 mt-4">
            {[
              { name: "Full Stack Next.js 16 & React 19", enrollments: 3840, rev: "₹19.1L" },
              { name: "GenAI & Agentic Systems Engineering", enrollments: 2190, rev: "₹16.4L" },
              {
                name: "System Design & Distributed Architectures",
                enrollments: 1650,
                rev: "₹9.8L",
              },
              { name: "Enterprise UI/UX with Figma", enrollments: 890, rev: "₹3.1L" },
            ].map((course) => (
              <div
                key={course.name}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-900">{course.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {course.enrollments} enrolled learners
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-900">{course.rev}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Lead Acquisition Channels</h3>
          <div className="space-y-3 mt-4">
            {[
              { channel: "Google Organic Search", share: "42%", count: "520 leads" },
              { channel: "Tech Webinars & Workshops", share: "28%", count: "348 leads" },
              { channel: "LinkedIn Developer Network", share: "18%", count: "224 leads" },
              { channel: "Student Referrals", share: "12%", count: "148 leads" },
            ].map((item) => (
              <div
                key={item.channel}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-900">{item.channel}</p>
                  <p className="text-[11px] text-slate-400">{item.count}</p>
                </div>
                <span className="text-xs font-bold text-slate-700">{item.share}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
