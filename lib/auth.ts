import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Validate Input
        if (!credentials?.id || !credentials?.password) {
          return null;
        }

        // 2. Optional: Hardcoded Admin Bypass
        // Useful if you haven't created the "admin" user in the DB yet
        if (credentials.id === "admin" && credentials.password === "admin") { 
           return {
             id: "admin",
             name: "Administrator",
             role: "admin"
           };
        }

        // 3. Database Check for Writers
        try {
          const writer = await prisma.writer.findUnique({
            where: {
              id: credentials.id,
            },
          });

          // User not found
          if (!writer) {
            return null;
          }

          // Password mismatch
          // (In production, use bcrypt.compare(credentials.password, writer.password))
          if (writer.password !== credentials.password) {
            return null;
          }

          // Login Successful
          return {
            id: writer.id,
            name: writer.id, // Used 'id' as name since Writer model has no 'name' field
            role: "writer", 
          };

        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "writer";
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, 
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}