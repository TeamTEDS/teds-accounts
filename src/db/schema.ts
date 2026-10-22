import * as authSchema from "./auth.schema"; // This will be generated in a later step
import * as emailRequests from "./email-requests.schema"; // Import the emailRequests schema
import * as tedsEmails from "./teds-emails.schema"; // Import the tedsEmails schema

// Combine all schemas here for migrations
export const schema = {
  ...authSchema, // Re-enabled after schema generation
  // ... your other application schemas
  ...emailRequests,
  ...tedsEmails,
} as const;
