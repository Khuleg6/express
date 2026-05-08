import fs from "fs";
import express from "express";
import { nanoid } from "nanoid";

const router = express.Router();
const app = express();
app.use(express.json());
const todoData = fs.readFileSync("./data.json", "utf-8");

let todos = JSON.parse(todoData);

const updateTodofile = () => {
  fs.writeFileSync("./data.json", JSON.stringify(todos), "utf-8");
};

router.get("/", (req, res) => {
  return res.send(todos);
});

router.post("/", (req, res) => {
  const name = req.body?.name;
  if (!name) {
    return res.status(400).send({ message: "Body must have name" });
  }
  const newTodo = {
    id: nanoid(),
    checked: false,
    name,
  };
  todos.push(newTodo);
  updateDatafile();
  return res.send(newTodo);
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const deletingItem = todos.find((todo) => todo.id == id);
  if (!deletingItem) {
    return res.status(404).send({ message: "ToDo not found" });
  }
  todos = todos.filter((todo) => todo.id != id);
  updateDatafile();
  return res.send(deletingItem);
});
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updatingItem = todos.find((todo) => todo.id == id);
  if (!updatingItem) {
    return res.status(404).send({ message: "ToDo not found" });
  }
  const { name, checked } = req.body;
  if (name === undefined && checked === undefined) {
    return res.status(400).send({ message: "Body must have name or checked" });
  }
  const updatingTodo = {
    ...updatingItem,
    ...(name !== undefined && { name }),
    ...(checked !== undefined && { checked }),
  };
  todos = todos.map((todo) => {
    if (todo.id == id) {
      return updatingTodo;
    }
    return todo;
  });
  updateDatafile();
  return res.send(updatingTodo);
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const Item = todos.find((todo) => todo.id == id);
  if (!Item) {
    return res.status(404).send({ message: "ToDo not found" });
  }

  return res.send(Item);
});

export default router;
