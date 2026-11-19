export type CourseStatus = "Published" | "Draft" | "Archived";
export type PricingType = "free" | "paid";
export type AccessType = "lifetime" | "limited";
export type PublishStatus = "draft" | "published";

export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  price: string;
  studentsCount: number;
  lessonsCount: number;
  tags?: string[];
  status: CourseStatus;
}

export interface AccessDurationOption {
  label: string;
  value: string;
}

export interface CreateCourseFormState {
  courseTitle: string;
  courseSubheading: string;
  coverImage: string | null;
  videoLink: string;
  description: string;
  category: string;
  pricingType: PricingType;
  actualPrice: string;
  discountPrice: string;
  accessType: AccessType;
  accessDurationDays: string;
  publishStatus: PublishStatus;
}

export interface Step1ValidationInput {
  courseTitle: string;
  courseSubheading: string;
  coverImage?: string | null;
  videoLink?: string;
  description: string;
  category: string;
}

export interface Step2ValidationInput {
  pricingType: PricingType;
  actualPrice?: string;
  discountPrice?: string;
  accessType: AccessType;
  accessDurationDays: string;
}
