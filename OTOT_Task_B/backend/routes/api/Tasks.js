const { Router } = require("express");
const Task = require("../../models/Task");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    if (!tasks) throw new Error("No tasks found!");
    const sorted = tasks.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    res.status(200).json(sorted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const newTask = new Task(req.body);
  try {
    const task = await newTask.save();
    if (!task)
      throw new Error("Something went wrong while saving the new task.");
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Task.findByIdAndUpdate(id, req.body);
    if (!response) throw Error("Something went wrong while saving the task.");
    const updated = { ...response._doc, ...req.body };
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted)
      throw new Error("Something went wrong while deleting the task.");
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
