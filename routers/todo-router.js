import fs from "fs";
import express from "express";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import { auth } from "../auth-middleware.js";
import { TodoModel } from "../models/todo-models.js";
const router = express.Router();

const todoData = fs.readFileSync("./data.json", "utf-8");
let todos = JSON.parse(todoData);
const userData = fs.readFileSync("./users.json", "utf-8");
let users = JSON.parse(userData);

const updateTodofile = () => {
  fs.writeFileSync("./data.json", JSON.stringify(todos), "utf-8");
};

router.get("/", auth, async (req, res) => {
  try {
    const userTodos = await TodoModel.find({ userID: req.user.id });
    return res.send(userTodos);
  } catch (error) {
    console.log("Error details:", error);
    return res.status(500).send({ message: "Error fetching todos" });
  }
});

router.post("/", auth, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send({ message: "Body must have name" });
  }
  try {
    const newTodo = await TodoModel.create({
      name,
      checked: false,
      userId: req.user.id,
    });
    return res.status(201).send(newTodo);
  } catch (error) {
    return res.status(400).send({ message: "Error creating todo", error });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    // Зөвхөн өөрийнх нь мөн эсэхийг давхар шалгаж устгана
    const deletedItem = await TodoModel.findOneAndDelete({
      _id: id,
      userID: req.user.id,
    });

    if (!deletedItem) {
      return res
        .status(404)
        .send({ message: "ToDo not found or unauthorized" });
    }

    return res.send(deletedItem);
  } catch (error) {
    return res.status(500).send({ message: "Error deleting todo" });
  }
});
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { name, checked } = req.body;

  try {
    const updatedTodo = await TodoModel.findOneAndUpdate(
      { _id: id, userID: req.user.id }, // Шүүлтүүр
      { name, checked }, // Шинэ утгууд
      { new: true, runValidators: true }, // Шинэчлэгдсэн датаг буцаах
    );

    if (!updatedTodo) {
      return res
        .status(404)
        .send({ message: "ToDo not found or unauthorized" });
    }

    return res.send(updatedTodo);
  } catch (error) {
    return res.status(400).send({ message: "Error updating todo" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const item = await TodoModel.findOne({
      _id: req.params.id,
      userID: req.user.id,
    });
    if (!item) {
      return res.status(404).send({ message: "ToDo not found" });
    }
    return res.send(item);
  } catch (error) {
    return res.status(500).send({ message: "Server error" });
  }
});

export default router;
