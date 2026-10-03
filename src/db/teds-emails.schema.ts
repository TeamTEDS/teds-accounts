import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { users } from "./auth.schema";
import { emailRequests } from "./email-requests.schema";

export const tedsEmails = sqliteTable(
  "teds_emails",
  {
    id: text("id").primaryKey(),

    enabled: integer("enabled", { mode: "boolean" }).default(true).notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    email: text("email").notNull(),
    type: text("type", {
      enum: ["main", "secondary", "alias"],
    })
      .notNull()
      .default("main"),
    request: text("request").references(() => emailRequests.id),

    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),

    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),

    reviewedAt: integer("reviewed_at", { mode: "timestamp_ms" }),
    denialReason: text("denial_reason"),
  },
  (table) => [
    index("teds_emails_user_id_idx").on(table.userId),
    index("teds_emails_request_idx").on(table.request),
  ],
)

export const tedsEmailsRelations = relations(
  tedsEmails,
  ({ one }) => ({
    user: one(users, {
      fields: [tedsEmails.userId],
      references: [users.id],
    }),
    request: one(emailRequests, {
      fields: [tedsEmails.request],
      references: [emailRequests.id],
    }),
  }),
)