const { Schema, model } = require("mongoose");

const TaskSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = model("task", TaskSchema);

module.exports = Task;
