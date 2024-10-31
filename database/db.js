import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

export const database = createClient({
  url: "libsql://login-wilmer-oss.turso.io",
  authToken: process.env.DB_TOKEN,
});
