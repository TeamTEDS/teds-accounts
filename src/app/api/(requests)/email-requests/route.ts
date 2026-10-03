import { initAuth } from "@/auth"
import { getDb, emailRequests } from "@/db"
import { emailRequestSchema } from "@/lib/validation/email-request"

export async function POST(request: Request) {
  const auth = await initAuth()

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return Response.json(
      { error: "Authentication required" },
      { status: 401 },
    )
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsedBody = emailRequestSchema.safeParse(body)

  if (!parsedBody.success) {
    return Response.json(
      {
        error: "Invalid email request",
        issues: parsedBody.error.issues,
      },
      { status: 400 },
    )
  }

  const db = await getDb()

  const [createdRequest] = await db
    .insert(emailRequests)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      email: parsedBody.data.email,
      usage: parsedBody.data.usage,
      primaryEmail: parsedBody.data.primaryEmail || null,
      reason: parsedBody.data.reason || null,
      status: "pending",
    })
    .returning()

  return Response.json({ request: createdRequest }, { status: 201 })
}