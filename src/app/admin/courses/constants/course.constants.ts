import { AccessDurationOption, Course, CreateCourseFormState } from "../types/course.types";

export const COURSE_LIMITS = {
  TITLE_MIN: 5,
  TITLE_MAX: 75,
  SUBHEADING_MIN: 10,
  SUBHEADING_MAX: 140,
  DESCRIPTION_MIN: 20,
} as const;

export const COURSE_CATEGORIES = [
  "Web Development",
  "Artificial Intelligence",
  "Backend & Systems",
  "Design",
  "Mobile Development",
  "DevOps & Cloud",
] as const;

export const ACCESS_DURATION_OPTIONS: AccessDurationOption[] = [
  { label: "30 Days (1 Month)", value: "30" },
  { label: "90 Days (3 Months)", value: "90" },
  { label: "180 Days (6 Months)", value: "180" },
  { label: "365 Days (1 Year)", value: "365" },
  { label: "730 Days (2 Years)", value: "730" },
];

export const DEFAULT_COURSE_FORM_VALUES: CreateCourseFormState = {
  courseTitle: "Join my all new course",
  courseSubheading:
    "Master production-grade modern web architecture with hands-on projects and real-world tools.",
  coverImage: null,
  videoLink: "",
  description: `<p>In this section, your goal is to motivate potential students to purchase the course. What valuable knowledge will they gain? What opportunities will they miss if they don't enroll? Why is now the perfect time to sign up?</p><p><strong>Use bullet points to:</strong></p><ul><li>Outline the key learning outcomes</li><li>Describe the impacts of the course</li><li>Illustrate how their life will be enhanced by taking the course</li></ul>`,
  category: "Web Development",
  pricingType: "paid",
  actualPrice: "9999",
  discountPrice: "4999",
  accessType: "lifetime",
  accessDurationDays: "365",
  publishStatus: "published",
};

export const INITIAL_COURSES: Course[] = [
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
];
