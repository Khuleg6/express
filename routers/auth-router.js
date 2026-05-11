import express, { raw } from "express";
import fs from "fs";
import { nanoid } from "nanoid";

import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "../auth-middleware.js";
import { UserModel } from "../models/user-model.js";
const userData = fs.readFileSync("./users.json", "utf-8");
let users = JSON.parse(userData);

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Must have a username and password" });
  }
  const existingUser = await UserModel.findOne({ username: username });
  //   const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).send({ message: "Username is already taken" });
  }

  const regex =
    /^(?=(?:.*\d){2,})(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  if (!regex.test(password)) {
    return res.status(400).send({
      message: `Password must contain:
• At least 8 characters
• At least 2 numbers
• Uppercase and lowercase letters
• At least 1 special character`,
    });
  }

  const hashedPassword = bycrypt.hashSync(password, 10);
  //   const newUser = {
  //     id: nanoid(),
  //     username,
  //     password: hashedPassword,
  //   };
  //   users.push(newUser);
  //   updateUserfile();
  const newUser = await UserModel.create({
    username,
    password: hashedPassword,
  });
  return res.send(newUser);
});
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Must have a username and password" });
  }
  const existingUser = await UserModel.findOne({ username: username });

  if (!existingUser) {
    return res.status(401).send({ message: "Wrong crendentials" });
  }
  const isMatching = bycrypt.compareSync(password, existingUser.password);
  if (!isMatching) {
    return res.status(401).send({ message: "Wrong crendentials" });
  }
  const { password: hashedPassword, ...userWithoutPassword } = existingUser;
  const accesstoken = jwt.sign(userWithoutPassword, "MySecret", {
    expiresIn: "1d",
  });
  return res.send({ message: "Successfully sign in", accesstoken });
});

router.get("/me", auth, (req, res) => {
  return res.send(req.user);
});

export default router;
