import { providers } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import connectToDb from "@/lib/drizzle";
import { users } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  pages: { signIn: "/sign-in" },
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      type: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.username || !credentials.password)
          throw new Error("No credentials provided");
        try {
          const userResponse = await fetchUser(credentials.username);
          if (!userResponse || !userResponse.data) {
            throw new Error("No user found");
          }

          if (userResponse.data.providerLogin)
            throw new Error("Invalid login method");

          const user = userResponse.data;
          if (user.password === null) {
            throw new Error("Wrong authentication method");
          }
          if (user.password !== credentials.password) {
            throw new Error("Password does not match");
          }
          return user;
        } catch (error: any) {
          console.log(`[auth] ${error.message}`);
          throw new Error(error.message);
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        const id: string = user.id;
        const db = await connectToDb();
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.id, id));

        return {
          ...token,
          id: user.id,
          username: existingUser[0].username,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
        },
      };
    },
    async signIn({ user, account }) {
      // provider login
      if (
        account &&
        providers.map((provider) => provider.id).includes(account?.provider)
      ) {
        try {
          const db = await connectToDb();
          const id: string = user.id;

          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.id, id));

          if (existingUser.length === 0) {
            await db.insert(users).values({
              id,
              username: user.name || "",
              providerLogin: true,
            });
          }

          return true;
        } catch (error: unknown) {
          console.error(error);
          return false;
        }
      }

      // credentials login
      try {
        const db = await connectToDb();
        if (!account) throw new Error("No account found");
        const id: string = user.id;

        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.id, id));

        if (existingUser.length === 0) {
          await db.insert(users).values({
            id,
            username: user.name || "",
          });
        }

        return true;
      } catch (error: unknown) {
        console.error(error);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
