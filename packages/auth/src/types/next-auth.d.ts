import NextAuth, { DefaultSession } from "next-auth";
declare module "next-auth" {
    // When a user signs in, NextAuth.js creates a Session object that contains information about the user.
    // Represents the user object within the active authentication session. This object contains information about
    // available on Client-side and server-side.
    interface Session {
        user: {
            id: number;
            email: string;
            photo: string;
            name: string;
        } & DefaultSession['user']; //name, email, image
        // This means the user object in your Session will now have all the default properties plus your
        // custom id, role properties.
        accessToken?: string;
    }
    interface User {
        // Represents the structure of a user record as stored in your database or authentication provider.
        // Primarily server side when interacting with your database to fetch, create, or update user information.
        id: number;
        email: string;
        photo: string;
        name: string;
    }
}