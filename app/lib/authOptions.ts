import dbConnect from "@/backend/config/dbConnect";
import User, { IUser } from "@/backend/models/user";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import type { DefaultJWT } from "next-auth/jwt";

type Credentials = {
  email: string;
  password: string;
};

type Token = DefaultJWT & {
  user?: IUser;
};

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) throw new Error("Missing credentials");

        await dbConnect();

        const { email, password } = credentials as Credentials;

        const user = await User.findOne({ email }).select("+password");

        if (!user) throw new Error("Invalid email or password");

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
          throw new Error("Invalid email or password");
        }

        return user.toObject();
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      const jwtToken = token as Token;

      if (user?.email) {
        await dbConnect();

        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            password: user.name,
            role: "user",
            createdAt: new Date(),
          });
        }

        jwtToken.user = dbUser.toObject();
      }

      return jwtToken;
    },

    async session({ session, token }) {
      const userFromToken = (token as Token).user;

      if (userFromToken) {
        const { password: _password, ...safeUser } = userFromToken;
        session.user = safeUser as IUser;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
