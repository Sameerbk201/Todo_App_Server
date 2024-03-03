const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const port = 5000;
const path = require("path");
app.use(cors());
app.use(express.json());
/* serve static file */
app.use(express.static(path.join(__dirname, "build")));
// Create and connect to SQLite database
const db = new sqlite3.Database("./todo.db");

// Create todo table if not exists
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS todo (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT)"
  );
});

// Middleware
app.use(express.json());

// Routes
app.get("/todos", (req, res) => {
  try {
    db.all("SELECT * FROM todo", (err, rows) => {
      if (err) {
        throw err;
      }
      res.json(rows);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/todos", (req, res) => {
  try {
    const task = req.body.task;
    if (!task) {
      throw new Error("Task is required");
    }

    db.run("INSERT INTO todo (task) VALUES (?)", [task], function (err) {
      if (err) {
        throw err;
      }

      // Fetch the inserted row from the database
      db.get(
        "SELECT id, task FROM todo WHERE id = ?",
        this.lastID,
        (err, row) => {
          if (err) {
            throw err;
          }

          res.json(row); // Return the inserted row with id and task
        }
      );
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/todos/:id", (req, res) => {
  try {
    const id = req.params.id;
    const task = req.body.task;
    if (!task) {
      throw new Error("Task is required");
    }

    db.run("UPDATE todo SET task = ? WHERE id = ?", [task, id], function (err) {
      if (err) {
        throw err;
      }
      res.json({ message: "Task updated successfully" });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/todos/:id", (req, res) => {
  try {
    const id = req.params.id;

    db.run("DELETE FROM todo WHERE id = ?", id, function (err) {
      if (err) {
        throw err;
      }
      res.json({ message: "Task deleted successfully" });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Serve React app for any other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
