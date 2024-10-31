import bcrypt from "bcrypt";
import crypto from "crypto";
import { database } from "../database/db.js";
const db = database;
import { validationsCreateUser, validationsLoginUser } from "./validations.js";
import { stat } from "fs";

await db.execute(
  `CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT,
  password TEXT,
  email TEXT UNIQUE)`
);

export class UserRepository {
  static async create({ username, password, email }) {
    const validation = await validationsCreateUser({
      username,
      password,
      email,
    });
    if (!validation.success) throw new Error(validation.error);
    const result = await db.execute("SELECT * FROM users");
    const users = result.rows || [];

    const user = users.find((user) => user.email === email);

    if (user) throw new Error("Email in use");

    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      await db.execute(
        `INSERT INTO users (id, username, password, email) VALUES (?, ?, ?, ?)`,
        [id, username, hashedPassword, email]
      );
    } catch {
      return { status: "error", message: "Error creating user" };
    }

    return { message: "creating user..." };
  }

  static async login({ email, password }) {
    const validation = await validationsLoginUser({ password, email });
    if (!validation.success) throw new Error(validation.error);
    const result = await db.execute("SELECT * FROM users");
    const users = result.rows || [];

    const user = users.find((user) => user.email === email);
    if (!user) throw new Error("user not exists");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("password invalid");
    return user;
  }
}
