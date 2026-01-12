import { google } from 'googleapis';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/youtube.readonly'
];

const TOKEN_PATH = join(process.cwd(), 'data', 'google-token.json');
const CREDENTIALS_PATH = join(process.cwd(), 'data', 'google-credentials.json');

export function getOAuth2Client() {
  const redirectUri = process.env.OAUTH2_REDIRECT_URI || 'http://localhost:3001/api/calendar/oauth2callback';

  const credentials = {
    web: {
      client_id: process.env.OAUTH2_GOOGLE,
      client_secret: process.env.OAUTH2_GOOGLE_SECRET,
      redirect_uris: [redirectUri]
    }
  };

  const { client_id, client_secret, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (existsSync(TOKEN_PATH)) {
    const token = JSON.parse(readFileSync(TOKEN_PATH, 'utf-8'));
    oAuth2Client.setCredentials(token);
  }

  return oAuth2Client;
}

export function getAuthUrl() {
  const oAuth2Client = getOAuth2Client();
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // Fuerza a Google a devolver un nuevo refresh_token
    scope: SCOPES,
  });
}

export async function getTokenFromCode(code) {
  const oAuth2Client = getOAuth2Client();
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

  return tokens;
}

export function isAuthenticated() {
  return existsSync(TOKEN_PATH);
}
