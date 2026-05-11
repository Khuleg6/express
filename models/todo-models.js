import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  checked: { type: Boolean, required: true },
  userID: { type: String, required: true },
});

export const TodoModel = mongoose.model("todo", TodoSchema);
