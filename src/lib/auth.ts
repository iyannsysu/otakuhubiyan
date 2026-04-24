import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const hasDb = !!process.env.DATABASE_URL;
const hasGoogle =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: hasDb ? PrismaAdapter(prisma) : undefined,
  session: { strategy: hasDb ? "database" : "jwt" },
  providers: hasGoogle
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
    : [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, user, token }) {
      if (session.user) {
        session.user.id = (user?.id ?? token?.sub) as string;
      }
      return session;
    },
  },
});
