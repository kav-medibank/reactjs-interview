// @ts-nocheck

import { useEffect, useState } from "react";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching tasks...");
    fetch("http://localhost:3001/api/tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);

        console.log("Tasks loaded:", tasks);
      })
      .catch((err) => {
        setError("Failed to fetch tasks: " + err.message);
      });
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) {
      setError("Task description cannot be empty!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newTask }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task: " + response.statusText);
      }

      const addedTask = await response.json();

      setTasks((currentTasks) => [...currentTasks, addedTask]);

      setNewTask("");
      setError(null);
    } catch (err) {
      setError("Error adding task: " + err.message);
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete task: " + response.statusText);
      }

      setTasks(tasks.filter((task) => task.id !== id));
      setError(null);
    } catch (err) {
      setError("Error deleting task: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          My Task List
        </h1>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <div className="flex mb-6">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-5 py-3 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Add Task
          </button>
        </div>

        <div>
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500">
              No tasks yet. Add one above!
            </p>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-2 shadow-sm border border-gray-200">
                  <span
                    className={`flex-grow text-gray-700 cursor-pointer ${
                      task.completed ? "line-through text-gray-400" : ""
                    }`}
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="ml-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors text-xs"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskList;
