import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import type { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || '',
            clientSecret: process.env.GOOGLE_SECRET || '',
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            const isAllowedToSignIn = user.email === 'lucas.rollan@gmail.com'
                || user.email === 'agustina.a.navarro@gmail.com'

            if (isAllowedToSignIn) {
                return true
            } else {
                // Return false to display a default error message
                return false
                // Or you can return a URL to redirect to:
                // return '/unauthorized'
            }
        }
    }
};
export default NextAuth(authOptions);
