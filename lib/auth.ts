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
        // 1. Validate Input exists
        if (!credentials?.id || !credentials?.password) {
          return null;
        }

        const inputId = credentials.id;
        const inputPassword = credentials.password;

        // 2. Logic: Is this the Hardcoded Admin?
        // (Useful if you haven't created the admin in DB yet)
        if (inputId === "admin" && inputPassword === "admin") {
          return {
            id: "admin",
            name: "Administrator",
            role: "admin", // <--- VIRTUAL ROLE ASSIGNMENT
          };
        }

        // 3. Logic: Check Database for Writer
        try {
          const writer = await prisma.writer.findUnique({
            where: { id: inputId },
          });

          // User not found
          if (!writer) {
            return null;
          }

          // Password mismatch
          if (writer.password !== inputPassword) {
            return null;
          }

          // 4. Determine Role Logic
          // Since 'role' isn't in the DB, we calculate it here.
          // If the database ID is strictly "admin", they get admin powers.
          // Everyone else gets "writer".
          const role = writer.id === "admin" ? "admin" : "writer";

          // 5. Return the User Object with the Role attached
          return {
            id: writer.id,
            name: writer.id, // Writers don't have names, so we use ID
            role: role,      // <--- VIRTUAL ROLE ATTACHED HERE
          };

        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    // This callback copies the role from the 'user' object (returned above)
    // into the JWT token so it persists.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // This callback copies the role from the JWT token
    // into the session object so you can use `session.user.role` in React.
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