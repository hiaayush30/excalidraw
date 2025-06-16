import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { prismaClient } from "@repo/db/client";
import { NEXTAUTH_SECRET } from "@repo/common/config"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email" },
                password: { label: "Password", type: "password", placeholder: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error('invalid credentials')
                }
                try {
                    const user = await prismaClient.user.findFirst({
                        where: {
                            email: credentials.email
                        }
                    })
                    if (!user) {
                        throw new Error('user not found')
                    }
                    const verifyPassword = await bcrypt.compare(credentials.password, user.password);
                    if (!verifyPassword) {
                        throw new Error('incorrect password');
                    }
                    return {
                        id: user.id,
                        email: user.email,
                        photo: user.photo,
                        name: user.name
                    }
                } catch (error) {
                    console.error('Auth Error', error);
                    throw error;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 20 * 24 * 60 * 60 //30 days
    },
    callbacks: {
        async jwt({ token, user, profile }) {
            // The user object is only available when the user logs in. On subsequent requests, the token is used
            // we are setting what all things will be stored in the token
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.photo = user.photo;
                token.name = user.name
            }
            else if (profile) {
                const foundUser = await prismaClient.user.findFirst({
                    where: {
                        email: profile.email
                    }
                })
                if (foundUser) {
                    token.id = foundUser.id;
                    token.email = foundUser.email;
                    token.photo = foundUser.photo;
                    token.name = foundUser.name;
                }
            }
            return token
        },
        async session({ session, token }) { //extract whatever you need from the token
            session.user.id = token.id as number;
            session.user.photo = token.photo as string;
            session.user.email = token.email as string;
            session.user.name = token.name as string;
            return session
        }
    },
    pages: {
        signIn: '/login',
        error: '/login'
    },
    secret: NEXTAUTH_SECRET
}