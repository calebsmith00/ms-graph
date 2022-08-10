import { Client, ClientOptions } from "@microsoft/microsoft-graph-client";
import { AuthProvider } from "./authProvider";

let clientOptions: ClientOptions = {
  authProvider: new AuthProvider(),
};

clientOptions.authProvider?.getAccessToken();
const client = Client.initWithMiddleware(clientOptions);

export { client };
