import NextAuth from "next-auth";
import { authOptions } from "@repo/auth/nextAuth"; 

const handler = NextAuth(authOptions(process.env.NEXTAUTH_SECRET as string));

export { handler as GET, handler as POST };