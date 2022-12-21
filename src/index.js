const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(req, res, next) {
  const { username } = req.headers;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    });
  };
  req.user = user;
  return next();
};

app.post('/users', (req, res) => {
  const { name, username } = req.body;

  const userAlreadyExist = users.some(user => user.username === username);

  if (userAlreadyExist) {
    res.status(400).send('User already exists');
  } else {
    const user = {
      id: uuidv4(),
      name,
      username,
      todos: []
    };
    users.push(user);
    res.status(201).json(user);
  };
});

app.get('/todos', checksExistsUserAccount, (req, res) => {
  const { username } = req.headers;

  const customer = users.find(user => user.username === username);

  return res.json(customer.todos);
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  const { user } = req;
  const { title, deadline } = req.body;
  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(todo);
  return res.status(201).send('create a new todo')
});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  const { user } = req; // Talver colocar headers
  const { title, deadline } = req.body;
  const { id } = req.params;

  const indexOfTodo = user.todos.findIndex(todo => todo.id === id); // return a number, if number = -1, item not found
  if (indexOfTodo < 0) {
    return res.status(404).send({ message: 'Todo not found' });
  }

  const todoUpdate = user.todos[indexOfTodo];
  title ? todoUpdate.title = title : false;
  deadline ? todoUpdate.deadline = deadline : false;

  return res.status(204).send('Todo is update');

});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  const { user } = req;
  const { id } = req.params;

  const indexOfTodo = user.todos.findIndex(todo => todo.id === id);
  if (indexOfTodo < 0) { 
    return res.status(404).send('Not found todo');
  }
  user.todos[indexOfTodo].done = true;
  return res.status(201).send('Todo is update');
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  
});

module.exports = app;