import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.id_token) {
        token.id_token = account.id_token; // Save JWT for zkLogin
      }
      return token;
    },
    async session({ session, token }) {
      session.id_token = token.id_token; // Make it accessible in session
      return session;
    },
  },
});
