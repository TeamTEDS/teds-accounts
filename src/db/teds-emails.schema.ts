import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index, check } from "drizzle-orm/sqlite-core";
import { users } from "./auth.schema";
import { emailRequests } from "./email-requests.schema";

export const tedsEmailDomains = ["teds.one", "teds.top", "nxui.link"] as const;

export const tedsEmails = sqliteTable(
  "teds_emails",
  {
    id: text("id").primaryKey(),
    enabled: integer("enabled", { mode: "boolean" }).default(true).notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    domain: text("domain", { enum: tedsEmailDomains })
      .generatedAlwaysAs(sql`lower(substr(email, instr(email, '@') + 1))`)
      .notNull(),
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
  },
  table => [
    index("teds_emails_user_id_idx").on(table.userId),
    index("teds_emails_request_idx").on(table.request),
    check("teds_emails_domain_check", sql`${table.domain} IN ('teds.one', 'teds.top', 'nxui.link')`),
  ]
);

export const tedsEmailsRelations = relations(tedsEmails, ({ one }) => ({
  user: one(users, {
    fields: [tedsEmails.userId],
    references: [users.id],
  }),
  request: one(emailRequests, {
    fields: [tedsEmails.request],
    references: [emailRequests.id],
  }),
}));
