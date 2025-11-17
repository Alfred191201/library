import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.id || !credentials?.password) {
          return null;
        }

        const writer = await prisma.writer.findUnique({
          where: { id: credentials.id },
        });

        if (writer && writer.password === credentials.password) {
          return { id: writer.id, name: writer.id };
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // <--- Make sure this is here
  pages: {
    signIn: "/login",
  },
});

// ⚠️ CRITICAL: Use GET and POST for App Router
export { handler as GET, handler as POST };