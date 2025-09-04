import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        if (credentials == null) return null;
        const user = await User.findOne({ email: credentials.email });
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            wishlist: user.wishlist,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
    // --- THIS IS THE CORRECTED SESSION CALLBACK ---
    session: async ({ session, token }) => {
      if (token) {
        session.user = token.user;
      }
      // Fetch the latest user data from the database on every session check
      const userFromDb = await User.findById(session.user._id).lean();
      if (userFromDb) {
        // Update the session user with the latest data from the DB
        session.user.name = userFromDb.name;
        session.user.email = userFromDb.email;
        session.user.wishlist = userFromDb.wishlist;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
