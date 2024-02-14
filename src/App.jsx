import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [updateTodo, setUpdateTodo] = useState({ id: '', text: '' });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/todos');
      if (!response.ok) throw new Error(`Failed to fetch todos: ${response.status} ${response.statusText}`);
      setTodos(await response.json());
    } catch (error) {
      console.error('Error fetching todos:', error.message);
    }
  };

  const addOrUpdateTodo = async (url, method, data) => {
    try {
      const response = await fetch(`http://localhost:5000/api/todos${url}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Failed to ${method === 'POST' ? 'add' : 'update'} todo: ${response.status} ${response.statusText}`);

      fetchTodos();
      setNewTodo('');
      setUpdateTodo({ id: '', text: '' });
    } catch (error) {
      console.error(`Error ${method === 'POST' ? 'adding' : 'updating'} todo:`, error.message);
    }
  };

  const deleteTodo = (id) => addOrUpdateTodo(`/${id}`, 'DELETE');

  const startUpdateTodo = (id, text) => setUpdateTodo({ id, text });

  const updateTodoItem = () => addOrUpdateTodo(`/${updateTodo.id}`, 'PUT', { text: updateTodo.text });

  // ... (your existing code)

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <div className="input-container">
        <input
          type="text"
          id="taskInput"
          placeholder="Add a new task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button className='my-button' onClick={() => addOrUpdateTodo('', 'POST', { text: newTodo })}>
          <FontAwesomeIcon icon={faPlus} /> Add Task
        </button>
      </div>
      <ul id="taskList">
        {todos.map((todo) => (
          <li key={todo._id}>
            {todo.text}{' '}
            <div className="button-group">
              <button onClick={() => deleteTodo(todo._id)}>
                <FontAwesomeIcon icon={faTrash} /> 
              </button>
              <button className='edi' onClick={() => startUpdateTodo(todo._id, todo.text)}>
                <FontAwesomeIcon icon={faPencilAlt} /> 
              </button>
            </div>
          </li>
        ))}
      </ul>
      {updateTodo.id && (
        <div>
          <input
            type="text"
            value={updateTodo.text}
            onChange={(e) => setUpdateTodo({ ...updateTodo, text: e.target.value })}
          />
          <button className='update' onClick={updateTodoItem}>
            <FontAwesomeIcon icon={faEdit} /> 
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
