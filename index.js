import express from "express";
import fs from "fs";
import { json } from "stream/consumers";
import { nanoid } from "nanoid";
import todorouter from "./routers/todo-router.js";
const app = express();
app.use(express.json());

app.use("/api/todos", todorouter);

const userData = fs.readFileSync("./users.json", "utf-8");

let users = JSON.parse(userData);

const updateUserfile = () => {
  fs.writeFileSync("./users.json", JSON.stringify(users), "utf-8");
};

app.get("/api/users", (req, res) => {
  return res.send(users);
});

app.post("/api/users", (req, res) => {
  const { username, password } = req.body;
  if (!username && !password) {
    return res
      .status(400)
      .send({ message: "Must have a username and password" });
  }
  const newUser = {
    id: nanoid(),
    username,
    password,
  };
  todos.push(newUser);
  updateUserfile();
  return res.send(newUser);
});

app.listen(5001, () => {
  console.log("App is running on http://localhost:5001");
});
