import * as z from "zod"

export const uses = [
  "Primary TEDS email",
  "Alias / Redirect",
  "Testing",
  "Friend or Family",
  "Other",
] as const

export const emailRequestSchema = z
  .object({
    email: z.email({ message: "Invalid email address" }),
    usage: z.enum(uses, { message: "Invalid use" }),
    primaryEmail: z.string(),
    reason: z.string(),
  })
  .superRefine((value, context) => {
    if (
      value.usage === "Friend or Family" &&
      !z.email().safeParse(value.primaryEmail).success
    ) {
      context.addIssue({
        code: "custom",
        path: ["primaryEmail"],
        message: "Enter a valid primary email address",
      })
    }

    if (
      ["Friend or Family", "Other", "Testing"].includes(value.usage) &&
      !value.reason.trim()
    ) {
      context.addIssue({
        code: "custom",
        path: ["reason"],
        message: "Reason is required",
      })
    }
  })