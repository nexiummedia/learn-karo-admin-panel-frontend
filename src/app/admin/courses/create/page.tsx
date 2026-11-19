/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Video,
  Check,
  CheckCircle2,
  Sparkles,
  IndianRupee,
  Clock,
  Infinity as InfinityIcon,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import {
  COURSE_LIMITS,
  COURSE_CATEGORIES,
  ACCESS_DURATION_OPTIONS,
  DEFAULT_COURSE_FORM_VALUES,
} from "../constants";
import { step1Schema, step2Schema } from "../schemas";
import { calculateDiscountPercentage, getAccessDurationLabel } from "../utils";
import type { PricingType, AccessType, PublishStatus } from "../types";

export default function CreateCoursePage() {
  const router = useRouter();

  // Wizard Step: 1 = Page Details, 2 = Pricing & Access, 3 = Review & Publish
  const [currentStep, setCurrentStep] = useState(1);

  // Form State initialized with defaults
  const [courseTitle, setCourseTitle] = useState(DEFAULT_COURSE_FORM_VALUES.courseTitle);
  const [courseSubheading, setCourseSubheading] = useState(
    DEFAULT_COURSE_FORM_VALUES.courseSubheading
  );
  const [coverImage, setCoverImage] = useState<string | null>(
    DEFAULT_COURSE_FORM_VALUES.coverImage
  );
  const [videoLink, setVideoLink] = useState(DEFAULT_COURSE_FORM_VALUES.videoLink);
  const [description, setDescription] = useState(DEFAULT_COURSE_FORM_VALUES.description);
  const [category, setCategory] = useState(DEFAULT_COURSE_FORM_VALUES.category);

  // Pricing & Access State
  const [pricingType, setPricingType] = useState<PricingType>(
    DEFAULT_COURSE_FORM_VALUES.pricingType
  );
  const [actualPrice, setActualPrice] = useState(DEFAULT_COURSE_FORM_VALUES.actualPrice);
  const [discountPrice, setDiscountPrice] = useState(DEFAULT_COURSE_FORM_VALUES.discountPrice);
  const [accessType, setAccessType] = useState<AccessType>(DEFAULT_COURSE_FORM_VALUES.accessType);
  const [accessDurationDays, setAccessDurationDays] = useState(
    DEFAULT_COURSE_FORM_VALUES.accessDurationDays
  );

  // Publishing State
  const [publishStatus, setPublishStatus] = useState<PublishStatus>(
    DEFAULT_COURSE_FORM_VALUES.publishStatus
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation Errors State
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Character limits from domain constants
  const maxTitleLength = COURSE_LIMITS.TITLE_MAX;
  const maxSubheadingLength = COURSE_LIMITS.SUBHEADING_MAX;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverImage(url);
    }
  };

  // Step 1 Validation via external Zod schema
  const validateStep1 = () => {
    const result = step1Schema.safeParse({
      courseTitle,
      courseSubheading,
      coverImage,
      videoLink,
      description,
      category,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path) fieldErrors[String(path)] = issue.message;
      });
      setFormErrors(fieldErrors);
      return false;
    }

    setFormErrors({});
    return true;
  };

  // Step 2 Validation via external Zod schema
  const validateStep2 = () => {
    const result = step2Schema.safeParse({
      pricingType,
      actualPrice,
      discountPrice,
      accessType,
      accessDurationDays,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path) fieldErrors[String(path)] = issue.message;
      });
      setFormErrors(fieldErrors);
      return false;
    }

    setFormErrors({});
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setFormErrors({});
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = (statusToSave?: "draft" | "published") => {
    if (!validateStep1() || !validateStep2()) {
      return;
    }

    const finalStatus = statusToSave || publishStatus;
    setPublishStatus(finalStatus);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/admin/courses");
      }, 1200);
    }, 600);
  };

  // Calculate discount percentage using feature utility
  const discountPercentage = calculateDiscountPercentage(actualPrice, discountPrice);

  return (
    <div className="w-full space-y-6">
      {/* Top Header with Embedded Back Button & Step Indicators */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">New Course</h1>
              <p className="text-xs text-slate-500">
                Step-by-step curriculum, pricing & access configuration
              </p>
            </div>
          </div>

          {/* Step Pill & Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  onClick={() => {
                    if (step === 1) setCurrentStep(1);
                    else if (step === 2 && validateStep1()) setCurrentStep(2);
                    else if (step === 3 && validateStep1() && validateStep2()) setCurrentStep(3);
                  }}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentStep === step
                      ? "bg-slate-900 w-6"
                      : currentStep > step
                        ? "bg-emerald-500 w-2.5"
                        : "bg-slate-200 w-2.5"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {currentStep === 1 && "Step 1 — Page Details"}
              {currentStep === 2 && "Step 2 — Pricing & Access"}
              {currentStep === 3 && "Step 3 — Review & Publish"}
            </span>
          </div>
        </div>
      </div>

      {isSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Course successfully created!</p>
            <p className="text-xs text-emerald-600">Redirecting to courses...</p>
          </div>
        </div>
      )}

      {/* Global Validation Alert */}
      {Object.keys(formErrors).length > 0 && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>Please fix the highlighted errors before moving to the next step.</span>
        </div>
      )}

      {/* STEP 1: PAGE DETAILS */}
      {currentStep === 1 && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 shadow-2xs space-y-7">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Tell us about your Course
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Provide essential information to make your course stand out to learners.
            </p>
          </div>

          {/* Course Title with Character Count */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700">
                Course Title <span className="text-rose-500">*</span>
              </label>
              <span
                className={`text-[11px] font-mono ${
                  courseTitle.length > maxTitleLength ? "text-rose-500 font-bold" : "text-slate-400"
                }`}
              >
                {courseTitle.length}/{maxTitleLength}
              </span>
            </div>
            <input
              type="text"
              value={courseTitle}
              maxLength={maxTitleLength}
              onChange={(e) => {
                setCourseTitle(e.target.value);
                if (formErrors.courseTitle) {
                  setFormErrors((prev) => ({ ...prev, courseTitle: "" }));
                }
              }}
              placeholder="e.g. Full Stack Next.js & React 19 Mastery"
              className={`w-full text-sm bg-white border rounded-lg px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-colors ${
                formErrors.courseTitle
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                  : "border-slate-200 focus:ring-slate-900 focus:border-slate-900"
              }`}
            />
            {formErrors.courseTitle && (
              <p className="text-[11px] font-medium text-rose-600">{formErrors.courseTitle}</p>
            )}
          </div>

          {/* Course Subheading / Description Tagline */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700">
                Course Subheading / Tagline <span className="text-rose-500">*</span>
              </label>
              <span
                className={`text-[11px] font-mono ${
                  courseSubheading.length > maxSubheadingLength
                    ? "text-rose-500 font-bold"
                    : "text-slate-400"
                }`}
              >
                {courseSubheading.length}/{maxSubheadingLength}
              </span>
            </div>
            <input
              type="text"
              value={courseSubheading}
              maxLength={maxSubheadingLength}
              onChange={(e) => {
                setCourseSubheading(e.target.value);
                if (formErrors.courseSubheading) {
                  setFormErrors((prev) => ({ ...prev, courseSubheading: "" }));
                }
              }}
              placeholder="e.g. Master modern web architecture from scratch with hands-on real world projects."
              className={`w-full text-sm bg-white border rounded-lg px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-colors ${
                formErrors.courseSubheading
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                  : "border-slate-200 focus:ring-slate-900 focus:border-slate-900"
              }`}
            />
            <p className="text-[11px] text-slate-400">
              A short, compelling 1-2 sentence overview displayed directly below the title.
            </p>
            {formErrors.courseSubheading && (
              <p className="text-[11px] font-medium text-rose-600">{formErrors.courseSubheading}</p>
            )}
          </div>

          {/* Cover Image Upload Area */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              Cover Image <span className="text-rose-500">*</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                coverImage
                  ? "border-slate-300 bg-slate-50/50"
                  : "border-slate-200 hover:border-slate-400 hover:bg-slate-50/50 bg-slate-50/30"
              }`}
            >
              {coverImage ? (
                <div className="space-y-3">
                  <img
                    src={coverImage}
                    alt="Cover Preview"
                    className="max-h-48 mx-auto rounded-lg object-cover shadow-xs border border-slate-200"
                  />
                  <p className="text-xs text-slate-500">Click to choose another cover image</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-sky-600 hover:underline">
                      Upload
                    </span>{" "}
                    <span className="text-xs text-slate-600">or drag & drop</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    1280 x 720 (16:9) recommended; Up to 10 MB each
                  </p>
                </div>
              )}
            </div>

            {/* OR Divider */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                OR
              </div>
            </div>

            {/* Video Link Option */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Video className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="url"
                  value={videoLink}
                  onChange={(e) => {
                    setVideoLink(e.target.value);
                    if (formErrors.videoLink) {
                      setFormErrors((prev) => ({ ...prev, videoLink: "" }));
                    }
                  }}
                  placeholder="Add video link (Bunny.net, Youtube, Vimeo, etc.)"
                  className={`w-full text-xs sm:text-sm bg-white border rounded-lg pl-9 pr-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 ${
                    formErrors.videoLink
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                      : "border-slate-200 focus:ring-slate-900 focus:border-slate-900"
                  }`}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (videoLink) alert(`Attached preview video: ${videoLink}`);
                }}
              >
                Add
              </Button>
            </div>
            {formErrors.videoLink && (
              <p className="text-[11px] font-medium text-rose-600">{formErrors.videoLink}</p>
            )}
          </div>

          {/* Description with Interactive Rich Text Editor */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              Detailed Description (Rich Text) <span className="text-rose-500">*</span>
            </label>

            <RichTextEditor
              value={description}
              onChange={(content) => {
                setDescription(content);
                if (formErrors.description) {
                  setFormErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              error={formErrors.description}
            />

            {formErrors.description && (
              <p className="text-[11px] font-medium text-rose-600">{formErrors.description}</p>
            )}
          </div>

          {/* Category Selection */}
          <div className="pt-3 border-t border-slate-100 max-w-md">
            <Select
              label="Course Category"
              options={COURSE_CATEGORIES.map((cat) => ({
                value: cat,
                label: cat,
              }))}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (formErrors.category) {
                  setFormErrors((prev) => ({ ...prev, category: "" }));
                }
              }}
            />
            {formErrors.category && (
              <p className="text-[11px] font-medium text-rose-600 mt-1">{formErrors.category}</p>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: PRICING & ACCESS */}
      {currentStep === 2 && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 shadow-2xs space-y-7">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Pricing & Access Model
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Set course monetary value, discount tier, and student access validity.
            </p>
          </div>

          {/* Free vs Paid Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              Course Pricing Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPricingType("paid")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  pricingType === "paid"
                    ? "border-slate-900 bg-slate-50/60 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                    pricingType === "paid"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300"
                  }`}
                >
                  {pricingType === "paid" && <Check className="w-2.5 h-2.5" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Paid Course</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Charge students a one-time fee with optional discount.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setPricingType("free")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  pricingType === "free"
                    ? "border-slate-900 bg-slate-50/60 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                    pricingType === "free"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300"
                  }`}
                >
                  {pricingType === "free" && <Check className="w-2.5 h-2.5" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Free Course</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Available to all enrolled students with zero payment required.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Input Fields (Only if Paid) */}
          {pricingType === "paid" && (
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Actual Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Actual Price (MRP) in INR <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={actualPrice}
                      onChange={(e) => {
                        setActualPrice(e.target.value);
                        if (formErrors.actualPrice) {
                          setFormErrors((prev) => ({ ...prev, actualPrice: "" }));
                        }
                      }}
                      placeholder="9999"
                      className={`w-full text-sm bg-white border rounded-lg pl-7 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-1 ${
                        formErrors.actualPrice
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                          : "border-slate-200 focus:ring-slate-900 focus:border-slate-900"
                      }`}
                    />
                  </div>
                  {formErrors.actualPrice && (
                    <p className="text-[11px] font-medium text-rose-600 mt-1">
                      {formErrors.actualPrice}
                    </p>
                  )}
                </div>

                {/* Discount Price */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Discounted Selling Price in INR <span className="text-rose-500">*</span>
                    </label>
                    {discountPercentage > 0 && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {discountPercentage}% OFF
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={discountPrice}
                      onChange={(e) => {
                        setDiscountPrice(e.target.value);
                        if (formErrors.discountPrice) {
                          setFormErrors((prev) => ({ ...prev, discountPrice: "" }));
                        }
                      }}
                      placeholder="4999"
                      className={`w-full text-sm bg-white border rounded-lg pl-7 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-1 font-semibold ${
                        formErrors.discountPrice
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                          : "border-slate-200 focus:ring-slate-900 focus:border-slate-900"
                      }`}
                    />
                  </div>
                  {formErrors.discountPrice && (
                    <p className="text-[11px] font-medium text-rose-600 mt-1">
                      {formErrors.discountPrice}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-600" />
                <span>
                  Students will see: <del className="text-slate-400">₹{actualPrice || 0}</del>{" "}
                  <strong className="text-slate-900 font-bold">₹{discountPrice || 0}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Access Validity (Lifetime vs Limited) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700">
              Access Validity <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setAccessType("lifetime")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  accessType === "lifetime"
                    ? "border-slate-900 bg-slate-50/60 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                    accessType === "lifetime"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300"
                  }`}
                >
                  {accessType === "lifetime" && <Check className="w-2.5 h-2.5" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <InfinityIcon className="w-3.5 h-3.5 text-slate-700" />
                    <h3 className="text-sm font-semibold text-slate-900">Lifetime Access</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Students get unlimited, lifetime access to all current and future lessons.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setAccessType("limited")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  accessType === "limited"
                    ? "border-slate-900 bg-slate-50/60 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                    accessType === "limited"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300"
                  }`}
                >
                  {accessType === "limited" && <Check className="w-2.5 h-2.5" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-700" />
                    <h3 className="text-sm font-semibold text-slate-900">Limited Access</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Access expires after a designated number of days.
                  </p>
                </div>
              </div>
            </div>

            {/* Limited Duration Input */}
            {accessType === "limited" && (
              <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                <div className="w-56">
                  <Select
                    label="Validity Period"
                    options={ACCESS_DURATION_OPTIONS}
                    value={accessDurationDays}
                    onChange={(e) => setAccessDurationDays(e.target.value)}
                  />
                </div>
                <p className="text-xs text-slate-500 pt-5">
                  Course access automatically revokes after{" "}
                  {getAccessDurationLabel(accessDurationDays)} from enrollment.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & PUBLISH */}
      {currentStep === 3 && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-6 sm:p-8 shadow-2xs space-y-7">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Review & Publish Status
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify curriculum details and set platform visibility.
            </p>
          </div>

          {/* Visibility Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              Initial Visibility <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPublishStatus("published")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  publishStatus === "published"
                    ? "border-emerald-600 bg-emerald-50/40 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                    publishStatus === "published"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300"
                  }`}
                >
                  {publishStatus === "published" && <Check className="w-2.5 h-2.5" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                    <span>Publish Immediately</span>
                    <Badge variant="success" size="sm">
                      Live
                    </Badge>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Course will be immediately visible for students to enroll and view.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setPublishStatus("draft")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  publishStatus === "draft"
                    ? "border-amber-500 bg-amber-50/40 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                    publishStatus === "draft"
                      ? "border-amber-500 bg-amber-50/40 shadow-xs"
                      : "border-slate-300"
                  }`}
                >
                  {publishStatus === "draft" && <Check className="w-2.5 h-2.5" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                    <span>Save as Draft</span>
                    <Badge variant="warning" size="sm">
                      Draft
                    </Badge>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Keep hidden from learners while you configure chapters and video lessons.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Card Summary Preview */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Course Summary Preview
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-full sm:w-56 h-36 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Course Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-3 text-slate-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span className="text-[10px]">No cover image</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {category}
                  </span>
                  <Badge variant={publishStatus === "published" ? "success" : "warning"} size="sm">
                    {publishStatus === "published" ? "Ready to Publish" : "Draft"}
                  </Badge>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {courseTitle || "Untitled Course"}
                </h4>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {courseSubheading}
                </p>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {description
                    ? description
                        .replace(/<[^>]*>/g, " ")
                        .replace(/\s+/g, " ")
                        .trim()
                    : ""}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-700 font-medium">
                  <span className="flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                    {pricingType === "free" ? (
                      <strong className="text-emerald-600">Free</strong>
                    ) : (
                      <span>
                        <strong className="text-slate-900 text-sm">₹{discountPrice}</strong>{" "}
                        <del className="text-slate-400 text-xs">₹{actualPrice}</del>
                      </span>
                    )}
                  </span>

                  <span className="flex items-center gap-1 text-slate-500">
                    {accessType === "lifetime" ? (
                      <>
                        <InfinityIcon className="w-3.5 h-3.5" />
                        <span>Lifetime Access</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{getAccessDurationLabel(accessDurationDays)} Access</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons Placed DIRECTLY AFTER THE CARD */}
      <div className="flex items-center justify-between pt-2 pb-12">
        <div>
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrevStep}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous Step
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentStep < 3 ? (
            <>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleSubmit("draft")}
              >
                Save Draft
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={handleNextStep}>
                Next Step
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleSubmit("draft")}
                isLoading={isSubmitting && publishStatus === "draft"}
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleSubmit("published")}
                isLoading={isSubmitting && publishStatus === "published"}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Publish Course
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
