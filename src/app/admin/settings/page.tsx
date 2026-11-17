"use client";

import React, { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export default function SettingsPage() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure LearnKaro LMS credentials, payment gateways, and system notifications.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General LMS Info */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
            General Organization
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Platform Name" defaultValue="LearnKaro LMS" />
            <Input label="Support Email" defaultValue="support@learnkaro.com" />
            <Input label="Default Currency" defaultValue="INR (₹)" disabled />
            <Select
              label="Timezone"
              options={[
                { value: "IST", label: "Asia/Kolkata (IST +5:30)" },
                { value: "UTC", label: "UTC (Coordinated Universal Time)" },
              ]}
              defaultValue="IST"
            />
          </div>
        </div>

        {/* Payment Gateway Credentials */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
            Payment Gateway Integrations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Razorpay Key ID"
              placeholder="rzp_live_..."
              defaultValue="rzp_live_92019401"
            />
            <Input label="Razorpay Secret" type="password" defaultValue="••••••••••••••••" />
            <Input
              label="UPI Merchant VPA"
              placeholder="learnkaro@icici"
              defaultValue="learnkaro@icici"
            />
            <Input label="Webhook Secret" type="password" defaultValue="••••••••••••••••" />
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between">
          {isSaved ? (
            <span className="text-xs text-emerald-600 font-medium">
              Settings updated successfully!
            </span>
          ) : (
            <span />
          )}
          <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
