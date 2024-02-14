const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Allow cross-origin requests
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todos', {
 
});

const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

app.use(express.json());

// API routes
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const { text } = req.body;
  const todo = new Todo({ text, completed: false });
  await todo.save();
  res.status(201).json(todo);
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  try {
    // Find the todo by ID and update both text and completed fields
    const todo = await Todo.findByIdAndUpdate(id, { text, completed }, { new: true });

    if (!todo) {
      // If todo with the given ID is not found, return a 404 status
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Send the updated todo as a response
    res.json(todo);
  } catch (error) {
    // Handle any errors that occur during the update process
    console.error('Error updating todo:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.status(204).end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
