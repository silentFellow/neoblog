"use server";

import { eq } from "drizzle-orm";
import { users } from "@/lib/drizzle/schema";
import connectToDb from "@/lib/drizzle";
import { Response, User } from "@/types";

const fetchUser = async (username: string): Promise<Response<User>> => {
  try {
    const db = await connectToDb();
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    if (!user || user.length === 0) {
      return { message: "User not found", status: 404 };
    }
    return { message: "User fetched successfully", status: 200, data: user[0] };
  } catch (error: any) {
    console.error(`Error fetching user: ${error.message}`);
    return { message: "Error fetching user", status: 500 };
  }
};

const createUser = async (
  username: string,
  password: string,
): Promise<Response> => {
  try {
    const db = await connectToDb();
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (existingUser.length != 0) {
      return { status: 400, message: "User already exists" };
    }

    await db.insert(users).values({ username, password });

    return { status: 200, message: "User created successfully" };
  } catch (error: any) {
    console.error(`Error creating user: ${error.message}`);
    return { status: 500, message: "Internal Server Error" };
  }
};

export { fetchUser, createUser };
