import SpotifyProvider from "next-auth/providers/spotify"
import { Account, AuthOptions, User } from "next-auth"
import { JWT } from "next-auth/jwt"

const authURL = 'https://accounts.spotify.com/authorize?scope=playlist-modify-public'

export const authOptions: AuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: authURL,
    })
  ],
  session: {
    maxAge: 60 * 60, // spotify default is 1 hour or 3600s
  },
  callbacks: {
    async jwt({ token, account, user }: { token: JWT; account: Account | null; user: User | null }) {
      // initial user sign in
      if (account && user) {
        console.log("initial user sign in")
        console.log({ token, account, user })
        return {
          ...token,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          username: account.providerAccountId,
          access_token_expires: account.expires_at! * 1000 // handle expiry time in ms
        };
      }
      // return the previous token if current token is expired
      if (Date.now() < (token.access_token_expires as number)) {
        console.log("Existing token is valid")
        console.log(token)
        return token;
      }
      // access token has expired, try to update it
      console.log("Access token has expired, try to update it");
      return refreshAccessToken(token)
    },

    async session({ session, token }: { session: any; token: any }) {
      console.log("session")
      console.log({session, token})
      // create object with auth user
      const user = {
        name: session.user.name,
        access_token: token.access_token,
      }
      session.user = user
      console.log("session return session", session)
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch(authURL, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      token_type: refreshedTokens.token_type,
      expires_at: refreshedTokens.expires_at,
      expires_in: (refreshedTokens.expires_at ?? 0) - Date.now() / 1000,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      scope: refreshedTokens.scope,
    };
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}