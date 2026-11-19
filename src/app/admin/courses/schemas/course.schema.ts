import { z } from "zod";
import { COURSE_LIMITS } from "../constants/course.constants";

export const step1Schema = z.object({
  courseTitle: z
    .string()
    .trim()
    .min(
      COURSE_LIMITS.TITLE_MIN,
      `Course title must be at least ${COURSE_LIMITS.TITLE_MIN} characters.`
    )
    .max(
      COURSE_LIMITS.TITLE_MAX,
      `Course title cannot exceed ${COURSE_LIMITS.TITLE_MAX} characters.`
    ),
  courseSubheading: z
    .string()
    .trim()
    .min(
      COURSE_LIMITS.SUBHEADING_MIN,
      `Subheading must be at least ${COURSE_LIMITS.SUBHEADING_MIN} characters.`
    )
    .max(
      COURSE_LIMITS.SUBHEADING_MAX,
      `Subheading cannot exceed ${COURSE_LIMITS.SUBHEADING_MAX} characters.`
    ),
  coverImage: z.string().nullable().optional(),
  videoLink: z
    .string()
    .trim()
    .refine(
      (val) => !val || /^https?:\/\/.+/i.test(val),
      "Please enter a valid video URL (e.g., YouTube, Vimeo, Bunny.net)"
    )
    .optional(),
  description: z
    .string()
    .trim()
    .min(
      COURSE_LIMITS.DESCRIPTION_MIN,
      `Description must be at least ${COURSE_LIMITS.DESCRIPTION_MIN} characters.`
    ),
  category: z.string().min(1, "Please select a category."),
});

export const step2Schema = z
  .object({
    pricingType: z.enum(["free", "paid"]),
    actualPrice: z.string().optional(),
    discountPrice: z.string().optional(),
    accessType: z.enum(["lifetime", "limited"]),
    accessDurationDays: z.string(),
  })
  .refine(
    (data) => {
      if (data.pricingType === "paid") {
        const val = Number(data.actualPrice);
        return !isNaN(val) && val > 0;
      }
      return true;
    },
    {
      message: "Please enter a valid actual price (greater than 0).",
      path: ["actualPrice"],
    }
  )
  .refine(
    (data) => {
      if (data.pricingType === "paid") {
        const val = Number(data.discountPrice);
        return !isNaN(val) && val > 0;
      }
      return true;
    },
    {
      message: "Please enter a valid discounted price (greater than 0).",
      path: ["discountPrice"],
    }
  )
  .refine(
    (data) => {
      if (data.pricingType === "paid") {
        const actual = Number(data.actualPrice);
        const discount = Number(data.discountPrice);
        return discount <= actual;
      }
      return true;
    },
    {
      message: "Discounted price cannot exceed the actual MRP price.",
      path: ["discountPrice"],
    }
  );

export const courseSchema = step1Schema.merge(
  z.object({
    pricingType: z.enum(["free", "paid"]),
    actualPrice: z.string().optional(),
    discountPrice: z.string().optional(),
    accessType: z.enum(["lifetime", "limited"]),
    accessDurationDays: z.string(),
    publishStatus: z.enum(["draft", "published"]),
  })
);

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type CourseFormData = z.infer<typeof courseSchema>;
