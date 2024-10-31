import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import CP from "cookie-parser";
dotenv.config();
import { UserRepository } from "./controllers/user-repository.js";

const app = express();

app.use(express.json());
app.use(CP());
app.use(express.static(process.cwd() + "/public"));
app.use((req, res, next) => {
  const token = req.cookies.access_token;
  req.session = { user: null };
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.session.user = data;
  } catch {}
  next();
});

const PORT = process.env.PORT ?? 3000;

app.get("/", (req, res) => {
  const { user } = req.session;
  if (user == null) {
    return res.sendFile(process.cwd() + "/login.html");
  }

  res.sendFile(process.cwd() + "/admin.html");
});

app.get("/register", (req, res) => {
  const { user } = req.session;
  if (user == null) {
    return res.sendFile(process.cwd() + "/register.html");
  }

  res.sendFile(process.cwd() + "/admin.html");
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserRepository.login({ email, password });
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(Date.now() + 60 * 60 * 1000),
      })
      .send({
        status: "success",
        message: `welcome ${user.username}...`,
        token,
        redirect: "/admin",
      });
  } catch (err) {
    res.send({ status: "error", message: err.message });
  }
});

app.post("/api/register", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const result = await UserRepository.create({ username, password, email });
    res.send({ status: "success", message: result.message, redirect: "/" });
  } catch (error) {
    res.send({ error: error.message });
  }
});

app.post("/logout", (req, res) => {
  try {
    res
      .clearCookie("access_token")
      .send({ status: "success", message: "logged out", redirect: "/" });
  } catch (err) {
    res.send({
      status: "error",
      message: "access token not found",
      redirect: "/",
    });
  }
});

app.get("/admin", (req, res) => {
  const { user } = req.session;
  if (!user) {
    return res.sendFile(process.cwd() + "/login.html");
  }
  res.sendFile(process.cwd() + "/admin.html");
});
app.use((req, res) => {
  return res.status(404).json({ message: "direction not found" });
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
