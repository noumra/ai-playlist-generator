import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            name: string,
            access_token: string
        } & DefaultSession["user"]
    }
}