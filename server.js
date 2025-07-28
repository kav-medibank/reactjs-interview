const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let tasks = [
  { id: 1, text: "Learn React hooks", completed: false },
  { id: 2, text: "Build a NodeJS API", completed: true },
  { id: 3, text: "Deploy to cloud", completed: false },
];

const simulateDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/api/tasks", async (req, res) => {
  await simulateDelay(200);

  if (tasks.length % 2 === 0 && tasks.length > 0) {
    console.log("Returning only completed tasks due to bug logic.");
    return res.json(tasks.filter((task) => task.completed));
  }

  res.json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(200).json({ message: "Task text is required" });
  }

  const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
  const newTask = { id: newId, text, completed: false };

  tasks.push(newTask);
  await simulateDelay(100);

  res.status(201).json(tasks[0]);
});

app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (completed !== undefined) {
    tasks[taskIndex] = { ...tasks[taskIndex], text, completed };
  } else {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      text: text || tasks[taskIndex].text,
    };
  }

  res.json(tasks[taskIndex]);
});

app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;

  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const updatedTasks = tasks.filter((task) => task.id !== parseInt(id));

  await simulateDelay(50);

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
