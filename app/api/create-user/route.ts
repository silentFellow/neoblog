import connectToDb from "@/lib/drizzle";
import { users } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

export const POST = async (req: Request) => {
  const { username, password } = await req.json();

  try {
    const db = await connectToDb();
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (existingUser.length != 0) {
      return Response.json({ status: 400, message: "User already exists" });
    }

    await db.insert(users).values({ username, password });

    return Response.json({ status: 200, message: "User created successfully" });
  } catch (error: any) {
    console.error(`Error creating user: ${error.message}`);
    return Response.json({ status: 500, message: "Internal Server Error" });
  }
};
