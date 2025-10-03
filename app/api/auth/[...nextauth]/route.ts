import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

// Helper function to safely initialize Firebase only when needed
const getFirebaseAuth = () => {
  try {
    return auth;
  } catch (error) {
    console.warn("Firebase auth not available during build time:", error instanceof Error ? error.message : String(error));
    return null;
  }
};

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const firebaseAuth = getFirebaseAuth();
          if (!firebaseAuth) {
            console.warn("Firebase auth not available - this may be during build time");
            return null;
          }

          const userCredential = await signInWithEmailAndPassword(
            firebaseAuth,
            credentials.email,
            credentials.password
          );
          const user = userCredential.user;

          if (user) {
            return {
              id: user.uid,
              email: user.email,
              name: user.displayName || user.email,
              image: user.photoURL,
            };
          }
          return null;
        } catch (error) {
          console.error("Sign in error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.id && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
} as NextAuthOptions;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export { authOptions };