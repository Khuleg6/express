import express from "express";
import fs from "fs";
import { json } from "stream/consumers";
import { nanoid } from "nanoid";
import cors from "cors";
import todorouter from "./routers/todo-router.js";
import authrouter from "./routers/auth-router.js";
import bycrypt from "bcrypt";

import mongoose from "mongoose";
import { UserModel } from "./models/user-model.js";
const app = express();
app.use(express.json());

app.use("/api/todos", todorouter);
app.use("/api/auth", authrouter);
app.use(cors());

const updateUserfile = () => {
  fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");
};

app.get("/api/users", async (req, res) => {
  const users = await UserModel.find();
  return res.send(users);
});

app.post("/api/users/check", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Must have a username and password" });
  }

  const existingUser = users.find((user) => user.username === username);
  const isMatching = bycrypt.compareSync(password, existingUser.password);
  return res.send(isMatching);
});

app.listen(5001, async () => {
  await mongoose.connect(
    "mongodb+srv://test:dOtyB9r0BpIwdh4t@cluster0.euvubsa.mongodb.net/todo-app",
  );
  console.log("App is running on http://localhost:5001");
});

//test dOtyB9r0BpIwdh4t
// mongodb+srv://test:dOtyB9r0BpIwdh4t@cluster0.euvubsa.mongodb.net/todo-app
