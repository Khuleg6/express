import express from "express";
const app = express();
let todos = [{ id: 1, name: "bosoh", checked: false }];
app.use(express.json());

app.get("/api/todos", (req, res) => {
  return res.send(todos);
});

app.post("/api/todos", (req, res) => {
  const name = req.body?.name;
  if (!name) {
    return res.status(400).send({ message: "Body must have name" });
  }
  const newTodo = {
    id: todos[todos.length - 1].id + 1,
    checked: false,
    name,
  };
  todos.push(newTodo);
  return res.send(newTodo);
});
app.delete("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const deletingItem = todos.find((todo) => todo.id == id);
  if (!deletingItem) {
    return res.status(404).send({ message: "ToDo not found" });
  }
  todos = todos.filter((todo) => todo.id != id);
  return res.send(deletingItem);
});
app.put("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const updatingItem = todos.find((todo) => todo.id == id);
  if (!updatingItem) {
    return res.status(404).send({ message: "ToDo not found" });
  }
  const { name, checked } = req.body;
  if (!name || checked !== undefined) {
    return res.status(400).send({ message: "Body must have name or checked" });
  }
  const updatingTodo = {
    ...updatingItem,
    ...(name && { name }),
    ...(checked !== undefined && { checked }),
  };
  todos.map((todo) => {
    if (todo.id == id) {
      return updatingTodo;
    }
    return todo;
  });
  return res.send(updatingTodo);
});
app.listen(5001, () => {
  console.log("App is running on http://localhost:5001");
});
