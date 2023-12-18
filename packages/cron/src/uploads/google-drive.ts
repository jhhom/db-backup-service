import fs from "fs/promises";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import { createReadStream } from "fs";

type OAuth2Client = Awaited<ReturnType<typeof authenticate>>;

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.file",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH, "utf-8");
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client: OAuth2Client) {
  const content = await fs.readFile(CREDENTIALS_PATH, "utf-8");
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize(): Promise<OAuth2Client> {
  {
    const client = await loadSavedCredentialsIfExist();
    if (client) {
      return client as OAuth2Client;
    }
  }
  const client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function uploadFiles(authClient: OAuth2Client, file: string) {
  const drive = google.drive({ version: "v3", auth: authClient });

  const res = await drive.files.create({
    requestBody: {
      name: `${path.basename(file)}`,
      parents: ["1q1EEluKy2OViRzhRCqdansYaThmc48uU"],
    },
    fields: "id",
    media: {
      mimeType: "text/plain",
      body: createReadStream(file),
    },
  });

  console.log(
    `Uploaded ${res.data.name} (${res.data.id}), size: ${res.data.size}`
  );
}

export function uploadFileToDrive(file: string) {
  authorize()
    .then((client) => uploadFiles(client, file))
    .catch(console.error);
}
