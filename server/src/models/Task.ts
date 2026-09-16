import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "mediium", "high"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  },
);

const Task = model("Task", taskSchema);

export default Task;
