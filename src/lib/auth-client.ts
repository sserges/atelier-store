import { createAuthClient } from "better-auth/react";

// No baseURL: the client targets /api/auth on the same origin.
export const authClient = createAuthClient();
