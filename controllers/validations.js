import z from "zod";

export function validationsCreateUser({ username, password, email }) {
  if (typeof username !== "string")
    throw new Error("username must be a string");
  if (username.length <= 6)
    throw new Error("username must be at least 6 characters long");

  if (typeof password !== "string")
    throw new Error("password must be a string");
  if (password.length < 6)
    throw new Error("password must be at least 6 characters long");

  if (typeof email !== "string") throw new Error("email must be a string");
  if (!email.includes("@") && !email.includes("."))
    throw new Error("email invalid");
  if (email.length < 10) throw new Error("email invalid");

  return { success: true };
}

export function validationsLoginUser({ email, password }) {
  if (typeof email !== "string") throw new Error("email must be a string");
  if (email.length < 8) throw new Error("email invalid");

  if (typeof password !== "string")
    throw new Error("password must be a string");
  if (password.length < 6) throw new Error("password invalid");

  return { success: true };
}

/* const registerSchema = z.object({
    username: z.string({
      required_error: "username required",
      invalid_type_error: "username in string",
    }).refine((val) => val.length >= 4, {
        message: "username must be at least 4 characters long",
      }),
    email: z.string({
      invalid_type_error: "email invalid",
      required_error: "email is required",
    }).email({message:"email invalid"}).refine((val) => val.length >= 8, {
        message: "email must be at least 8 characters long",
      }),
    password: z.string({
      invalid_type_error: "password invalid",
      required_error: "password is required",
    }).refine((val) => val.length >= 6, {
        message: "password must be at least 6 characters long",
      })});

    const loginSchema = z.object({
        email: z.string({
          invalid_type_error: "email invalid",
          required_error: "email is required",
        }).email({error:"email invalid"}),
        password: z.string({
          invalid_type_error: "password invalid",
          required_error: "password is required",
        })}) */

export function createUser(data) {
  return registerSchema.safeParse(data);
}

export function loginUser(data) {
  return loginSchema.safeParse(data);
}
