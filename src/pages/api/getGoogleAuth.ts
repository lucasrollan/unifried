import { google } from "googleapis";

/**
 * Retrieves an access token from Google using a refresh token.
 *
 * @returns {Promise<string>} A promise that resolves to the access token.
 * @throws {Error} If any required environment variables are missing,
 *                 or if no access token is returned.
 */
export default function getGoogleAuth() {
    if (!process.env.GOOGLE_OAUTH_SECRET) {
        throw new Error("GOOGLE_OAUTH_SECRET not set")
    }
    if (!process.env.GOOGLE_OAUTH_REFRESH) {
        throw new Error("GOOGLE_OAUTH_REFRESH not set")
    }
    if (!process.env.GOOGLE_OAUTH_CLIENT_ID) {
        throw new Error("GOOGLE_OAUTH_CLIENT_ID not set")
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_SECRET,
        'info.rollan.com/auth/googlecallback', //YOUR_REDIRECT_URL
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_OAUTH_REFRESH,
    })

    return oauth2Client
}