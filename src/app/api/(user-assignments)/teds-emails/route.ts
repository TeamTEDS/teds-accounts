import { initAuth } from "@/auth"
import { getDb, tedsEmails } from "@/db"
import { desc, eq } from "drizzle-orm"

export async function GET(request: Request) {
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

  const db = await getDb()
  const requests = await db
    .select({
      id: tedsEmails.id,
      email: tedsEmails.email,
      type: tedsEmails.type,
      enabled: tedsEmails.enabled,
      createdAt: tedsEmails.createdAt,
    })
    .from(tedsEmails)
    .where(eq(tedsEmails.userId, session.user.id))
    .orderBy(desc(tedsEmails.createdAt))

  return Response.json({ requests })
}