import { httpHandler } from "@/server";

// Set the runtime environment to "edge" for improved performance and scalability.
export const runtime = "edge";

// Re-export `httpHandler` for both GET and POST requests.
export { httpHandler as GET, httpHandler as POST };
