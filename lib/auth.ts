// lib/auth.ts
import { NextAuthOptions, getServerSession } from "next-auth"; // <--- Add getServerSession here
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.id && credentials?.password) {
          const user = {
            id: credentials.id,
            name: credentials.id,
            role: credentials.id === "admin" ? "admin" : "writer"
          };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return user as any;
        }
        return null;
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
  }
};

// --- ADD THIS FUNCTION ---
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}