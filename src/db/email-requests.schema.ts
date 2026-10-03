import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { users } from "./auth.schema";

export const emailRequests = sqliteTable(
  "email_requests",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    usage: text("usage").notNull(),
    primaryEmail: text("primary_email"),
    reason: text("reason"),
    status: text("status", {
      enum: ["pending", "accepted", "denied"],
    })
      .notNull()
      .default("pending"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    reviewedAt: integer("reviewed_at", { mode: "timestamp_ms" }),
    reviewedBy: text("reviewed_by").references(() => users.id),
    denialReason: text("denial_reason"),
  },
  table => [index("email_requests_user_id_idx").on(table.userId), index("email_requests_status_idx").on(table.status)]
);

export const emailRequestsRelations = relations(emailRequests, ({ one }) => ({
  user: one(users, {
    fields: [emailRequests.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [emailRequests.reviewedBy],
    references: [users.id],
  }),
}));
