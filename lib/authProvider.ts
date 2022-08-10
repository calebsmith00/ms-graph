import {
  AuthenticationProvider,
  AuthenticationProviderOptions,
} from "@microsoft/microsoft-graph-client";
import fetch from "cross-fetch";

class AuthProvider implements AuthenticationProvider {
  async getAccessToken(
    authenticationProviderOptions?: AuthenticationProviderOptions | undefined
  ) {
    const authEndpoint = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const options = {
      method: "post",
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID || "",
        scope: process.env.SCOPE || ".default",
        client_secret: process.env.CLIENT_SECRET || "",
        grant_type: process.env.GRANT_TYPE || "client_credentials",
      }),
    };
    const request = await fetch(authEndpoint, options);
    const response = await request.json();

    return response.access_token;
  }
}

export { AuthProvider };
